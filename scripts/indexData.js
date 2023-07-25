const moviesEn = require('../assets/movies-en-US.json')
const moviesJp = require('../assets/movies-ja-JP.json')
const moviesTh = require('../assets/movies-th-TH.json')

const indexes = [
  {
    indexName: 'movies-en-US',
    documents: moviesEn,
  },
  {
    indexName: 'movies-ja-JP',
    documents: moviesJp,
  },
  {
    indexName: 'movies-th-TH',
    documents: moviesTh,
  },
]

module.exports = indexes
