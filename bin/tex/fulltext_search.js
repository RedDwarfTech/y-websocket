const { MeiliSearch } = require('meilisearch')
var log4js = require('log4js')
var logger = log4js.getLogger()
logger.level = 'warn'

const updateFullsearch = async (file) => {
  try {
    const masterKey = process.env.MEILI_MASTER_KEY
    let option = {
      primaryKey: 'file_id'
    }
    const client = new MeiliSearch({
      host: 'http://meilisearch.reddwarf-toolbox.svc.cluster.local:7700',
      apiKey: masterKey
    })
    let clientIdx = client.index('files')
    clientIdx.addDocuments([file], option)
      .then((res) => {})
    clientIdx.updateFilterableAttributes(['name', 'project_id'])
  } catch (err) {
    logger.error('Failed to sync file index', err)
  }
}
module.exports = {
  updateFullsearch
}