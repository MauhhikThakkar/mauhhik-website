import { PortableText as PortableTextReact, PortableTextComponents } from "@portabletext/react"
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"

/**
 * Reusable PortableText renderer for blog posts and portfolio case studies
 * Premium design with excellent readability
 */

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-[18px] leading-[1.75] text-zinc-300 mb-7 max-w-2xl">
        {children}
      </p>
    ),
    // h2 and h3 are rendered as strong paragraphs to avoid duplicate headings
    // Section titles are controlled by page.tsx layout
    h2: ({ children }) => (
      <p className="text-[17px] leading-[1.8] text-zinc-300 font-semibold mb-8 max-w-2xl mt-12 first:mt-0">
        {children}
      </p>
    ),
    h3: ({ children }) => (
      <p className="text-[17px] leading-[1.8] text-zinc-300 font-semibold mb-8 max-w-2xl mt-10">
        {children}
      </p>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold text-zinc-200 mt-10 mb-4">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="relative border-l-4 border-zinc-700 pl-8 pr-6 py-6 my-12 bg-charcoal-light/30 rounded-r-xl">
        <div className="absolute top-4 left-4 text-6xl text-zinc-800 leading-none">&quot;</div>
        <div className="relative text-xl leading-relaxed text-zinc-200 font-normal italic">
          {children}
        </div>
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="space-y-3 mb-9 text-zinc-300 max-w-2xl">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="space-y-3 mb-9 text-zinc-300 max-w-2xl">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-3 leading-[1.8] text-[17px]">
        <span className="text-zinc-600 mt-1">•</span>
        <span className="flex-1">{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="flex gap-3 leading-[1.8] text-[17px] ml-6 list-decimal">
        <span className="flex-1">{children}</span>
      </li>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-zinc-200">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-zinc-300">{children}</em>,
    code: ({ children }) => (
      <code className="bg-zinc-900 text-accent px-2 py-1 rounded text-[15px] font-mono border border-zinc-800">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const target = value?.href?.startsWith("http") ? "_blank" : undefined
      const rel = target === "_blank" ? "noopener noreferrer" : undefined
      
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="text-zinc-300 underline decoration-zinc-700 underline-offset-4 hover:text-white hover:decoration-zinc-500 transition-colors"
        >
          {children}
        </a>
      )
    },
  },

  types: {
    image: ({ value }) => {
      // Handle both referenced (_ref) and dereferenced (asset object) formats
      if (!value?.asset) {
        return null
      }

      try {
        const imageUrl = urlFor(value).width(1200).fit('max').url()

        return (
          <figure className="my-16 -mx-0">
            <div className="relative w-full rounded-xl overflow-hidden bg-charcoal-light border border-zinc-900/50">
              <Image
                src={imageUrl}
                alt={value.alt || "Content image"}
                width={1200}
                height={800}
                className="object-contain w-full h-auto"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
            {(value.alt || value.caption) && (
              <figcaption className="text-center text-sm text-zinc-500 mt-4 px-4 leading-relaxed">
                {value.caption || value.alt}
              </figcaption>
            )}
          </figure>
        )
      } catch {
        // Silently fail image rendering - return null to skip broken images
        return null
      }
    },
  },
}

/**
 * Blog posts use real h2 and h3 headings, so readers, search engines and AI
 * assistants can see the structure of the article. Case studies keep the
 * quieter treatment above because their section titles come from the page.
 */
const articleComponents: PortableTextComponents = {
  ...components,
  block: {
    ...(components.block as Record<string, unknown>),
    h2: ({ children }) => (
      <h2 className="mt-14 mb-5 max-w-2xl text-2xl font-semibold leading-snug tracking-tight text-white first:mt-0 sm:text-[28px]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 mb-4 max-w-2xl text-xl font-semibold leading-snug text-white">
        {children}
      </h3>
    ),
  },
}

interface PortableTextProps {
  value: unknown
  className?: string
  /** Set on blog posts to render real section headings */
  article?: boolean
}

export default function PortableText({ value, className = "", article = false }: PortableTextProps) {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return null
  }

  return (
    <div className={`prose-custom ${className}`}>
      <PortableTextReact value={value} components={article ? articleComponents : components} />
    </div>
  )
}
