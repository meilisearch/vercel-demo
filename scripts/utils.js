const watchTasks = async (client, uid) => {
  console.log(`Start update watch for ${uid}`)
  console.log('-------------')
  try {
    const tasks = await client.index(uid).getTasks()
    console.log(`${uid} index: adding documents`)
    console.log('-------------')
    await client.index(uid).waitForTasks(tasks)
    console.log(`All documents added to "${uid}"`)
  } catch (e) {
    console.error(e)
  }
}

const checkData = async (client, indexName) => {
  try {
    const indexesObject = await client.getIndexes()
    const indexes = indexesObject.results
    if (indexes && indexes.some(index => index.uid === indexName)) {
      const firstIndexStats = await client.index(indexName).getStats()
      return firstIndexStats?.numberOfDocuments
    } else {
      return 0
    }
  } catch (e) {
    return e
  }
}

const utils = {
  watchTasks,
  checkData,
}

module.exports = utils
