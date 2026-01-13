import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface AuthorAttributionProps {
  author?: {
    name: string
    bio?: string
    portfolioLink?: string
    picture?: {
      alt?: string
      asset: {
        _id: string
        url: string
        metadata?: {
          dimensions?: {
            width: number
            height: number
            aspectRatio: number
          }
        }
      }
    }
  }
}

export default function AuthorAttribution({ author }: AuthorAttributionProps) {
  // Don't render if no author
  if (!author || !author.name) {
    return null
  }

  const imageUrl = author.picture?.asset
    ? urlFor(author.picture).width(80).height(80).fit('crop').url()
    : null

  return (
    <div className="not-prose mt-20 pt-12 border-t border-zinc-900 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Author Picture */}
        {imageUrl && (
          <div className="flex-shrink-0">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-zinc-900 border border-zinc-800">
              <Image
                src={imageUrl}
                alt={author.picture?.alt || author.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          </div>
        )}

        {/* Author Info */}
        <div className="flex-1">
          <div className="mb-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              About the author
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-2">
            {author.name}
          </h3>

          {author.bio && (
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              {author.bio}
            </p>
          )}

          {author.portfolioLink && (
            <Link
              href={author.portfolioLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              <span>View portfolio</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
