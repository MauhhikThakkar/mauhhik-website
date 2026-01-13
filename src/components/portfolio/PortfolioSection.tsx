import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/client'
import { PROJECTS_QUERY } from '@/sanity/queries'

type Project = {
  _id: string
  title: string
  slug: string
  shortDescription: string
  tags: string[]
  coverImage: any
  liveUrl?: string
  githubUrl?: string
}

async function getProjects(): Promise<Project[]> {
  return await client.fetch(PROJECTS_QUERY)
}

export default async function PortfolioSection() {
  const projects = await getProjects()

  return (
    <section id="portfolio" className="bg-black text-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-4">Portfolio</h2>
        <p className="text-gray-400 mb-12">
          Selected case studies showcasing product thinking, execution,
          and real-world delivery.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Link
              key={project._id}
              href={`/portfolio/${project.slug}`}
              className="border border-gray-800 rounded-xl p-6 hover:border-white transition"
            >
              {project.coverImage && (
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={project.coverImage.asset.url}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <h3 className="text-2xl font-semibold mb-2">
                {project.title}
              </h3>

              <p className="text-gray-400 mb-4">
                {project.shortDescription}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 bg-gray-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
