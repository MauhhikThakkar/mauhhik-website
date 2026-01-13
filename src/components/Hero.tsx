import Link from "next/link"

export default function Hero() {
    return (
      <section className="min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-block mb-6 px-4 py-1 rounded-full bg-white/10 text-sm text-gray-300">
            Product Manager • AI & SaaS • India → UAE / Global
          </div>
  
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto">
            I build <span className="text-gray-400">AI-first products</span><br />
            and ship them to production
          </h1>
  
          {/* Subtext */}
          <p className="text-gray-400 text-lg mb-10">
            Product Manager with hands-on experience in AI tools, Excel automation,
            SaaS MVPs, and real-world delivery.  
            Actively targeting PM roles and consulting opportunities.
          </p>
  
          {/* CTAs */}
          {/* Portfolio uses hash link (section on this page) */}
          {/* CRITICAL: Blog changed from hash (#blog) to route (/blog) */}
          {/* Hash links prevent Next.js data fetching, causing stale blog content in Chrome */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#portfolio"
              className="px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition"
            >
              View Portfolio
            </Link>
            <Link
              href="/blog"
              className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition"
            >
              Read Blog
            </Link>
          </div>
        </div>
      </section>
    );
  }
  