import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import JsonLd, { breadcrumbSchema } from '@/components/site/JsonLd'
import { PERSON_ID } from '@/components/PersonSchema'
import { SITE_URL } from '@/lib/constants'
import type { LocalPost, PostBlock } from '@/content/posts'

/** Turns **bold** and [label](url) inside a string into elements */
function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, index) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/)
    if (bold) {
      return (
        <strong key={index} className="font-semibold text-white">
          {bold[1]}
        </strong>
      )
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      const [, label, href] = link
      return href.startsWith('/') ? (
        <Link key={index} href={href} className="text-link">
          {label}
        </Link>
      ) : (
        <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="text-link">
          {label}
        </a>
      )
    }
    return part
  })
}

function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="mt-14 mb-5 text-2xl font-semibold leading-snug tracking-tight text-white first:mt-0 sm:text-[28px]">
          {block.text}
        </h2>
      )
    case 'p':
      return <p className="mb-6 text-[18px] leading-[1.75] text-zinc-300">{renderInline(block.text)}</p>
    case 'ul':
      return (
        <ul className="mb-8 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[18px] leading-[1.7] text-zinc-300">
              <span className="mt-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol className="mb-8 space-y-3">
          {block.items.map((item, index) => (
            <li key={item} className="grid grid-cols-[2rem_1fr] gap-2 text-[18px] leading-[1.7] text-zinc-300">
              <span className="pt-1 font-mono text-sm text-accent" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      )
    case 'note':
      return (
        <p className="mb-8 rounded-xl border border-line bg-charcoal-light/60 p-5 text-[15px] leading-relaxed text-zinc-400">
          {renderInline(block.text)}
        </p>
      )
    case 'table':
      return (
        <figure className="mb-8">
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-max border-collapse text-left text-sm">
              <thead>
                <tr className="bg-charcoal-light">
                  {block.head.map((cell) => (
                    <th key={cell} scope="col" className="px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-400">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t border-line">
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`px-4 py-3 align-top ${cellIndex === 0 ? 'max-w-[22rem] whitespace-normal text-zinc-200' : 'text-zinc-400'}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && <figcaption className="mt-3 text-sm text-zinc-500">{block.caption}</figcaption>}
        </figure>
      )
  }
}

/**
 * LocalArticle
 *
 * Renders a blog post written in code (src/content/posts). The layout matches
 * posts that come from Sanity.
 */
export default function LocalArticle({ post }: { post: LocalPost }) {
  const url = `${SITE_URL}/blog/${post.slug}`

  return (
    <main className="bg-charcoal text-white min-h-screen">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          datePublished: post.publishedAt,
          dateModified: post.publishedAt,
          mainEntityOfPage: url,
          url,
          keywords: post.tags.join(', '),
          author: { '@type': 'Person', '@id': PERSON_ID, name: 'Mauhhik Thakkar', url: `${SITE_URL}/about` },
          publisher: { '@id': PERSON_ID },
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE_URL },
          { name: 'Writing', url: `${SITE_URL}/blog` },
          { name: post.title, url },
        ])}
      />

      <article>
        <header className="relative overflow-hidden border-b border-line">
          <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-3xl px-5 pb-12 pt-32 sm:px-8 sm:pt-40 md:pb-16">
            <Link href="/blog" className="text-link text-sm">
              All writing
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
              <span className="text-accent">{post.category}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime} min read</span>
            </div>

            <h1 className="mt-5 text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
              {post.title}
            </h1>

            <div className="mt-8 flex items-center gap-3">
              <Image
                src="/images/mauhhik-thakkar.jpg"
                alt="Mauhhik Thakkar"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border border-line-strong object-cover"
              />
              <div className="text-sm">
                <Link href="/about" className="font-medium text-white hover:underline">
                  Mauhhik Thakkar
                </Link>
                <p className="text-zinc-500">Project manager, moving into product</p>
              </div>
            </div>
          </div>
        </header>

        <div className="border-b border-line bg-charcoal-dark/60">
          <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
            <p className="eyebrow mb-3 text-accent">Short answer</p>
            <p className="text-lg leading-relaxed text-zinc-100">{post.shortAnswer}</p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 md:py-20">
          {post.body.map((block, index) => (
            <Block key={index} block={block} />
          ))}

          <div className="mt-14 rounded-2xl border border-accent/25 bg-accent-muted p-6 sm:p-8">
            <p className="eyebrow mb-3 text-accent">Key takeaway</p>
            <p className="text-lg leading-relaxed text-zinc-100">{post.takeaway}</p>
          </div>

          {post.related && (
            <p className="mt-8 text-base text-zinc-400">
              Related:{' '}
              <Link href={post.related.href} className="text-link">
                {post.related.label}
              </Link>
            </p>
          )}

          <div className="card mt-14 p-6 sm:p-8">
            <p className="eyebrow mb-3">Keep reading</p>
            <p className="text-base leading-relaxed text-zinc-300">
              I send new posts through my newsletter, The PM Transition. If you are hiring for a
              product role in the UAE or Singapore, I would like to hear from you.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://thepmtransition.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Subscribe on Substack
              </a>
              <a href="mailto:hello@mauhhik.com" className="btn-secondary">
                Email me
              </a>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
