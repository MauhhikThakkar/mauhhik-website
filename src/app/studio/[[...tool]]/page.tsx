/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path are handled by this file using Next.js catch-all routes.
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * Wrapping NextStudio in a container prevents unknown DOM props from leaking to the DOM
 * (e.g. disableTransition from Sanity internals) and stabilizes integration with Next.js 15.
 */

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export const dynamic = 'force-dynamic'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return (
    <div className="min-h-screen">
      <NextStudio config={config} />
    </div>
  )
}
