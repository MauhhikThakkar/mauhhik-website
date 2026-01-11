import { PortableText as PortableTextReact, PortableTextComponents } from "@portabletext/react"
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"

/**
 * Reusable PortableText renderer for blog posts and portfolio case studies
 * Handles rich text content from Sanity with custom styling
 */

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-gray-300 leading-relaxed mb-6">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl md:text-4xl font-bold text-white mt-12 mb-6 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl md:text-3xl font-semibold text-white mt-10 mb-4">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl md:text-2xl font-semibold text-white mt-8 mb-3">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-zinc-700 pl-6 py-2 my-8 italic text-zinc-400">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside ml-6 space-y-3 mb-6 text-gray-300">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 space-y-3 mb-6 text-gray-300">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed pl-2">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed pl-2">{children}</li>,
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-white">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-zinc-800 text-emerald-400 px-2 py-0.5 rounded text-sm font-mono">
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
          className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors"
        >
          {children}
        </a>
      )
    },
  },

  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null
      }

      const imageUrl = urlFor(value).width(1200).height(675).url()

      return (
        <figure className="my-10 -mx-4 sm:mx-0">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
            <Image
              src={imageUrl}
              alt={value.alt || "Content image"}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
          {value.alt && (
            <figcaption className="text-center text-sm text-zinc-500 mt-3 px-4">
              {value.alt}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

interface PortableTextProps {
  value: any
  className?: string
}

export default function PortableText({ value, className = "" }: PortableTextProps) {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return null
  }

  return (
    <div className={`prose-custom ${className}`}>
      <PortableTextReact value={value} components={components} />
    </div>
  )
}
