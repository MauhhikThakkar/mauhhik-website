import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata = generateSEOMetadata({
  title: 'Resume | Mauhhik',
  description: 'Product Manager with hands-on experience in AI tools, Excel automation, SaaS MVPs, and real-world delivery.',
  url: '/resume',
  imageAlt: 'Mauhhik — Resume',
})

export default function ResumePage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20">
        <h1 className="text-4xl font-bold mb-8">Resume</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-400 text-lg mb-8">
            Resume content coming soon. For inquiries, please reach out via the contact information on the homepage.
          </p>
        </div>
      </div>
    </main>
  )
}
