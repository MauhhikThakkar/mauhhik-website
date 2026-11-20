/* eslint-disable */
// PM Planning Toolkit engine.
// Framework-free on purpose: it binds to the static markup in toolkitMarkup.ts,
// draws its charts as inline SVG, keeps each visitor's inputs in localStorage
// and never sends data anywhere. Covered by a 94-check Playwright suite.

export function initToolkit() {
  "use strict";
  
  var KEY = "pm-toolkit-v2";
  var TABS = ["capacity","forecast","pert","prioritise","poker","risk"];

  /* ---------- helpers ---------- */
  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function num(v){ var n = parseFloat(v); return isFinite(n) ? n : 0; }
  function fmt(n, d){ return Number(n).toLocaleString("en-US", {maximumFractionDigits:d||0, minimumFractionDigits:d||0}); }
  function pct(n){ return fmt(n * 100) + "%"; }
  function iso(d){ return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0"); }
  function parseISO(s){ var p = String(s || "").split("-"); if(p.length < 3) return null; var d = new Date(+p[0], +p[1]-1, +p[2]); return isNaN(d.getTime()) ? null : d; }
  function fmtDate(d){ return d ? d.toLocaleDateString("en-GB", {weekday:"short", day:"numeric", month:"short", year:"numeric"}) : "–"; }
  function shortDate(d){ return d ? d.toLocaleDateString("en-GB", {day:"numeric", month:"short"}) : "–"; }
  function isWeekend(d){ return d.getDay() === 0 || d.getDay() === 6; }
  function nextMonday(){ var d = new Date(); d.setHours(0,0,0,0); var add = (8 - d.getDay()) % 7 || 7; d.setDate(d.getDate() + add); return d; }
  function addDays(d, n){ var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function addWorkdays(start, n){
    var d = new Date(start); n = Math.max(1, Math.ceil(n - 1e-9));
    while(isWeekend(d)) d.setDate(d.getDate() + 1);
    var c = 1; while(c < n){ d.setDate(d.getDate() + 1); if(!isWeekend(d)) c++; }
    return d;
  }
  function sprintEnd(start, weeks, k){ var d = addDays(start, 7 * weeks * k - 1); while(isWeekend(d)) d.setDate(d.getDate() - 1); return d; }
  function percentile(sorted, p){ if(!sorted.length) return 0; var i = Math.min(sorted.length - 1, Math.max(0, Math.ceil(p * sorted.length) - 1)); return sorted[i]; }
  function normCdf(z){ var t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2); var y = 1 - (((((1.061405429*t - 1.453152027)*t) + 1.421413741)*t - 0.284496736)*t + 0.254829592) * t * Math.exp(-z*z/2); return z >= 0 ? (1 + y) / 2 : (1 - y) / 2; }
  function randn(){ var u = 0, v = 0; while(u === 0) u = Math.random(); while(v === 0) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function gamma(k){ var d = k - 1/3, c = 1 / Math.sqrt(9 * d); for(;;){ var x, v; do { x = randn(); v = 1 + c * x; } while(v <= 0); v = v*v*v; var u = Math.random(); if(u < 1 - 0.0331 * x*x*x*x) return d * v; if(Math.log(u) < 0.5*x*x + d*(1 - v + Math.log(v))) return d * v; } }
  function betaPert(o, m, p){ if(p <= o) return o; var a = 1 + 4 * (m - o) / (p - o), b = 1 + 4 * (p - m) / (p - o); var x = gamma(a), y = gamma(b); return o + (x / (x + y)) * (p - o); }

  function flash(id, msg){ var el = $(id); el.textContent = msg; setTimeout(function(){ el.textContent = ""; }, 2500); }
  function copyText(text, statusId, fallbackId){
    $(fallbackId).innerHTML = "";
    function fallback(){
      $(fallbackId).innerHTML = '<p class="hint">Copying is blocked here. Select the text below and copy it.</p><textarea class="fallback" readonly aria-label="Text to copy"></textarea>';
      var ta = $(fallbackId).querySelector("textarea"); ta.value = text; ta.focus(); ta.select();
    }
    try { navigator.clipboard.writeText(text).then(function(){ flash(statusId, "Copied"); }, fallback); } catch(e){ fallback(); }
  }
  /* ---------- chart helpers ---------- */
  var charts = {};
  function chartW(el){ var w = el && el.clientWidth; return Math.max(280, Math.min(760, w || 340)); }
  function lin(d0, d1, r0, r1){ var k = (r1 - r0) / ((d1 - d0) || 1); return function(v){ return r0 + (v - d0) * k; }; }
  function niceStep(range, n){ var raw = range / n, mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), f = raw / mag; return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * mag; }
  function tipText(s){ return esc(s).replace(/\n/g, "&#10;"); }
  function trunc(s, n){ s = String(s); return s.length > n ? s.slice(0, Math.max(1, n - 1)) + "…" : s; }
  function svgOpen(W, H, label){ return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(label) + '">'; }
  function host(id){
    var box = $(id); if(!box) return null;
    if(!box._plot){
      box._plot = document.createElement("div"); box.appendChild(box._plot);
      var tip = document.createElement("div"); tip.className = "tip"; tip.setAttribute("aria-hidden", "true"); box.appendChild(tip);
      var show = function(m, x, y){ tip.textContent = m.getAttribute("data-tip"); tip.style.display = "block"; var tw = tip.offsetWidth, bw = box.clientWidth; tip.style.left = Math.min(Math.max(x, tw / 2 + 2), bw - tw / 2 - 2) + "px"; tip.style.top = y + "px"; };
      var at = function(m){ var r = box.getBoundingClientRect(), mr = m.getBoundingClientRect(); show(m, mr.left - r.left + mr.width / 2, mr.top - r.top); };
      box.addEventListener("mousemove", function(e){ var m = e.target.closest("[data-tip]"); if(!m){ tip.style.display = "none"; return; } var r = box.getBoundingClientRect(); show(m, e.clientX - r.left, e.clientY - r.top); });
      box.addEventListener("mouseleave", function(){ tip.style.display = "none"; });
      box.addEventListener("focusin", function(e){ var m = e.target.closest("[data-tip]"); if(m) at(m); });
      box.addEventListener("focusout", function(){ tip.style.display = "none"; });
      box.addEventListener("click", function(e){ var m = e.target.closest("[data-tip]"); if(m) at(m); });
    }
    return box;
  }
  function draw(name, fn, args){ charts[name] = [fn, args]; fn.apply(null, args); }
  function redrawCharts(){ Object.keys(charts).forEach(function(k){ charts[k][0].apply(null, charts[k][1]); }); }
  var rzT = null; function onResize(){ clearTimeout(rzT); rzT = setTimeout(redrawCharts, 150); }
  window.addEventListener("resize", onResize);

  // Capacity: one whole split into parts (tall segmented bar)
  function capSplitChart(parts, total){
    var box = host("cap-split"); if(!box) return;
    var shown = parts.filter(function(p){ return p.v > 0.05; });
    box._plot.innerHTML = total > 0 ? '<div class="segbar" role="img" aria-label="' + esc(shown.map(function(p){ return p.name + " " + fmt(p.v) + " hours"; }).join(", ")) + '">' + shown.map(function(p){
      var share = p.v / total;
      return '<div tabindex="0" style="flex:' + p.v.toFixed(3) + ' 1 0;background:' + p.c + '" class="' + (p.dark ? "dark" : "") + '" data-tip="' + tipText(p.name + "\n" + fmt(p.v) + " h · " + pct(share) + " of paid hours") + '">' + (share >= 0.1 ? pct(share) : "") + '</div>';
    }).join("") + '</div>' : '<p class="hint">Add people to see the split.</p>';
    $("cap-legend").innerHTML = shown.map(function(p){ return '<span><i style="background:' + p.c + '"></i>' + p.name + ' · ' + fmt(p.v) + ' h</span>'; }).join("");
    $("cap-split-total").textContent = fmt(total) + " paid hours";
  }

  // Forecast: cumulative chance of finishing by each Sprint (step line)
  function forecastChart(d){
    var box = host("f-chart"); if(!box) return;
    if(!d){ box._plot.innerHTML = ""; return; }
    var W = chartW(box), H = 230, m = {l:40, r:14, t:18, b:40};
    var x = lin(d.lo - 0.5, d.hi + 0.5, m.l, W - m.r), y = lin(0, 1, H - m.b, m.t);
    var o = svgOpen(W, H, "Cumulative chance of finishing by Sprint. 85% by " + d.d85 + ", 50% by " + d.d50);
    [0, .25, .5, .75, 1].forEach(function(v){ o += '<line class="axis" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '"/><text x="' + (m.l - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + (v * 100) + '%</text>'; });
    var path = "M" + x(d.lo - 0.5) + "," + y(d.base), area = path;
    d.pts.forEach(function(p){ var seg = " L" + x(p.s - 0.5) + "," + y(p.p) + " L" + x(p.s + 0.5) + "," + y(p.p); path += seg; area += seg; });
    area += " L" + x(d.hi + 0.5) + "," + y(0) + " L" + x(d.lo - 0.5) + "," + y(0) + " Z";
    o += '<path d="' + area + '" fill="var(--accent-soft)"/>';
    if(d.target != null && d.target >= d.lo - 0.5 && d.target <= d.hi + 0.5){
      var tx = x(d.target + 0.5); o += '<line x1="' + tx + '" x2="' + tx + '" y1="' + m.t + '" y2="' + (H - m.b) + '" stroke="var(--ink)" stroke-width="1.5"/><text x="' + (tx + 4) + '" y="' + (H - m.b - 6) + '" text-anchor="start" style="fill:var(--ink);font-weight:600">Target</text>';
    }
    o += '<line class="ref" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(.85) + '" y2="' + y(.85) + '" stroke-dasharray="3 3"/>';
    o += '<path d="' + path + '" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round"/>';
    var every = Math.max(1, Math.ceil(d.pts.length / Math.floor((W - m.l - m.r) / 52)));
    d.pts.forEach(function(p, i){
      var cx = x(p.s), cy = y(p.p), is85 = p.s === d.p85;
      o += '<g tabindex="0" data-tip="' + tipText("Sprint " + p.s + " · ends " + p.date + "\n" + pct(p.p) + " chance it's all done") + '"><circle cx="' + cx + '" cy="' + cy + '" r="14" fill="transparent"/><circle class="mk" cx="' + cx + '" cy="' + cy + '" r="' + (is85 ? 5.5 : 4) + '" fill="' + (is85 ? "var(--accent)" : "var(--surface)") + '" stroke="var(--accent)" stroke-width="2"/></g>';
      if(i % every === 0 || is85) o += '<text x="' + cx + '" y="' + (H - m.b + 15) + '" text-anchor="middle"' + (is85 ? ' style="fill:var(--ink);font-weight:600"' : '') + '>' + p.s + '</text><text x="' + cx + '" y="' + (H - m.b + 29) + '" text-anchor="middle">' + p.short + '</text>';
      if(is85){ var lx = Math.min(cx + 8, W - m.r - 4); o += '<text x="' + lx + '" y="' + (p.p > 0.6 ? cy + 18 : cy - 10) + '" text-anchor="' + (cx > W - 90 ? "end" : "start") + '" style="fill:var(--ink);font-weight:600">85% · ' + p.short + '</text>'; }
    });
    o += '<text x="' + (m.l + 4) + '" y="' + (y(.85) - 4) + '">85%</text>';
    box._plot.innerHTML = o + '</svg>';
  }

  // PERT: Gantt of the expected schedule
  function ganttChart(P, chain, T, s80){
    var box = host("p-gantt"); if(!box) return;
    if(!P.length){ box._plot.innerHTML = ""; return; }
    var W = chartW(box), rowH = 28, m = {t:10, b:30, r:14}, lw = Math.min(170, Math.round(W * 0.36)), H = m.t + P.length * rowH + m.b;
    var maxX = Math.max.apply(null, P.map(function(t){ return t.ef + t.float; }).concat([T || 0, s80 || 0])) * 1.04;
    var x = lin(0, maxX, lw, W - m.r), step = niceStep(maxX, Math.max(3, Math.floor((W - lw) / 60)));
    var o = svgOpen(W, H, "Gantt chart of the expected schedule. Critical path: tasks " + chain.slice().reverse().map(function(i){ return i + 1; }).join(", "));
    for(var v = 0; v <= maxX; v += step){ o += '<line class="axis" x1="' + x(v) + '" x2="' + x(v) + '" y1="' + m.t + '" y2="' + (H - m.b) + '"/><text x="' + x(v) + '" y="' + (H - m.b + 16) + '" text-anchor="middle">' + fmt(v) + '</text>'; }
    o += '<text x="' + (W - m.r) + '" y="' + (H - 2) + '" text-anchor="end">working days</text>';
    var chars = Math.floor((lw - 10) / 6.2);
    P.forEach(function(t, i){
      var cy = m.t + i * rowH + rowH / 2, crit = chain.indexOf(t.i) >= 0;
      o += '<text x="0" y="' + (cy + 4) + '"' + (crit ? ' style="fill:var(--ink);font-weight:600"' : '') + '>' + esc(trunc((t.i + 1) + ". " + t.name, chars)) + '</text>';
      if(t.float > 0.05) o += '<rect x="' + x(t.ef) + '" y="' + (cy - 6) + '" width="' + Math.max(0, x(t.ef + t.float) - x(t.ef)) + '" height="12" rx="3" fill="var(--grey-soft)"/>';
      o += '<g tabindex="0" data-tip="' + tipText((t.i + 1) + ". " + t.name + "\nDay " + fmt(t.es, 1) + " → " + fmt(t.ef, 1) + " (expected " + fmt(t.e, 1) + " d)\n" + (crit ? "On the critical path" : "Float " + fmt(t.float, 1) + " d")) + '"><rect x="' + x(t.es) + '" y="' + (cy - 11) + '" width="' + Math.max(8, x(t.ef) - x(t.es)) + '" height="22" fill="transparent"/><rect class="mk" x="' + x(t.es) + '" y="' + (cy - 6) + '" width="' + Math.max(3, x(t.ef) - x(t.es) - 2) + '" height="12" rx="3" fill="' + (crit ? "var(--accent)" : "var(--grey)") + '"/></g>';
    });
    if(T > 0){ var tx = x(T); o += '<line x1="' + tx + '" x2="' + tx + '" y1="' + (m.t - 4) + '" y2="' + (H - m.b) + '" stroke="var(--ink)" stroke-width="1.5"/>'; }
    if(s80){ var sx = x(s80); o += '<line x1="' + sx + '" x2="' + sx + '" y1="' + (m.t - 4) + '" y2="' + (H - m.b) + '" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="4 3"/><text x="' + (sx + 4) + '" y="' + (H - m.b - 4) + '" style="fill:var(--accent);font-weight:600">P80</text>'; }
    box._plot.innerHTML = o + '</svg>';
  }

  // PERT: cumulative probability, simulated vs classic
  function pertCurveChart(totals, E, sd, T){
    var box = host("p-curve"); if(!box) return;
    if(!totals.length){ box._plot.innerHTML = ""; return; }
    var W = chartW(box), H = 220, m = {l:40, r:14, t:14, b:34};
    var lo = Math.min(totals[0], sd > 0 ? E - 3 * sd : E), hi = Math.max(totals[totals.length - 1], sd > 0 ? E + 3 * sd : E, T || 0);
    if(hi - lo < 1){ lo -= 1; hi += 1; }
    var x = lin(lo, hi, m.l, W - m.r), y = lin(0, 1, H - m.b, m.t), N = 70;
    function simAt(v){ var a = 0, b = totals.length; while(a < b){ var c = (a + b) >> 1; if(totals[c] <= v) a = c + 1; else b = c; } return a / totals.length; }
    function clsAt(v){ return sd > 0 ? normCdf((v - E) / sd) : (v >= E ? 1 : 0); }
    var o = svgOpen(W, H, "Chance of finishing by working day, simulated against classic PERT");
    [0, .5, .8, 1].forEach(function(v){ o += '<line class="axis" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '"/><text x="' + (m.l - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + (v * 100) + '%</text>'; });
    var step = niceStep(hi - lo, Math.max(3, Math.floor((W - m.l) / 60)));
    for(var v = Math.ceil(lo / step) * step; v <= hi; v += step) o += '<text x="' + x(v) + '" y="' + (H - m.b + 16) + '" text-anchor="middle">' + fmt(v) + '</text>';
    o += '<text x="' + (W - m.r) + '" y="' + (H - 2) + '" text-anchor="end">working days</text>';
    var ps = "", pc = "";
    for(var i = 0; i <= N; i++){ var vv = lo + (hi - lo) * i / N; ps += (i ? " L" : "M") + x(vv).toFixed(1) + "," + y(simAt(vv)).toFixed(1); pc += (i ? " L" : "M") + x(vv).toFixed(1) + "," + y(clsAt(vv)).toFixed(1); }
    o += '<path d="' + pc + '" fill="none" stroke="var(--grey)" stroke-width="2"/><path d="' + ps + '" fill="none" stroke="var(--accent)" stroke-width="2"/>';
    if(T > 0 && T >= lo && T <= hi){
      var tx = x(T), sp = simAt(T), cp = clsAt(T);
      o += '<line x1="' + tx + '" x2="' + tx + '" y1="' + m.t + '" y2="' + (H - m.b) + '" stroke="var(--ink)" stroke-width="1.5"/>';
      o += '<g tabindex="0" data-tip="' + tipText("Target: day " + fmt(T) + "\nSimulated " + pct(sp) + " · classic PERT " + pct(cp)) + '"><circle cx="' + tx + '" cy="' + y(sp) + '" r="14" fill="transparent"/><circle class="mk" cx="' + tx + '" cy="' + y(sp) + '" r="5" fill="var(--accent)" stroke="var(--surface)" stroke-width="2"/><circle cx="' + tx + '" cy="' + y(cp) + '" r="4.5" fill="var(--grey)" stroke="var(--surface)" stroke-width="2"/></g>';
      var left = tx > W * 0.6;
      o += '<text x="' + (tx + (left ? -8 : 8)) + '" y="' + (y(sp) + (sp < cp ? 14 : -8)) + '" text-anchor="' + (left ? "end" : "start") + '" style="fill:var(--ink);font-weight:600">' + pct(sp) + ' simulated</text>';
      o += '<text x="' + (tx + (left ? -8 : 8)) + '" y="' + (y(cp) + (sp < cp ? -8 : 14)) + '" text-anchor="' + (left ? "end" : "start") + '">' + pct(cp) + ' classic</text>';
    }
    box._plot.innerHTML = o + '</svg>';
  }

  // Prioritise: value against effort (RICE/WSJF) or rank shift (Compare)
  function priChart(mode, rows){
    var box = host("pri-chart"); if(!box) return;
    if(!rows.length){ box._plot.innerHTML = ""; return; }
    var W = chartW(box), o;
    if(mode === "compare"){
      var n = rows.length, H = 34 + n * 30, lw = Math.min(160, Math.round(W * 0.42)), x1 = lw + 20, x2 = W - 40, y = function(r){ return 26 + (r - 1) * 30; };
      o = svgOpen(W, H, "Rank under RICE against rank under WSJF");
      o += '<text x="' + x1 + '" y="12" text-anchor="middle" style="font-weight:600">RICE</text><text x="' + x2 + '" y="12" text-anchor="middle" style="font-weight:600">WSJF</text>';
      rows.slice().sort(function(a, b){ return Math.abs(a.w - a.r) - Math.abs(b.w - b.r); }).forEach(function(rw){
        var big = Math.abs(rw.w - rw.r) >= 3, col = big ? "var(--accent)" : "var(--grey)";
        o += '<g tabindex="0" data-tip="' + tipText(rw.name + "\nRICE #" + rw.r + " · WSJF #" + rw.w + (big ? "\nMethods disagree" : "")) + '"><line x1="' + x1 + '" x2="' + x2 + '" y1="' + y(rw.r) + '" y2="' + y(rw.w) + '" stroke="transparent" stroke-width="14"/><line class="mk" x1="' + x1 + '" x2="' + x2 + '" y1="' + y(rw.r) + '" y2="' + y(rw.w) + '" stroke="' + col + '" stroke-width="2"/>' +
          '<circle cx="' + x1 + '" cy="' + y(rw.r) + '" r="5" fill="' + col + '" stroke="var(--surface)" stroke-width="2"/><circle cx="' + x2 + '" cy="' + y(rw.w) + '" r="5" fill="' + col + '" stroke="var(--surface)" stroke-width="2"/></g>' +
          '<text x="' + (x1 - 12) + '" y="' + (y(rw.r) + 4) + '" text-anchor="end"' + (big ? ' style="fill:var(--ink);font-weight:600"' : '') + '>' + esc(trunc(rw.name, Math.floor(lw / 6.4))) + '</text><text x="' + (x2 + 12) + '" y="' + (y(rw.w) + 4) + '">#' + rw.w + '</text>';
      });
      box._plot.innerHTML = o + '</svg>';
      $("pri-chart-title").textContent = "How the rank shifts between methods";
      $("pri-chart-note").textContent = "Blue lines mark items whose rank moves three or more places. Those are the ones to discuss.";
      return;
    }
    var H = 270, m = {l:46, r:16, t:16, b:40};
    var maxX = Math.max.apply(null, rows.map(function(r){ return r.x; }).concat([1])) * 1.15, maxY = Math.max.apply(null, rows.map(function(r){ return r.y; }).concat([1])) * 1.15;
    var x = lin(0, maxX, m.l, W - m.r), y = lin(0, maxY, H - m.b, m.t);
    var med = function(a){ var s = a.slice().sort(function(p, q){ return p - q; }), k = Math.floor((s.length - 1) / 2); return s.length % 2 ? s[k] : (s[k] + s[k + 1]) / 2; };
    var mx = med(rows.map(function(r){ return r.x; })), my = med(rows.map(function(r){ return r.y; }));
    o = svgOpen(W, H, (mode === "rice" ? "Value against effort" : "Cost of delay against job size") + " for " + rows.length + " items");
    o += '<rect x="' + m.l + '" y="' + m.t + '" width="' + (x(mx) - m.l) + '" height="' + (y(my) - m.t) + '" fill="var(--good-soft)" opacity=".6"/>';
    o += '<line class="axis" x1="' + x(mx) + '" x2="' + x(mx) + '" y1="' + m.t + '" y2="' + (H - m.b) + '"/><line class="axis" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(my) + '" y2="' + y(my) + '"/>';
    o += '<line class="axis" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + (H - m.b) + '" y2="' + (H - m.b) + '"/><line class="axis" x1="' + m.l + '" x2="' + m.l + '" y1="' + m.t + '" y2="' + (H - m.b) + '"/>';
    var q = mode === "rice" ? ["Quick wins", "Big bets", "Fill-ins", "Time sinks"] : ["Do first", "Plan carefully", "Batch together", "Question it"];
    o += '<text x="' + (m.l + 6) + '" y="' + (m.t + 13) + '" style="fill:var(--good);font-weight:600">' + q[0] + '</text><text x="' + (W - m.r - 6) + '" y="' + (m.t + 13) + '" text-anchor="end">' + q[1] + '</text>';
    o += '<text x="' + (m.l + 6) + '" y="' + (y(my) + 14) + '">' + q[2] + '</text><text x="' + (W - m.r - 6) + '" y="' + (y(my) + 14) + '" text-anchor="end">' + q[3] + '</text>';
    var xl = mode === "rice" ? "Effort (person-months) →" : "Job size →", yl = mode === "rice" ? "Value (reach × impact × confidence) →" : "Cost of delay →";
    o += '<text x="' + (W - m.r) + '" y="' + (H - 8) + '" text-anchor="end">' + xl + '</text><text transform="translate(12,' + (H - m.b) + ') rotate(-90)">' + yl + '</text>';
    rows.forEach(function(r){
      var cx = x(r.x), cy = y(r.y);
      o += '<g tabindex="0" data-tip="' + tipText("#" + r.rank + " " + r.name + "\n" + r.detail) + '"><circle cx="' + cx + '" cy="' + cy + '" r="15" fill="transparent"/><circle class="mk" cx="' + cx + '" cy="' + cy + '" r="10" fill="var(--accent)" stroke="var(--surface)" stroke-width="2"/><text x="' + cx + '" y="' + (cy + 4) + '" text-anchor="middle" style="fill:#fff;font-weight:600;pointer-events:none">' + r.rank + '</text></g>';
    });
    box._plot.innerHTML = o + '</svg>';
    $("pri-chart-title").textContent = mode === "rice" ? "Value against effort" : "Cost of delay against job size";
    $("pri-chart-note").textContent = "Numbers match the ranking above. The lines split the backlog at the median; top left is where the best ratio sits.";
  }

  // Poker: spread of revealed votes across the deck
  function pokerChart(nd, counts, suggest){
    var W = 340, H = 120, m = {l:4, r:4, t:16, b:22}, n = nd.length, bw = (W - m.l - m.r) / n, max = Math.max.apply(null, nd.map(function(c){ return counts[c] || 0; }).concat([1]));
    var o = svgOpen(W, H, "Vote spread: " + nd.filter(function(c){ return counts[c]; }).map(function(c){ return counts[c] + " × " + c; }).join(", "));
    o += '<line class="axis" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + (H - m.b) + '" y2="' + (H - m.b) + '"/>';
    nd.forEach(function(c, i){
      var v = counts[c] || 0, h = v / max * (H - m.t - m.b), bx = m.l + i * bw + 3;
      if(v) o += '<rect x="' + bx + '" y="' + (H - m.b - h) + '" width="' + (bw - 6) + '" height="' + h + '" rx="4" fill="' + (c === suggest ? "var(--accent)" : "var(--grey)") + '"/><text x="' + (bx + (bw - 6) / 2) + '" y="' + (H - m.b - h - 4) + '" text-anchor="middle" style="fill:var(--ink);font-weight:600">' + v + '</text>';
      o += '<text x="' + (bx + (bw - 6) / 2) + '" y="' + (H - 6) + '" text-anchor="middle"' + (c === suggest ? ' style="fill:var(--accent);font-weight:600"' : '') + '>' + esc(c) + '</text>';
    });
    return '<div class="chart" style="max-width:520px">' + o + '</svg></div>';
  }

  function csvCell(v){ v = String(v == null ? "" : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }

  /* ---------- state ---------- */
  function example(){
    var start = nextMonday();
    return {
      tab: "capacity",
      velocity: "34, 38, 31, 29, 40, 35",
      cap: { days:10, holidays:0, hpd:6, events:12, buffer:10,
        team:[
          {name:"Asha", role:"Backend developer", alloc:100, leave:0, other:0},
          {name:"Ravi", role:"Frontend developer", alloc:100, leave:2, other:0},
          {name:"Meera", role:"QA engineer", alloc:100, leave:0, other:6},
          {name:"Karan", role:"Backend developer", alloc:50, leave:0, other:0},
          {name:"Neha", role:"Designer", alloc:50, leave:1, other:0}
        ]},
      rel: { backlog:230, growth:3, weeks:2, start: iso(start), target: iso(addDays(start, 7*2*9 - 3)) },
      pert: { start: iso(start), target: 25,
        tasks:[
          {name:"Partner API access and credentials", o:3, m:5, p:15, after:""},
          {name:"Build and unit test", o:8, m:10, p:16, after:""},
          {name:"Integration testing in partner sandbox", o:3, m:5, p:12, after:"1, 2"},
          {name:"Security review", o:2, m:4, p:10, after:"2"},
          {name:"UAT and business sign-off", o:3, m:4, p:8, after:"3, 4"},
          {name:"Production cutover and hypercare", o:1, m:2, p:4, after:"5"}
        ]},
      pri: { method:"rice",
        items:[
          {name:"Bulk payout upload (CSV)", reach:1200, impact:2, conf:80, effort:2, bv:13, tc:8, rr:5, size:8},
          {name:"Failed-payment auto retry", reach:3000, impact:1, conf:80, effort:1, bv:8, tc:13, rr:8, size:5},
          {name:"Two-factor login", reach:5000, impact:0.5, conf:100, effort:1.5, bv:5, tc:5, rr:13, size:5},
          {name:"Partner API sandbox", reach:150, impact:3, conf:50, effort:3, bv:8, tc:3, rr:13, size:13},
          {name:"Dark mode", reach:4000, impact:0.25, conf:80, effort:1, bv:1, tc:1, rr:1, size:3}
        ]},
      poker: { deck:"cohn", people:"Asha, Ravi, Meera, Karan", cur:0, round:1, revealed:false, votes:{},
        stories:[
          {title:"Finance admin uploads a payout CSV and sees errors row by row", est:null, rounds:0},
          {title:"Retry a failed payment automatically, up to three times", est:null, rounds:0},
          {title:"Show sandbox credentials on the partner developer page", est:null, rounds:0},
          {title:"Export the monthly settlement report as PDF", est:null, rounds:0}
        ]},
      risk: { weeks:6, answers:{scope:2, change:1, deps:0, cpath:1, contingency:0, access:1, people:1, testing:2, rollback:0, gonogo:1, status:2, raid:1} }
    };
  }
  var S;
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch(e){ S = null; }
  var EX = example();
  if(!S || typeof S !== "object") S = EX;
  ["cap","rel","pert","pri","poker","risk"].forEach(function(k){ if(!S[k]) S[k] = EX[k]; });
  if(S.velocity == null) S.velocity = EX.velocity;
  function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} }

  /* ---------- tabs ---------- */
  function showTab(t){
    if(TABS.indexOf(t) < 0) t = "capacity";
    S.tab = t; save();
    TABS.forEach(function(x){
      $(x).hidden = x !== t;
      var b = $("tab-" + x); b.setAttribute("aria-selected", x === t); b.tabIndex = x === t ? 0 : -1;
    });
    if(location.hash !== "#" + t){ try { history.replaceState(null, "", "#" + t); } catch(e){} }
    if(t === "forecast") runForecast();
    if(t === "pert") runPert();
    redrawCharts();
  }
  document.querySelector(".tabs").addEventListener("click", function(e){ var b = e.target.closest("[data-tab]"); if(b){ showTab(b.dataset.tab); b.scrollIntoView({block:"nearest", inline:"nearest"}); } });
  document.querySelector(".tabs").addEventListener("keydown", function(e){
    if(e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    var i = TABS.indexOf(S.tab) + (e.key === "ArrowRight" ? 1 : -1); i = (i + TABS.length) % TABS.length;
    showTab(TABS[i]); $("tab-" + TABS[i]).focus();
  });
  function onHash(){ showTab(location.hash.slice(1)); }
  window.addEventListener("hashchange", onHash);

  /* ---------- shared velocity ---------- */
  function velocities(){ return String(S.velocity).split(/[,\s;]+/).map(num).filter(function(v){ return v > 0; }); }
  document.querySelectorAll("[data-shared=velocity]").forEach(function(el){
    el.value = S.velocity;
    el.addEventListener("input", function(){
      S.velocity = el.value; save();
      document.querySelectorAll("[data-shared=velocity]").forEach(function(o){ if(o !== el) o.value = el.value; });
      computeCap(); scheduleForecast();
    });
  });

  /* =====================================================
     1. SPRINT CAPACITY
     ===================================================== */
  function personHours(p, c, withLeave){
    var a = Math.max(0, Math.min(100, num(p.alloc))) / 100;
    var days = num(c.days) - (withLeave ? num(c.holidays) + num(p.leave) : 0);
    var gross = Math.max(0, days) * num(c.hpd) * a;
    var net = Math.max(0, gross - num(c.events) * a - (withLeave ? num(p.other) : 0));
    return { net: net * (1 - Math.max(0, Math.min(90, num(c.buffer))) / 100), paid: Math.max(0, num(c.days) - (withLeave ? num(c.holidays) + num(p.leave) : 0)) * num(c.hpd) * a };
  }
  function renderTeam(){
    $("team").innerHTML = S.cap.team.map(function(p, i){
      return '<div class="row" data-i="'+i+'">' +
        '<label class="field wide" for="p-name-'+i+'">Name<input id="p-name-'+i+'" data-f="name" value="'+esc(p.name)+'"></label>' +
        '<label class="field wide" for="p-role-'+i+'">Role<input id="p-role-'+i+'" data-f="role" value="'+esc(p.role)+'"></label>' +
        '<label class="field" for="p-alloc-'+i+'">On team %<input id="p-alloc-'+i+'" type="number" min="0" max="100" step="5" data-f="alloc" value="'+esc(p.alloc)+'"></label>' +
        '<label class="field" for="p-leave-'+i+'">Leave days<input id="p-leave-'+i+'" type="number" min="0" step="0.5" data-f="leave" value="'+esc(p.leave)+'"></label>' +
        '<label class="field" for="p-other-'+i+'">Other duties h<input id="p-other-'+i+'" type="number" min="0" step="1" data-f="other" value="'+esc(p.other || 0)+'"></label>' +
        '<button class="btn icon del" type="button" data-del="'+i+'" aria-label="Remove '+esc(p.name || "person")+'">Remove</button>' +
      '</div>';
    }).join("") || '<p class="hint">No one on the team yet. Add a person to start.</p>';
  }
  function computeCap(){
    var c = S.cap, hours = 0, full = 0, paid = 0, rows = [];
    c.team.forEach(function(p){
      var h = personHours(p, c, true), f = personHours(p, c, false);
      hours += h.net; full += f.net; paid += h.paid;
      rows.push({name: p.name || "Unnamed", h: h.net, f: f.net, paid: h.paid});
    });
    var ratio = full > 0 ? hours / full : 0;
    var sp = {focus:0, events:0, other:0, buffer:0, leave:0}, buf = Math.max(0, Math.min(90, num(c.buffer))) / 100;
    c.team.forEach(function(p){
      var a = Math.max(0, Math.min(100, num(p.alloc))) / 100, fullPaid = Math.max(0, num(c.days)) * num(c.hpd) * a;
      var lv = Math.min(fullPaid, Math.max(0, num(c.holidays) + num(p.leave)) * num(c.hpd) * a), avail = fullPaid - lv;
      var ev = Math.min(avail, num(c.events) * a), ot = Math.min(avail - ev, Math.max(0, num(p.other))), rest = avail - ev - ot;
      sp.leave += lv; sp.events += ev; sp.other += ot; sp.buffer += rest * buf; sp.focus += rest * (1 - buf);
    });
    draw("cap", capSplitChart, [[
      {name:"Focus time", v:sp.focus, c:"var(--s1)"}, {name:"Scrum events", v:sp.events, c:"var(--s2)"},
      {name:"Other duties", v:sp.other, c:"var(--s3)", dark:true}, {name:"Buffer", v:sp.buffer, c:"var(--s4)", dark:true},
      {name:"Leave and holidays", v:sp.leave, c:"var(--s5)", dark:true}], sp.focus + sp.events + sp.other + sp.buffer + sp.leave]);
    $("t-hours").textContent = fmt(hours);
    $("t-hours-sub").textContent = c.team.length + (c.team.length === 1 ? " person" : " people") + ", after events, duties and buffer";
    $("t-pct").textContent = pct(ratio);
    $("t-pct-sub").textContent = fmt(full) + " h with no leave or extra duties";
    $("focus-factor").textContent = "Focus factor " + (paid > 0 ? pct(hours / paid) : "–") + " of available hours";

    var v = velocities();
    if(v.length && full > 0){
      var avg = v.reduce(function(a,b){return a+b;},0) / v.length;
      $("t-pts").textContent = fmt(avg * ratio);
      $("t-pts-sub").textContent = v.length > 1 ? "range " + fmt(Math.min.apply(null, v) * ratio) + "–" + fmt(Math.max.apply(null, v) * ratio) + " points" : "story points";
    } else { $("t-pts").textContent = "–"; $("t-pts-sub").textContent = "add past velocity below"; }

    var flags = [];
    if(full > 0 && ratio < 0.75) flags.push('<span class="chip warn">Capacity is ' + pct(1 - ratio) + ' below a normal Sprint. Agree a smaller Sprint Goal.</span>');
    var zero = rows.filter(function(r){ return r.f > 0 && r.h === 0; });
    if(zero.length) flags.push('<span class="chip warn">' + zero.map(function(r){return esc(r.name);}).join(", ") + ' has no focus time this Sprint</span>');
    var heavy = c.team.filter(function(p){ var h = personHours(p, c, true); return num(p.other) > 0 && h.paid > 0 && num(p.other) / h.paid > 0.25; });
    if(heavy.length) flags.push('<span class="chip">' + heavy.map(function(p){return esc(p.name);}).join(", ") + ': other duties take over a quarter of their time</span>');
    if(num(c.buffer) === 0) flags.push('<span class="chip">No buffer set. Most teams keep 10 to 20% for unplanned work.</span>');
    if(v.length && v.length < 3) flags.push('<span class="chip">Add at least three Sprints of velocity for a meaningful range</span>');
    $("cap-flags").innerHTML = flags.join("");

    var max = Math.max.apply(null, rows.map(function(r){return r.f;}).concat([1]));
    $("breakdown").innerHTML = rows.map(function(r){
      return '<div class="bar"><span class="name">'+esc(r.name)+'</span><span class="track"><span class="fill" style="width:'+(r.h/max*100).toFixed(1)+'%"></span></span><span class="num">'+fmt(r.h)+' h</span></div>';
    }).join("") || '<p class="hint">Add people to see their hours.</p>';
    return {hours:hours, full:full, ratio:ratio, rows:rows, paid:paid};
  }
  document.querySelectorAll("#capacity [data-k]").forEach(function(el){
    el.value = S.cap[el.dataset.k];
    el.addEventListener("input", function(){ S.cap[el.dataset.k] = el.value; save(); computeCap(); });
  });
  $("team").addEventListener("input", function(e){
    var row = e.target.closest(".row"); if(!row || !e.target.dataset.f) return;
    S.cap.team[+row.dataset.i][e.target.dataset.f] = e.target.value; save(); computeCap();
  });
  $("team").addEventListener("click", function(e){
    var d = e.target.closest("[data-del]"); if(!d) return;
    S.cap.team.splice(+d.dataset.del, 1); save(); renderTeam(); computeCap();
  });
  $("add-person").addEventListener("click", function(){
    S.cap.team.push({name:"", role:"", alloc:100, leave:0, other:0}); save(); renderTeam(); computeCap();
    var n = $("team").querySelectorAll('[data-f="name"]'); if(n.length) n[n.length-1].focus();
  });
  $("reset-cap").addEventListener("click", function(){
    S.cap = example().cap; save();
    document.querySelectorAll("#capacity [data-k]").forEach(function(el){ el.value = S.cap[el.dataset.k]; });
    renderTeam(); computeCap(); flash("cap-status", "Example restored");
  });
  $("copy-cap").addEventListener("click", function(){
    var r = computeCap(), c = S.cap, v = velocities();
    var lines = ["Sprint capacity (" + c.days + " working days)",
      "Focus hours: " + fmt(r.hours) + " of " + fmt(r.full) + " at full strength (" + pct(r.ratio) + ")",
      "Focus factor: " + (r.paid > 0 ? pct(r.hours / r.paid) : "n/a") + " of available hours",
      "Assumptions: " + c.hpd + " productive h/day, " + c.events + " h of events per person, " + c.buffer + "% buffer, " + c.holidays + " team holiday days"];
    if(v.length && r.full > 0){
      var avg = v.reduce(function(a,b){return a+b;},0)/v.length;
      lines.push("Forecast: about " + fmt(avg * r.ratio) + " points (range " + fmt(Math.min.apply(null,v) * r.ratio) + "–" + fmt(Math.max.apply(null,v) * r.ratio) + ")");
    }
    lines.push("", "By person:");
    r.rows.forEach(function(x){ lines.push("- " + x.name + ": " + fmt(x.h) + " h"); });
    lines.push("", "Input to Sprint Planning; the Developers decide what they take on.");
    copyText(lines.join("\n"), "cap-status", "cap-fallback");
  });

  /* =====================================================
     2. RELEASE FORECAST (Monte Carlo on velocity history)
     ===================================================== */
  var fTimer = null, lastF = null;
  function scheduleForecast(){ clearTimeout(fTimer); fTimer = setTimeout(runForecast, 250); }
  document.querySelectorAll("#forecast [data-f]").forEach(function(el){
    el.value = S.rel[el.dataset.f];
    el.addEventListener("input", function(){ S.rel[el.dataset.f] = el.value; save(); scheduleForecast(); });
  });
  function runForecast(){
    var r = S.rel, v = velocities(), B = num(r.backlog), weeks = Math.max(1, num(r.weeks) || 2);
    var start = parseISO(r.start) || nextMonday(), target = parseISO(r.target);
    var add = B * Math.max(0, num(r.growth)) / 100, CAP = 104, RUNS = 10000;
    var flags = [];
    if(!v.length || B <= 0){
      ["f85","f50","ftarget"].forEach(function(id){ $(id).textContent = "–"; });
      $("f85-sub").textContent = !v.length ? "add velocity history" : "add remaining backlog";
      $("f50-sub").textContent = ""; $("ftarget-sub").textContent = "";
      $("f-hist").innerHTML = ""; $("f-naive").textContent = ""; $("f-statement").textContent = "Add your velocity history and remaining backlog to see a forecast.";
      $("f-flags").innerHTML = ""; lastF = null; draw("f", forecastChart, [null]); return;
    }
    var res = new Array(RUNS), never = 0;
    for(var i = 0; i < RUNS; i++){
      var rem = B, s = 0;
      while(rem > 0 && s < CAP){ s++; rem -= v[(Math.random() * v.length) | 0]; if(rem > 0) rem += add; }
      if(rem > 0) never++;
      res[i] = s;
    }
    res.sort(function(a,b){ return a - b; });
    var avg = v.reduce(function(a,b){return a+b;},0) / v.length;
    var p50 = percentile(res, 0.5), p85 = percentile(res, 0.85), p95 = percentile(res, 0.95);
    var d50 = sprintEnd(start, weeks, p50), d85 = sprintEnd(start, weeks, p85), d95 = sprintEnd(start, weeks, p95);

    if(never / RUNS > 0.15){
      flags.push('<span class="chip bad">In ' + pct(never / RUNS) + ' of runs the backlog never empties: scope arrives about as fast as the team delivers. Cut scope or slow intake.</span>');
    }
    $("f85").textContent = never / RUNS > 0.15 ? "No date" : shortDate(d85);
    $("f85-sub").textContent = p85 + " Sprints · 95% by " + shortDate(d95);
    $("f50").textContent = shortDate(d50);
    $("f50-sub").textContent = p50 + " Sprints";
    if(target){
      var avail = 0; while(avail < CAP && sprintEnd(start, weeks, avail + 1) <= target) avail++;
      var hit = 0; for(var j = 0; j < RUNS; j++){ if(res[j] <= avail) hit++; }
      $("ftarget").textContent = pct(hit / RUNS);
      $("ftarget-sub").textContent = avail + " Sprints to " + shortDate(target);
      if(hit / RUNS < 0.5) flags.push('<span class="chip warn">The target date is less likely than not. Reduce scope or move the date before committing.</span>');
    } else { $("ftarget").textContent = "–"; $("ftarget-sub").textContent = "set a target date"; }
    if(v.length < 5) flags.push('<span class="chip">Only ' + v.length + ' Sprints of history. Expect the range to move as you add more.</span>');
    var cv = Math.sqrt(v.reduce(function(a,b){ return a + (b-avg)*(b-avg); }, 0) / v.length) / avg;
    if(cv > 0.3) flags.push('<span class="chip warn">Velocity varies a lot from Sprint to Sprint (±' + pct(cv) + '). Look for the cause before trusting any date.</span>');
    $("f-flags").innerHTML = flags.join("");

    // histogram by sprint count
    var counts = {}; res.forEach(function(x){ counts[x] = (counts[x] || 0) + 1; });
    var lo = percentile(res, 0.01), hi = Math.min(percentile(res, 0.99), CAP);
    var maxC = 0; for(var k = lo; k <= hi; k++) maxC = Math.max(maxC, counts[k] || 0);
    var cum = 0; for(var k0 = res[0]; k0 < lo; k0++) cum += counts[k0] || 0;
    var html = '<div class="hrow" style="color:var(--muted);font-size:.75rem;text-transform:uppercase;letter-spacing:.04em"><span>Sprints</span><span class="d">Finish by</span><span class="track" style="visibility:hidden"></span><span class="num">Odds</span><span class="num">By then</span></div>';
    for(var s2 = lo; s2 <= hi; s2++){
      var c = counts[s2] || 0; cum += c;
      var mark = s2 === p85 ? " mark" : "";
      html += '<div class="hrow' + mark + '"><span class="num" style="text-align:left">' + s2 + (s2 === p85 ? " ◂" : "") + '</span><span class="d">' + shortDate(sprintEnd(start, weeks, s2)) + '</span><span class="track"><span class="fill' + (s2 <= p85 ? "" : " alt") + '" style="width:' + (maxC ? c / maxC * 100 : 0).toFixed(1) + '%"></span></span><span class="num">' + pct(c / RUNS) + '</span><span class="num">' + pct(cum / RUNS) + '</span></div>';
    }
    $("f-hist").innerHTML = html;
    var pts = [], cum2 = 0; for(var k1 = res[0]; k1 < lo; k1++) cum2 += counts[k1] || 0;
    var base = cum2 / RUNS;
    for(var s3 = lo; s3 <= hi; s3++){ cum2 += counts[s3] || 0; var de = sprintEnd(start, weeks, s3); pts.push({s:s3, p:cum2 / RUNS, date:fmtDate(de), short:shortDate(de)}); }
    var tgtS = null; if(target){ tgtS = 0; while(tgtS < CAP && sprintEnd(start, weeks, tgtS + 1) <= target) tgtS++; }
    draw("f", forecastChart, [{lo:lo, hi:hi, base:base, pts:pts, p85:p85, d85:fmtDate(d85), d50:fmtDate(d50), target:tgtS}]);

    var naive = avg > add ? Math.max(1, Math.round(B / (avg - add))) : null;
    if(naive){
      var hitN = 0; for(var q = 0; q < RUNS; q++){ if(res[q] <= naive) hitN++; }
      var pN = hitN / RUNS;
      var verdict = pN < 0.65 ? ' The simulation finishes by then in only <b>' + pct(pN) + '</b> of runs: close to coin-toss odds, which is why the 85% date is the one to commit to.'
        : ' The simulation finishes by then in <b>' + pct(pN) + '</b> of runs. Here the average-based date happens to be fairly safe; check it again as history grows.';
      $("f-naive").innerHTML = 'Dividing the backlog by average velocity net of new scope (' + fmt(avg - add, 1) + ' points per Sprint) gives about <b>' + naive + ' Sprints, ' + shortDate(sprintEnd(start, weeks, naive)) + '</b>.' + verdict;
    } else { $("f-naive").textContent = "Average velocity doesn't outpace incoming scope, so there is no average-based date."; }

    var stmt = never / RUNS > 0.15
      ? "At current pace and intake we can't forecast a finish date. We propose cutting scope or pausing new requests, then re-forecasting at the next Sprint Review."
      : "Based on our last " + v.length + " Sprints, we are 85% confident of finishing the remaining " + fmt(B) + " points by " + fmtDate(d85) + ", with a 50% chance by " + fmtDate(d50) + ". This assumes about " + fmt(num(r.growth)) + "% new scope per Sprint. We'll update this forecast at every Sprint Review.";
    $("f-statement").textContent = stmt;
    lastF = {stmt: stmt};
  }
  $("copy-f").addEventListener("click", function(){ if(lastF) copyText(lastF.stmt, "f-status", "f-fallback"); });
  $("reset-f").addEventListener("click", function(){
    var ex = example(); S.rel = ex.rel; S.velocity = ex.velocity; save();
    document.querySelectorAll("#forecast [data-f]").forEach(function(el){ el.value = S.rel[el.dataset.f]; });
    document.querySelectorAll("[data-shared=velocity]").forEach(function(el){ el.value = S.velocity; });
    runForecast(); computeCap(); flash("f-status", "Example restored");
  });

  /* =====================================================
     3. PERT + network simulation
     ===================================================== */
  var pTimer = null, lastP = null;
  function schedulePert(){ clearTimeout(pTimer); pTimer = setTimeout(runPert, 250); }
  function preds(t, i){
    return String(t.after || "").split(/[,\s;]+/).map(function(x){ return parseInt(x, 10) - 1; })
      .filter(function(x, k, arr){ return isFinite(x) && x >= 0 && x < i && arr.indexOf(x) === k; });
  }
  function renderTasks(){
    $("p-tasks").innerHTML = S.pert.tasks.map(function(t, i){
      return '<div class="prow" data-i="'+i+'"><span class="idx">'+(i+1)+'</span>' +
        '<label class="field pname" for="t-name-'+i+'">Task<input id="t-name-'+i+'" data-t="name" value="'+esc(t.name)+'"></label>' +
        '<label class="field po" for="t-o-'+i+'">Optimistic<input id="t-o-'+i+'" type="number" min="0" step="0.5" data-t="o" value="'+esc(t.o)+'"></label>' +
        '<label class="field" for="t-m-'+i+'">Likely<input id="t-m-'+i+'" type="number" min="0" step="0.5" data-t="m" value="'+esc(t.m)+'"></label>' +
        '<label class="field" for="t-p-'+i+'">Pessimistic<input id="t-p-'+i+'" type="number" min="0" step="0.5" data-t="p" value="'+esc(t.p)+'"></label>' +
        '<label class="field pafter" for="t-a-'+i+'">After<input id="t-a-'+i+'" data-t="after" value="'+esc(t.after)+'" placeholder="–"></label>' +
        '<button class="btn icon" type="button" data-del="'+i+'" aria-label="Remove task '+(i+1)+'">Remove</button></div>';
    }).join("") || '<p class="hint">No tasks yet. Add one to start.</p>';
  }
  function runPert(){
    var tasks = S.pert.tasks, n = tasks.length, start = parseISO(S.pert.start) || nextMonday(), T = num(S.pert.target);
    var flags = [];
    if(!n){ draw("gantt", ganttChart, [[], [], 0, 0]); draw("pcurve", pertCurveChart, [[], 0, 0, 0]); ["p80","pexp","ptarget"].forEach(function(id){ $(id).textContent = "–"; }); $("p-table").innerHTML = ""; $("p-flags").innerHTML = ""; lastP = null; return; }
    var P = tasks.map(function(t, i){
      var o = num(t.o), m = num(t.m), p = num(t.p);
      var bad = !(o <= m && m <= p);
      if(bad){ var s = [o, m, p].sort(function(a,b){return a-b;}); o = s[0]; m = s[1]; p = s[2]; }
      return {i:i, name: t.name || ("Task " + (i+1)), o:o, m:m, p:p, bad:bad, pr: preds(t, i), e:(o + 4*m + p)/6, sd:(p - o)/6};
    });
    // forward / backward pass on expected durations
    P.forEach(function(t){ t.es = t.pr.reduce(function(mx, j){ return Math.max(mx, P[j].ef); }, 0); t.ef = t.es + t.e; });
    var E = Math.max.apply(null, P.map(function(t){ return t.ef; }));
    var succ = P.map(function(){ return []; }); P.forEach(function(t){ t.pr.forEach(function(j){ succ[j].push(t.i); }); });
    for(var k = n - 1; k >= 0; k--){ var t = P[k]; t.lf = succ[k].length ? Math.min.apply(null, succ[k].map(function(s){ return P[s].ls; })) : E; t.ls = t.lf - t.e; t.float = Math.max(0, t.ls - t.es); }
    // trace one critical chain for classic PERT variance
    var cur = P.reduce(function(a, b){ return b.ef > a.ef ? b : a; }), chain = [];
    while(cur){ chain.push(cur.i); var prev = null; cur.pr.forEach(function(j){ if(!prev || P[j].ef > prev.ef) prev = P[j]; }); cur = prev; }
    var varCP = chain.reduce(function(s, i){ return s + P[i].sd * P[i].sd; }, 0), sdCP = Math.sqrt(varCP);
    // Monte Carlo on the whole network
    var RUNS = 5000, totals = new Array(RUNS), critCount = P.map(function(){ return 0; }), d = new Array(n), ef = new Array(n);
    for(var r = 0; r < RUNS; r++){
      for(var a = 0; a < n; a++){ d[a] = betaPert(P[a].o, P[a].m, P[a].p); var es = 0; for(var b = 0; b < P[a].pr.length; b++){ es = Math.max(es, ef[P[a].pr[b]]); } ef[a] = es + d[a]; }
      var endI = 0; for(var c = 1; c < n; c++){ if(ef[c] > ef[endI]) endI = c; }
      totals[r] = ef[endI];
      var x = endI; while(x != null){ critCount[x]++; var nx = null; for(var q = 0; q < P[x].pr.length; q++){ var j2 = P[x].pr[q]; if(nx == null || ef[j2] > ef[nx]) nx = j2; } x = nx; }
    }
    totals.sort(function(a,b){ return a - b; });
    var s50 = percentile(totals, 0.5), s80 = percentile(totals, 0.8), s95 = percentile(totals, 0.95);
    $("p80").textContent = shortDate(addWorkdays(start, s80));
    $("p80-sub").textContent = fmt(s80, 1) + " working days (simulated)";
    $("pexp").textContent = fmt(E, 1) + " d";
    $("pexp-sub").textContent = "±" + fmt(sdCP, 1) + " d · " + shortDate(addWorkdays(start, E));
    if(T > 0){
      var hit = 0; for(var h = 0; h < RUNS; h++){ if(totals[h] <= T) hit++; }
      var simP = hit / RUNS, pertP = sdCP > 0 ? normCdf((T - E) / sdCP) : (E <= T ? 1 : 0);
      $("ptarget").textContent = pct(simP);
      $("ptarget-sub").textContent = "classic PERT says " + pct(pertP) + " · " + shortDate(addWorkdays(start, T));
      if(pertP - simP > 0.08) flags.push('<span class="chip warn">Merge bias: classic PERT overstates your chance of hitting ' + fmt(T) + ' days by ' + fmt((pertP - simP) * 100) + ' points, because parallel paths can each delay the finish.</span>');
    } else { $("ptarget").textContent = "–"; $("ptarget-sub").textContent = "set a target"; }
    var tails = [];
    P.forEach(function(t){
      if(t.bad) flags.push('<span class="chip bad">Task ' + (t.i+1) + ': estimates were out of order, so they were sorted. Check them.</span>');
      if(t.m > 0 && t.p >= 2.5 * t.m && t.p - t.m >= 3) tails.push(t.i + 1);
    });
    if(tails.length) flags.push('<span class="chip warn">Long tail on task' + (tails.length > 1 ? "s " : " ") + tails.join(", ") + ': the pessimistic estimate is 2.5 times the likely one or more. Act on the cause now.</span>');
    tasks.forEach(function(t, i){ var given = String(t.after || "").split(/[,\s;]+/).filter(Boolean).length; if(given > P[i].pr.length) flags.push('<span class="chip">Task ' + (i+1) + ': predecessors must be earlier task numbers; some were ignored.</span>'); });
    $("p-flags").innerHTML = flags.join("");

    var rows = P.map(function(t){
      var ci = critCount[t.i] / RUNS;
      return '<tr class="' + (chain.indexOf(t.i) >= 0 ? "crit" : "") + '"><td>' + (t.i+1) + '. ' + esc(t.name) + '</td><td class="n">' + fmt(t.e, 1) + '</td><td class="n">±' + fmt(t.sd, 1) + '</td><td class="n">' + fmt(t.float, 1) + '</td><td class="n">' + pct(ci) + '</td></tr>';
    }).join("");
    $("p-table").innerHTML = '<thead><tr><th>Task</th><th class="n">Expected</th><th class="n">±</th><th class="n">Float</th><th class="n">Critical in</th></tr></thead><tbody>' + rows + '</tbody>' +
      '<tfoot><tr><td><b>Finish</b> (P50 / P80 / P95, simulated)</td><td class="n" colspan="4">' + fmt(s50,1) + ' / ' + fmt(s80,1) + ' / ' + fmt(s95,1) + ' d</td></tr></tfoot>';
    draw("gantt", ganttChart, [P, chain, T, s80]);
    draw("pcurve", pertCurveChart, [totals, E, sdCP, T]);
    lastP = {P:P, crit:critCount, runs:RUNS, s50:s50, s80:s80, s95:s95, E:E, sd:sdCP, start:start};
  }
  document.querySelectorAll("#pert [data-p]").forEach(function(el){
    el.value = S.pert[el.dataset.p];
    el.addEventListener("input", function(){ S.pert[el.dataset.p] = el.value; save(); schedulePert(); });
  });
  $("p-tasks").addEventListener("input", function(e){
    var row = e.target.closest(".prow"); if(!row || !e.target.dataset.t) return;
    S.pert.tasks[+row.dataset.i][e.target.dataset.t] = e.target.value; save(); schedulePert();
  });
  $("p-tasks").addEventListener("click", function(e){
    var dl = e.target.closest("[data-del]"); if(!dl) return;
    S.pert.tasks.splice(+dl.dataset.del, 1); save(); renderTasks(); runPert();
  });
  $("add-task").addEventListener("click", function(){
    var n = S.pert.tasks.length;
    S.pert.tasks.push({name:"", o:1, m:2, p:4, after: n ? String(n) : ""}); save(); renderTasks(); runPert();
    var ins = $("p-tasks").querySelectorAll('[data-t="name"]'); if(ins.length) ins[ins.length-1].focus();
  });
  $("reset-p").addEventListener("click", function(){
    S.pert = example().pert; save();
    document.querySelectorAll("#pert [data-p]").forEach(function(el){ el.value = S.pert[el.dataset.p]; });
    renderTasks(); runPert(); flash("p-status", "Example restored");
  });
  $("copy-p").addEventListener("click", function(){
    if(!lastP) return;
    var lines = ["Task,Optimistic,Likely,Pessimistic,After,Expected,Spread,Float,Critical in %"];
    lastP.P.forEach(function(t){ lines.push([csvCell(t.name), t.o, t.m, t.p, csvCell(S.pert.tasks[t.i].after), t.e.toFixed(1), t.sd.toFixed(1), t.float.toFixed(1), Math.round(lastP.crit[t.i] / lastP.runs * 100)].join(",")); });
    lines.push("", "Simulated finish (working days),P50 " + lastP.s50.toFixed(1) + ",P80 " + lastP.s80.toFixed(1) + ",P95 " + lastP.s95.toFixed(1));
    lines.push("P80 date," + csvCell(fmtDate(addWorkdays(lastP.start, lastP.s80))));
    copyText(lines.join("\n"), "p-status", "p-fallback");
  });

  /* =====================================================
     4. PRIORITISE (RICE / WSJF / Compare)
     ===================================================== */
  var FIB = [1,2,3,5,8,13,20];
  var IMPACT = [[3,"3 · Massive"],[2,"2 · High"],[1,"1 · Medium"],[0.5,"0.5 · Low"],[0.25,"0.25 · Minimal"]];
  var CONF = [[100,"100% · High"],[80,"80% · Medium"],[50,"50% · Low"]];
  function rice(it){ var e = num(it.effort); return e > 0 ? num(it.reach) * num(it.impact) * (num(it.conf)/100) / e : 0; }
  function wsjf(it){ var s = num(it.size); return s > 0 ? (num(it.bv) + num(it.tc) + num(it.rr)) / s : 0; }
  function method(){ return S.pri.method; }
  function score(it){ return method() === "wsjf" ? wsjf(it) : rice(it); }
  function scoreText(n, m){ return (m || method()) === "wsjf" ? fmt(n, 1) : fmt(n); }
  function opts(list, val){
    return list.map(function(o){ var v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o; return '<option value="'+v+'"'+(num(val) === v ? " selected" : "")+'>'+l+'</option>'; }).join("");
  }
  function ranksBy(fn){ var l = S.pri.items.map(function(it, i){ return {i:i, s:fn(it)}; }); l.sort(function(a,b){ return b.s - a.s; }); var r = {}; l.forEach(function(x, k){ r[x.i] = k + 1; }); return r; }
  function renderItems(){
    var m = method();
    document.querySelectorAll("#prioritise [data-m]").forEach(function(b){ b.setAttribute("aria-pressed", b.dataset.m === m); });
    $("m-desc").textContent = m === "rice" ? "Reach × Impact × Confidence ÷ Effort" : m === "wsjf" ? "Cost of Delay ÷ Job Size" : "Rank under both methods";
    $("formula").textContent = m === "rice" ? "RICE = Reach (people per quarter) × Impact × Confidence ÷ Effort (person-months)"
      : m === "wsjf" ? "WSJF = (Business value + Time criticality + Risk reduction or opportunity enablement) ÷ Job size"
      : "Δ = WSJF rank − RICE rank. Large gaps mean the item's value is unclear.";
    if(m === "compare"){
      $("items").innerHTML = '<p class="hint">Switch to RICE or WSJF to edit scores. Compare reads both sets of scores you have already entered.</p>';
    } else {
      $("items").innerHTML = S.pri.items.map(function(it, i){
        var fields = m === "rice"
          ? '<label class="field" for="r-reach-'+i+'">Reach (per quarter)<input id="r-reach-'+i+'" type="number" min="0" step="10" data-f="reach" value="'+esc(it.reach)+'"></label>' +
            '<label class="field" for="r-impact-'+i+'">Impact<select id="r-impact-'+i+'" data-f="impact">'+opts(IMPACT, it.impact)+'</select></label>' +
            '<label class="field" for="r-conf-'+i+'">Confidence<select id="r-conf-'+i+'" data-f="conf">'+opts(CONF, it.conf)+'</select></label>' +
            '<label class="field" for="r-effort-'+i+'">Effort (person-months)<input id="r-effort-'+i+'" type="number" min="0" step="0.5" data-f="effort" value="'+esc(it.effort)+'"></label>'
          : '<label class="field" for="w-bv-'+i+'">Business value<select id="w-bv-'+i+'" data-f="bv">'+opts(FIB, it.bv)+'</select></label>' +
            '<label class="field" for="w-tc-'+i+'">Time criticality<select id="w-tc-'+i+'" data-f="tc">'+opts(FIB, it.tc)+'</select></label>' +
            '<label class="field" for="w-rr-'+i+'">Risk reduction / opportunity<select id="w-rr-'+i+'" data-f="rr">'+opts(FIB, it.rr)+'</select></label>' +
            '<label class="field" for="w-size-'+i+'">Job size<select id="w-size-'+i+'" data-f="size">'+opts(FIB, it.size)+'</select></label>';
        return '<div class="item" data-i="'+i+'"><div class="item-head"><input aria-label="Item name" id="i-name-'+i+'" data-f="name" value="'+esc(it.name)+'" placeholder="Backlog item">' +
          '<span class="score" id="s-'+i+'">'+scoreText(score(it))+'</span>' +
          '<button class="btn icon" type="button" data-del="'+i+'" aria-label="Remove '+esc(it.name || "item")+'">Remove</button></div><div class="grid">'+fields+'</div></div>';
      }).join("") || '<p class="hint">No items yet. Add one to start ranking.</p>';
    }
    $("scale-help").innerHTML = m === "rice"
      ? '<h3>How to score RICE</h3><p class="hint">Reach is how many people or events the item touches in a quarter, from real data where you have it. Impact uses a fixed scale from 3 (massive) to 0.25 (minimal). Confidence discounts guesses: use 50% when evidence is thin. Effort is total team time in person-months, including design and testing.</p>'
      : m === "wsjf" ? '<h3>How to score WSJF</h3><p class="hint">Score one column at a time across all items, never one item at a time. Give the smallest item in each column a 1, then size the others against it on 1, 2, 3, 5, 8, 13, 20. Time criticality asks: does value decay or a deadline bite if we wait? WSJF comes from SAFe and Don Reinertsen\'s cost-of-delay work.</p>'
      : '<h3>Reading the comparison</h3><p class="hint">RICE favours broad reach and cheap effort; WSJF favours urgency and risk reduction. An item that ranks high on both is a safe bet. An item that ranks high on only one needs a conversation about which kind of value matters this quarter.</p>';
    computeRank();
  }
  function computeRank(){
    var m = method(), flags = [];
    if(m === "compare"){
      var rr = ranksBy(rice), wr = ranksBy(wsjf);
      var list = S.pri.items.map(function(it, i){ return {i:i, name: it.name || "Untitled item", r: rr[i], w: wr[i]}; }).sort(function(a,b){ return (a.r + a.w) - (b.r + b.w); });
      $("ranking").innerHTML = '<div class="tbl-wrap"><table><thead><tr><th>Item</th><th class="n">RICE</th><th class="n">WSJF</th><th class="n">Δ</th></tr></thead><tbody>' +
        list.map(function(x){ var dlt = x.w - x.r; return '<tr><td>' + esc(x.name) + '</td><td class="n">#' + x.r + '</td><td class="n">#' + x.w + '</td><td class="n">' + (dlt > 0 ? "+" : "") + dlt + (Math.abs(dlt) >= 3 ? " ⚑" : "") + '</td></tr>'; }).join("") + '</tbody></table></div>';
      list.filter(function(x){ return Math.abs(x.w - x.r) >= 3; }).forEach(function(x){ flags.push('<span class="chip warn">' + esc(x.name) + ': methods disagree by ' + Math.abs(x.w - x.r) + ' places. Discuss what kind of value it brings.</span>'); });
      $("pri-flags").innerHTML = flags.join("");
      draw("pri", priChart, ["compare", list.map(function(x){ return {name:x.name, r:x.r, w:x.w}; })]);
      return;
    }
    var l = S.pri.items.map(function(it, i){ return {i:i, it:it, name: it.name || "Untitled item", s: score(it)}; });
    l.forEach(function(r){ var b = $("s-" + r.i); if(b) b.textContent = scoreText(r.s); });
    l.sort(function(a,b){ return b.s - a.s; });
    var max = Math.max.apply(null, l.map(function(r){ return r.s; }).concat([0.0001]));
    $("ranking").innerHTML = l.map(function(r, k){
      return '<div class="rank"><span class="pos">'+(k+1)+'</span><span class="name">'+esc(r.name)+'</span><span class="track"><span class="fill" style="width:'+(r.s/max*100).toFixed(1)+'%"></span></span><span class="num">'+scoreText(r.s)+'</span></div>';
    }).join("") || '<p class="hint">Add items to see a ranking.</p>';
    if(m === "rice"){
      l.slice(0, 3).forEach(function(r){ if(num(r.it.conf) <= 50) flags.push('<span class="chip warn">' + esc(r.name) + ' ranks in the top three on low confidence. Validate it before committing.</span>'); });
      if(l.length > 1 && l[0].s > 0 && l[1].s / l[0].s > 0.9) flags.push('<span class="chip">The top two are within 10% of each other: treat them as a tie and decide on strategy, not the score.</span>');
    } else if(S.pri.items.length > 1){
      [["bv","Business value"],["tc","Time criticality"],["rr","Risk reduction"],["size","Job size"]].forEach(function(col){
        var mn = Math.min.apply(null, S.pri.items.map(function(it){ return num(it[col[0]]); }));
        if(mn > 1) flags.push('<span class="chip">No item has a 1 in ' + col[1] + '. Rescale that column so the smallest item is 1.</span>');
      });
    }
    $("pri-flags").innerHTML = flags.join("");
    draw("pri", priChart, [m, l.map(function(r, k){
      var it = r.it;
      return m === "rice"
        ? {name:r.name, rank:k + 1, x:num(it.effort), y:num(it.reach) * num(it.impact) * num(it.conf) / 100, detail:"Effort " + fmt(num(it.effort), 1) + " pm · value " + fmt(num(it.reach) * num(it.impact) * num(it.conf) / 100) + " · RICE " + fmt(r.s)}
        : {name:r.name, rank:k + 1, x:num(it.size), y:num(it.bv) + num(it.tc) + num(it.rr), detail:"Job size " + num(it.size) + " · cost of delay " + (num(it.bv) + num(it.tc) + num(it.rr)) + " · WSJF " + fmt(r.s, 1)};
    })]);
    return l;
  }
  document.querySelectorAll("#prioritise [data-m]").forEach(function(b){ b.addEventListener("click", function(){ S.pri.method = b.dataset.m; save(); renderItems(); }); });
  function onItemEdit(e){
    var it = e.target.closest(".item"); if(!it || !e.target.dataset.f) return;
    var f = e.target.dataset.f; S.pri.items[+it.dataset.i][f] = f === "name" ? e.target.value : num(e.target.value); save(); computeRank();
  }
  $("items").addEventListener("input", onItemEdit);
  $("items").addEventListener("change", onItemEdit);
  $("items").addEventListener("click", function(e){ var d = e.target.closest("[data-del]"); if(!d) return; S.pri.items.splice(+d.dataset.del, 1); save(); renderItems(); });
  $("add-item").addEventListener("click", function(){
    if(method() === "compare") S.pri.method = "rice";
    S.pri.items.push({name:"", reach:100, impact:1, conf:80, effort:1, bv:1, tc:1, rr:1, size:1}); save(); renderItems();
    var n = $("items").querySelectorAll('[data-f="name"]'); if(n.length) n[n.length-1].focus();
  });
  $("reset-pri").addEventListener("click", function(){ var m = S.pri.method; S.pri = example().pri; S.pri.method = m; save(); renderItems(); flash("pri-status", "Example restored"); });
  $("copy-pri").addEventListener("click", function(){
    var rr = ranksBy(rice), wr = ranksBy(wsjf);
    var head = ["Item","Reach","Impact","Confidence %","Effort","RICE","RICE rank","Business value","Time criticality","Risk/opportunity","Job size","WSJF","WSJF rank"];
    var rows = S.pri.items.map(function(it, i){ return [csvCell(it.name), it.reach, it.impact, it.conf, it.effort, Math.round(rice(it)), rr[i], it.bv, it.tc, it.rr, it.size, wsjf(it).toFixed(1), wr[i]].join(","); });
    copyText([head.join(",")].concat(rows).join("\n"), "pri-status", "pri-fallback");
  });

  /* =====================================================
     5. PLANNING POKER (facilitator mode, one screen)
     ===================================================== */
  var DECKS = { cohn:["0","½","1","2","3","5","8","13","20","40","100","?","☕"], fib:["0","1","2","3","5","8","13","21","34","55","89","?","☕"], tshirt:["XS","S","M","L","XL","XXL","?","☕"] };
  var picking = null;
  function deck(){ return DECKS[S.poker.deck] || DECKS.cohn; }
  function numericDeck(){ return deck().filter(function(c){ return c !== "?" && c !== "☕"; }); }
  function cardVal(c){ return c === "½" ? 0.5 : parseFloat(c); }
  function isNumericDeck(){ return S.poker.deck !== "tshirt"; }
  function people(){ return String(S.poker.people).split(",").map(function(s){ return s.trim(); }).filter(Boolean).filter(function(v, i, a){ return a.indexOf(v) === i; }); }
  function story(){ return S.poker.stories[S.poker.cur]; }
  function analyse(){
    var nd = numericDeck(), pp = people(), votes = S.poker.votes;
    var cast = pp.filter(function(p){ return votes[p] != null; });
    var nums = cast.filter(function(p){ return nd.indexOf(votes[p]) >= 0; });
    var q = cast.filter(function(p){ return votes[p] === "?"; }), cof = cast.filter(function(p){ return votes[p] === "☕"; });
    if(!nums.length) return {cast:cast, nums:nums, q:q, cof:cof};
    var idx = nums.map(function(p){ return nd.indexOf(votes[p]); });
    var mn = Math.min.apply(null, idx), mx = Math.max.apply(null, idx);
    var sorted = idx.slice().sort(function(a,b){ return a - b; });
    var med = sorted[Math.floor((sorted.length - 1) / 2) + (sorted.length % 2 === 0 ? 1 : 0)];
    var freq = {}; idx.forEach(function(x){ freq[x] = (freq[x] || 0) + 1; });
    return {cast:cast, nums:nums, q:q, cof:cof, spread: mx - mn, low: nums.filter(function(p){ return nd.indexOf(votes[p]) === mn; }), high: nums.filter(function(p){ return nd.indexOf(votes[p]) === mx; }), suggest: nd[med], consensus: (mx - mn) <= 1 && !q.length, mn: nd[mn], mx: nd[mx]};
  }
  function renderPoker(){
    var st = story(), pp = people(), K = S.poker, el = $("k-table");
    if(!st){ el.innerHTML = '<h2>All items estimated</h2><p class="hint">Add more items below, or copy the results.</p>'; renderStories(); return; }
    var head = '<div class="actions spread"><h2>Round ' + K.round + '</h2><span class="hint">Item ' + (K.cur + 1) + ' of ' + K.stories.length + '</span></div><p class="story-now">' + esc(st.title) + '</p>';
    if(picking){
      el.innerHTML = head + '<p><b>Pass the screen to ' + esc(picking) + '.</b> Everyone else looks away.</p><div class="deck">' +
        deck().map(function(c){ return '<button class="cardbtn" type="button" data-card="' + esc(c) + '" aria-label="Vote ' + esc(c) + '">' + esc(c) + '</button>'; }).join("") +
        '</div><div class="actions"><button class="btn link" type="button" id="k-cancel">Cancel</button></div>';
      return;
    }
    var a = K.revealed ? analyse() : null;
    var cards = pp.map(function(p){
      var v = K.votes[p], cls = "person" + (v != null ? " voted" : "");
      if(a && a.spread > 1){ if(a.low.indexOf(p) >= 0) cls += " low"; if(a.high.indexOf(p) >= 0) cls += " high"; }
      var stTxt = K.revealed ? '<span class="val">' + esc(v == null ? "–" : v) + '</span>' : '<span class="st">' + (v != null ? "Voted ✓" : "Tap to vote") + '</span>';
      return '<button type="button" class="' + cls + '" data-pick="' + esc(p) + '"' + (K.revealed ? " disabled" : "") + '>' + esc(p) + stTxt + '</button>';
    }).join("") || '<p class="hint">Add the Developers who are voting above.</p>';
    var votedN = pp.filter(function(p){ return K.votes[p] != null; }).length;
    var body = '<div class="people">' + cards + '</div>';
    if(!K.revealed){
      body += '<div class="actions"><button class="btn primary" type="button" id="k-reveal"' + (votedN < 2 ? " disabled" : "") + '>Reveal ' + votedN + ' of ' + pp.length + ' votes</button><button class="btn link" type="button" id="k-skip">Skip item</button></div>';
    } else {
      var msg = "";
      if(a.cof.length) msg += '<span class="chip">' + a.cof.map(esc).join(", ") + ' asked for a break</span>';
      if(a.q.length) msg += '<span class="chip warn">' + a.q.map(esc).join(", ") + ' voted "?": clarify or split the item before estimating</span>';
      if(a.nums.length){
        if(a.consensus) msg += '<span class="chip good">Consensus: votes are within one card of each other</span>';
        else if(a.spread > 1) msg += '<span class="chip bad">Votes span ' + esc(a.mn) + ' to ' + esc(a.mx) + '. ' + a.low.map(esc).join(", ") + ' (lowest) and ' + a.high.map(esc).join(", ") + ' (highest) explain first, then re-vote.</span>';
        if(isNumericDeck() && cardVal(a.mx) >= 20) msg += '<span class="chip warn">Someone sees this as 20 or more. Consider splitting it.</span>';
      }
      var sel = '<label class="sr" for="k-accept-val">Estimate to record</label><select id="k-accept-val" style="width:auto">' + numericDeck().map(function(c){ return '<option' + (a.suggest === c ? " selected" : "") + '>' + esc(c) + '</option>'; }).join("") + '</select>';
      var cnt = {}; a.nums.forEach(function(p){ cnt[K.votes[p]] = (cnt[K.votes[p]] || 0) + 1; });
      if(a.nums.length) body += pokerChart(numericDeck(), cnt, a.suggest);
      body += '<div class="flags">' + msg + '</div><div class="actions"><button class="btn" type="button" id="k-revote">Re-vote</button>' + sel + '<button class="btn primary" type="button" id="k-accept">Record estimate</button></div>' +
        (a.nums.length ? '<p class="hint">Suggested: ' + esc(a.suggest) + ' (the median vote, rounded up to a card). The team can record any value it agrees on.</p>' : "");
    }
    el.innerHTML = head + body;
    renderStories();
  }
  function renderStories(){
    var K = S.poker;
    $("k-stories").innerHTML = K.stories.map(function(s, i){
      return '<li><span class="' + (i === K.cur ? "cur" : "hint") + '">' + (i + 1) + '</span><span class="' + (i === K.cur ? "cur" : "") + '">' + esc(s.title) + (s.rounds ? ' <span class="hint">· ' + s.rounds + (s.rounds === 1 ? " round" : " rounds") + '</span>' : "") + '</span><span class="est">' + esc(s.est == null ? "–" : s.est) + '</span><button class="btn icon" type="button" data-sdel="' + i + '" aria-label="Remove item ' + (i+1) + '">✕</button></li>';
    }).join("") || '<li><span></span><span class="hint">No items yet.</span><span></span><span></span></li>';
    var done = K.stories.filter(function(s){ return s.est != null; });
    if(isNumericDeck()){
      var tot = done.reduce(function(sum, s){ return sum + (cardVal(s.est) || 0); }, 0);
      $("k-total").textContent = done.length + " of " + K.stories.length + " estimated · " + fmt(tot, tot % 1 ? 1 : 0) + " points";
    } else { $("k-total").textContent = done.length + " of " + K.stories.length + " estimated"; }
    var flags = [];
    var big = done.filter(function(s){ return isNumericDeck() ? cardVal(s.est) > 13 : (s.est === "XL" || s.est === "XXL"); });
    if(big.length) flags.push('<span class="chip warn">' + big.length + (big.length === 1 ? " item is" : " items are") + ' above 13: split before Sprint Planning</span>');
    var long = done.filter(function(s){ return s.rounds >= 3; });
    if(long.length) flags.push('<span class="chip">' + long.length + ' took three or more rounds: the shared understanding may still be thin</span>');
    $("k-flags").innerHTML = flags.join("");
  }
  function advance(){
    var K = S.poker; K.votes = {}; K.revealed = false; K.round = 1;
    var next = -1; for(var i = 1; i <= K.stories.length; i++){ var j = (K.cur + i) % K.stories.length; if(K.stories[j].est == null){ next = j; break; } }
    K.cur = next < 0 ? K.stories.length : next;
  }
  $("k-table").addEventListener("click", function(e){
    var K = S.poker, t = e.target;
    var p = t.closest("[data-pick]"); if(p && !K.revealed){ picking = p.dataset.pick; renderPoker(); return; }
    var c = t.closest("[data-card]"); if(c && picking){ K.votes[picking] = c.dataset.card; picking = null; save(); renderPoker(); flash("k-status", "Vote saved and hidden"); return; }
    if(t.id === "k-cancel"){ picking = null; renderPoker(); return; }
    if(t.id === "k-reveal"){ K.revealed = true; save(); renderPoker(); return; }
    if(t.id === "k-revote"){ K.votes = {}; K.revealed = false; K.round++; save(); renderPoker(); return; }
    if(t.id === "k-skip"){ var cur = K.cur; K.votes = {}; K.round = 1; K.cur = (cur + 1) % K.stories.length; save(); renderPoker(); return; }
    if(t.id === "k-accept"){ var st = story(); st.est = $("k-accept-val").value; st.rounds = K.round; advance(); save(); renderPoker(); return; }
  });
  $("k-stories").addEventListener("click", function(e){
    var d = e.target.closest("[data-sdel]"); if(!d) return;
    var i = +d.dataset.sdel, K = S.poker; K.stories.splice(i, 1);
    if(i === K.cur){ K.votes = {}; K.revealed = false; K.round = 1; }
    if(i < K.cur) K.cur--;
    if(!K.stories[K.cur] || K.stories[K.cur].est != null){
      var open = -1; K.stories.forEach(function(s, j){ if(open < 0 && s.est == null) open = j; });
      K.cur = open < 0 ? K.stories.length : open;
    }
    picking = null; save(); renderPoker();
  });
  function addStory(){ var v = $("k-new").value.trim(); if(!v) return; var K = S.poker; K.stories.push({title:v, est:null, rounds:0}); if(K.cur >= K.stories.length - 1 && (!K.stories[K.cur] || K.stories[K.cur].est != null)) K.cur = K.stories.length - 1; $("k-new").value = ""; save(); renderPoker(); $("k-new").focus(); }
  $("k-add").addEventListener("click", addStory);
  $("k-new").addEventListener("keydown", function(e){ if(e.key === "Enter"){ e.preventDefault(); addStory(); } });
  $("k-deck").value = S.poker.deck;
  $("k-deck").addEventListener("change", function(){
    S.poker.deck = $("k-deck").value; S.poker.votes = {}; S.poker.revealed = false;
    S.poker.stories.forEach(function(s){ s.est = null; s.rounds = 0; }); S.poker.cur = 0; S.poker.round = 1;
    save(); renderPoker(); flash("k-status", "Deck changed; estimates cleared");
  });
  $("k-people").value = S.poker.people;
  $("k-people").addEventListener("input", function(){ S.poker.people = $("k-people").value; save(); if(!picking) renderPoker(); });
  $("reset-k").addEventListener("click", function(){ S.poker = example().poker; picking = null; save(); $("k-deck").value = S.poker.deck; $("k-people").value = S.poker.people; renderPoker(); flash("k-status", "Example restored"); });
  $("copy-k").addEventListener("click", function(){
    var lines = ["Item,Estimate,Rounds"];
    S.poker.stories.forEach(function(s){ lines.push([csvCell(s.title), s.est == null ? "" : s.est, s.rounds || ""].join(",")); });
    copyText(lines.join("\n"), "k-status", "k-fallback");
  });

  /* =====================================================
     6. DELIVERY RISK CHECK
     ===================================================== */
  var QS = [
    {id:"scope", area:"Scope", crit:true, text:"Are acceptance criteria for this delivery written down and agreed by the person who will accept it?", fix:"Write the acceptance criteria as testable statements and get the accepting stakeholder to confirm them by name this week."},
    {id:"change", area:"Scope", crit:false, text:"Does every scope change go through an agreed step that assesses its impact on date and cost before anyone says yes?", fix:"Agree a one-page change process: request, impact on date and cost, decision owner. Log every change since kick-off against it."},
    {id:"deps", area:"Dependencies", crit:true, text:"Does every external dependency (vendor, partner, client, another team) have a named owner and a committed date?", fix:"List every external dependency with an owner and a date confirmed in writing. Escalate any without one in your next status update."},
    {id:"cpath", area:"Schedule", crit:false, text:"Do you know the critical path, and has it been re-checked in the last two weeks?", fix:"Re-run the critical path with current dates (the PERT tab will do it) and share which tasks now drive the finish date."},
    {id:"contingency", area:"Schedule", crit:false, text:"Is schedule contingency held visibly at project level, rather than hidden inside individual task estimates?", fix:"Pull padding out of task estimates into one visible project buffer, and report how much of it has been used."},
    {id:"access", area:"Environments", crit:false, text:"Are environments, access, credentials and any restricted windows (change freezes, maintenance windows) booked for the dates you need?", fix:"Book environments, access and change windows for every remaining milestone now; restricted windows are the long-lead item."},
    {id:"people", area:"Team", crit:false, text:"Is every critical skill covered by at least two people?", fix:"Name the single points of failure and pair a second person on each for the rest of the delivery."},
    {id:"testing", area:"Quality", crit:false, text:"Is testing (integration and user acceptance) planned with entry and exit criteria and dates for test environments?", fix:"Agree entry and exit criteria for integration and user acceptance testing, and lock the test environment dates."},
    {id:"rollback", area:"Release", crit:true, text:"Is there a rollback or back-out plan, and has it been rehearsed?", fix:"Write the rollback steps with a decision point and an owner, then rehearse them in a non-production environment before go-live."},
    {id:"gonogo", area:"Release", crit:false, text:"Is there a go/no-go meeting with named decision makers and criteria agreed in advance?", fix:"Schedule the go/no-go meeting now, and circulate the criteria and decision makers at least a week before it."},
    {id:"status", area:"Governance", crit:false, text:"Do stakeholders get status updates at an agreed cadence that report risks honestly, not only green?", fix:"Move status reporting to a fixed cadence with a short, honest risk section: what could slip, why, and what you need."},
    {id:"raid", area:"Governance", crit:false, text:"Is there a live risk log with owners and actions, reviewed in the last two weeks?", fix:"Refresh the risk log: one owner and one next action per risk, reviewed weekly until go-live."}
  ];
  var ANS = [[2,"Yes"],[1,"Partly"],[0,"No"],[-1,"Not sure"]];
  function renderQs(){
    $("r-qs").innerHTML = QS.map(function(q, i){
      var a = S.risk.answers[q.id];
      return '<div class="q"><div class="qtop"><span class="chip">' + q.area + '</span>' + (q.crit ? '<span class="chip bad">Gate</span>' : '') + '</div>' +
        '<p class="qtext" id="q-' + q.id + '">' + (i + 1) + '. ' + q.text + '</p>' +
        '<div class="seg" role="group" aria-labelledby="q-' + q.id + '">' + ANS.map(function(o){ return '<button type="button" data-q="' + q.id + '" data-a="' + o[0] + '" aria-pressed="' + (a === o[0]) + '">' + o[1] + '</button>'; }).join("") + '</div></div>';
    }).join("");
  }
  function riskResult(){
    var weeks = num(S.risk.weeks), tot = 0, got = 0, area = {}, gaps = [], critNo = [], critPartly = [], answered = 0;
    QS.forEach(function(q){
      var a = S.risk.answers[q.id], w = q.crit ? 3 : 2, sc = a == null ? 0 : Math.max(0, a);
      if(a != null) answered++;
      tot += w * 2; got += w * sc;
      area[q.area] = area[q.area] || {t:0, g:0}; area[q.area].t += w * 2; area[q.area].g += w * sc;
      if(sc < 2) gaps.push({q:q, weight: w * (2 - sc) + (q.crit ? 2 : 0), a:a});
      if(q.crit && sc === 0) critNo.push(q); else if(q.crit && sc === 1) critPartly.push(q);
    });
    var score = tot ? got / tot : 0, rag;
    if(score < 0.55 || critNo.length) rag = "Red"; else if(score < 0.8 || critPartly.length) rag = "Amber"; else rag = "Green";
    if(rag === "Amber" && weeks <= 2 && critPartly.length) rag = "Red";
    gaps.sort(function(a, b){ return b.weight - a.weight; });
    return {score:score, rag:rag, area:area, gaps:gaps, critNo:critNo, critPartly:critPartly, weeks:weeks, answered:answered};
  }
  function computeRisk(){
    var r = riskResult();
    var why = r.critNo.length ? "A gate is failing: " + r.critNo.map(function(q){ return q.area.toLowerCase(); }).join(", ") + "."
      : r.rag === "Red" ? "Too many gaps for the time left." : r.rag === "Amber" ? "Deliverable, with gaps that need owners this week." : "In good shape. Keep checking weekly.";
    var urgency = r.weeks <= 4 && r.rag !== "Green" ? '<span class="chip bad">' + r.weeks + ' weeks to go: fix the top item before anything else</span>' : "";
    var areas = Object.keys(r.area).map(function(k){ var x = r.area[k], v = x.t ? x.g / x.t : 0; return '<div class="bar"><span class="name">' + k + '</span><span class="track"><span class="fill" style="width:' + (v * 100).toFixed(0) + '%;background:' + (v < 0.5 ? "var(--bad)" : v < 0.8 ? "var(--warn)" : "var(--good)") + '"></span></span><span class="num">' + pct(v) + '</span></div>'; }).join("");
    var mapCells = QS.map(function(q, i){
      var a = S.risk.answers[q.id], cls = a === 2 ? "y" : a === 1 ? "p" : a === 0 ? "n" : a === -1 ? "n" : "u", ic = a === 2 ? "✓" : a === 1 ? "~" : a === 0 ? "✕" : a === -1 ? "?" : "–";
      var lab = a === 2 ? "Yes" : a === 1 ? "Partly" : a === 0 ? "No" : a === -1 ? "Not sure" : "Not answered";
      return '<button type="button" class="' + cls + '" data-goto="q-' + q.id + '" aria-label="Question ' + (i + 1) + ', ' + q.area + ': ' + lab + '" title="' + esc(q.area + ": " + lab) + '">' + ic + ' ' + (i + 1) + '<small>' + ({Scope:"Scope", Dependencies:"Deps", Schedule:"Sched", Environments:"Env", Team:"Team", Quality:"QA", Release:"Release", Governance:"Gov"}[q.area] || q.area) + (q.crit ? " ★" : "") + '</small></button>';
    }).join("");
    var fixes = r.gaps.slice(0, 3).map(function(g){ return '<li><b>' + g.q.area + (g.q.crit ? " (gate)" : "") + (g.a === -1 ? " · not sure" : "") + '</b>' + g.q.fix + '</li>'; }).join("");
    $("r-summary").innerHTML = '<div class="rag"><span class="ragpill ' + r.rag + '">' + r.rag + '</span><span class="tile" style="border:0;padding:0"><span class="value">' + pct(r.score) + '</span></span><span class="hint" style="flex:1;min-width:180px">' + why + ' ' + r.answered + ' of ' + QS.length + ' answered.</span></div>' +
      (urgency ? '<div class="flags">' + urgency + '</div>' : '') +
      '<h3>Readiness map</h3><div class="rmap">' + mapCells + '</div><div class="legend"><span>✓ Yes</span><span>~ Partly</span><span>✕ No</span><span>? Not sure</span><span>★ Gate</span></div>' +
      '<h3>By area</h3><div class="bars risk-bars">' + areas + '</div>' +
      (fixes ? '<h3>Fix these first</h3><ol class="fixes">' + fixes + '</ol>' : '<p class="hint">No gaps found.</p>');
    return r;
  }
  $("r-summary").addEventListener("click", function(e){
    var b = e.target.closest("[data-goto]"); if(!b) return;
    var t = $(b.dataset.goto); if(t){ t.scrollIntoView({behavior:"smooth", block:"center"}); }
  });
  $("r-qs").addEventListener("click", function(e){
    var b = e.target.closest("[data-q]"); if(!b) return;
    S.risk.answers[b.dataset.q] = +b.dataset.a; save();
    b.parentNode.querySelectorAll("button").forEach(function(x){ x.setAttribute("aria-pressed", x === b); });
    computeRisk();
  });
  $("r-weeks").value = S.risk.weeks;
  $("r-weeks").addEventListener("input", function(){ S.risk.weeks = $("r-weeks").value; save(); computeRisk(); });
  $("reset-r").addEventListener("click", function(){ S.risk = example().risk; save(); $("r-weeks").value = S.risk.weeks; renderQs(); computeRisk(); flash("r-status", "Example restored"); });
  $("copy-r").addEventListener("click", function(){
    var r = riskResult();
    var lines = ["Delivery risk check: " + r.rag + " (" + pct(r.score) + "), " + r.weeks + " weeks to go-live", ""];
    Object.keys(r.area).forEach(function(k){ var x = r.area[k]; lines.push(k + ": " + pct(x.t ? x.g / x.t : 0)); });
    lines.push("", "Fix first:");
    r.gaps.slice(0, 3).forEach(function(g, i){ lines.push((i + 1) + ". " + g.q.area + ": " + g.q.fix); });
    copyText(lines.join("\n"), "r-status", "r-fallback");
  });

  /* ---------- init ---------- */
  renderTeam(); computeCap();
  renderTasks();
  renderItems();
  renderPoker();
  renderQs(); computeRisk();
  showTab(location.hash ? location.hash.slice(1) : S.tab);
  if(S.tab !== "forecast") runForecast();
  if(S.tab !== "pert") runPert();

  return function cleanup(){
    window.removeEventListener("hashchange", onHash);
    window.removeEventListener("resize", onResize);
    clearTimeout(fTimer); clearTimeout(pTimer); clearTimeout(rzT);
  };
}
