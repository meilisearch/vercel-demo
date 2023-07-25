import { checkData } from '../../../scripts/utils'
import { MeiliSearch } from 'meilisearch'
import indexes from '../../../scripts/indexData'

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_URL,
  apiKey: process.env.MEILISEARCH_ADMIN_KEY,
})

export default async function getStats(req, res) {
  try {
    const result = await checkData(client, indexes[0].indexName)
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ error: 'failed to load data', err })
  }
}
