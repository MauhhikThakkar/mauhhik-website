import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import ResumeRequestForm from '@/components/ResumeRequestForm'
import { Suspense } from 'react'

export const metadata = generateSEOMetadata({
  title: 'Resume | Mauhhik',
  description: 'Product Manager with hands-on experience in AI tools, Excel automation, SaaS MVPs, and real-world delivery.',
  url: '/resume',
  imageAlt: 'Mauhhik — Resume',
})

function DownloadSuccessMessage() {
  return (
    <div className="max-w-md mx-auto mb-8">
      <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-2xl p-6 text-center">
        <div className="flex justify-center mb-4" aria-hidden="true">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <p className="text-emerald-400 text-sm">
          Resume downloaded successfully!
        </p>
      </div>
    </div>
  )
}

async function DownloadSuccessMessageWrapper({
  searchParams,
}: {
  searchParams: Promise<{ downloaded?: string }>
}) {
  const params = await searchParams
  if (params.downloaded === 'true') {
    return <DownloadSuccessMessage />
  }
  return null
}

export default async function ResumePage({
  searchParams,
}: {
  searchParams: Promise<{ downloaded?: string }>
}) {
  return (
    <main className="bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Request Resume Access
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-4">
            My resume is available to verified professionals. This controlled access ensures I can track who views my credentials and maintain professional discretion.
          </p>
          <p className="text-base text-zinc-500 leading-relaxed max-w-xl mx-auto">
            Enter your email to receive a secure, time-limited download link.
          </p>
        </div>
        
        <Suspense fallback={null}>
          <DownloadSuccessMessageWrapper searchParams={searchParams} />
        </Suspense>
        
        <ResumeRequestForm />
      </div>
    </main>
  )
}
