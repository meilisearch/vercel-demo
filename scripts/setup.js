const { MeiliSearch } = require('meilisearch')
const { watchTasks, checkData } = require('./utils')
const indexes = require('./indexData')
require('dotenv').config()

const settings = {
  rankingRules: [
    'typo',
    'words',
    'proximity',
    'attribute',
    'exactness',
    'release_date:desc',
    'popularity:desc',
  ],
  searchableAttributes: ['title'],
}

const credentials = {
  host: process.env.MEILISEARCH_URL,
  apiKey: process.env.MEILISEARCH_ADMIN_KEY,
}

const setup = async () => {
  try {
    console.log('🚀 Seeding your Meilisearch instance')

    if (!credentials.host) {
      throw new Error('Missing `MEILISEARCH_URL` environment variable')
    }

    if (!credentials.apiKey) {
      throw new Error('Missing `MEILISEARCH_ADMIN_KEY` environment variable')
    }

    const client = new MeiliSearch(credentials)

    try {
      await client.health()
    } catch (error) {
      throw new Error('Meilisearch index is not ready. Skipping indexing...')
    }

    const docNumber = await checkData(client, indexes[0].indexName)

    if (docNumber > 0) {
      return 'Index already exists with data'
    }

    await Promise.all(
      indexes.map(async index => {
        const currentIndexName = index.indexName
        const currentIndex = client.index(currentIndexName)
        console.log(`Adding settings to \`${currentIndexName}\``)
        await currentIndex.updateSettings(settings)
        console.log(`Adding documents to \`${currentIndexName}\``)
        await currentIndex.addDocuments(index.documents)
        await watchTasks(client, currentIndexName)
      })
    )
  } catch (error) {
    console.error(error)
  }
}

const res = async () => {
  let r = await setup()
  console.log(r)
}
res()

module.exports = setup
