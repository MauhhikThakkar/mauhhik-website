import Link from 'next/link'
import { LOCAL_POSTS } from '@/content/posts'

/** Three most recent articles written in code */
export default function LatestWriting() {
  const posts = LOCAL_POSTS.slice(0, 3)
  if (posts.length === 0) return null

  return (
    <section id="writing" className="border-t border-line bg-paper" aria-labelledby="writing-heading">
      <div className="site-container py-16 md:py-20">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-3">Writing</p>
            <h2 id="writing-heading" className="section-title">
              Notes from delivery and the move to product.
            </h2>
          </div>
          <Link href="/blog" className="text-link text-[15px]">
            All writing
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex min-h-[180px] flex-col justify-between gap-5 rounded-lg border border-line bg-charcoal p-6 transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="text-[19px] font-semibold leading-snug text-white">{post.title}</span>
              <span className="font-mono text-[13px] text-accent">{post.readingTime} min read →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
