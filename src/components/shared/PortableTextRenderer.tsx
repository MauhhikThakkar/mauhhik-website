import { PortableText, PortableTextComponents } from "@portabletext/react"
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-gray-300 leading-relaxed mb-4">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold text-white mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold text-white mt-6 mb-3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold text-white mt-4 mb-2">{children}</h4>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside ml-6 space-y-2 mb-4 text-gray-300">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 space-y-2 mb-4 text-gray-300">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
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
          className="text-blue-400 hover:text-blue-300 underline transition"
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

      return (
        <figure className="my-8">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-900">
            <Image
              src={urlFor(value).width(1200).height(675).url()}
              alt={value.alt || "Image"}
              fill
              className="object-contain"
            />
          </div>
          {value.alt && (
            <figcaption className="text-center text-sm text-zinc-500 mt-2">
              {value.alt}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

interface PortableTextRendererProps {
  value: any
}

export default function PortableTextRenderer({ value }: PortableTextRendererProps) {
  if (!value) {
    return null
  }

  return <PortableText value={value} components={components} />
}
