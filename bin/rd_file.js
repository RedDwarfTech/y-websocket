const getFileJsonData = require('./rest_client.js').getFileJsonData
const fs = require('fs')
const lodash = require('lodash')
const path = require('path')

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
      console.error(`get file info failed，file info: ${fileContent},docName:${docName}`)
      return
    }
    let projectId = fileContent.result.project_id
    let fileName = fileContent.result.name
    let filePath = fileContent.result.file_path
    let date = new Date(fileContent.result.project_created_time)
    const year = date.getFullYear()
    const month = date.getMonth()
    let folderPath = path.join(`/opt/data/project/${year}/${month}/${projectId}`, filePath)
    fs.mkdir(folderPath, { recursive: true }, (error) => {
      if (error) {
        console.error('craete directory failed,', error)
      }
    })
    fs.writeFile(path.join(folderPath, fileName), text.toString(), (err) => {
      if (err) {
        console.error('Failed to write file:', err)
      }
    })
  } catch (err) {
    console.error('Failed to sync file to disk', err)
  }
}
module.exports = {
  handleFileSync,
  throttledFn
}
