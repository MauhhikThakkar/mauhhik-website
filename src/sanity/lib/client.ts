import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // DISABLED: CDN caching was preventing new posts from appearing
  // Set to true only if you configure proper revalidation
})
