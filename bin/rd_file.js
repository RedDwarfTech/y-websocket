const getFileJsonData = require('./rest_client.js').getFileJsonData
const fs = require('fs')
const lodash = require('lodash')
const path = require('path')
var log4js = require('log4js')
var logger = log4js.getLogger()
logger.level = 'warn'
const updateFullsearch = require('./tex/fulltext_search.js').updateFullsearch

const throttledFn = lodash.throttle((docName, ldb) => {
  handleFileSync(docName, ldb)
}, 2000)

const handleFileSync = async (docName, ldb) => {
  try {
    const persistedYdoc = await ldb.getYDoc(docName)
    let text = persistedYdoc.getText(docName)
    if (!text || !text.toString()) {
      return
    }
    let fileContent = await getFileJsonData(docName)
    if (!fileContent) {
      logger.error(`get file info failed，file info: ${fileContent},docName:${docName}`)
      return
    }
    let projectId = fileContent.result.project_id
    let fileName = fileContent.result.name
    let filePath = fileContent.result.file_path
    let date = new Date(fileContent.result.project_created_time)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    let folderPath = path.join(`/opt/data/project/${year}/${month}/${projectId}`, filePath)
    fs.mkdir(folderPath, { recursive: true }, (error) => {
      if (error) {
        logger.error('craete directory failed,', error)
      }
    })
    fs.writeFile(path.join(folderPath, fileName), text.toString(), (err) => {
      if (err) {
        logger.error('Failed to write file:', err)
      }
    })
    updateFullsearch(docName, text.toString())
  } catch (err) {
    logger.error('Failed to sync file to disk', err)
  }
}
module.exports = {
  handleFileSync,
  throttledFn
}
