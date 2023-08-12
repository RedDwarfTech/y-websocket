const getFileJsonData = require('./rest_client.js').getFileJsonData
const fs = require('fs')

const handleFileSync = (docName, ydoc) => {
  try {
    let fileContent = getFileJsonData(docName)
    if (!fileContent) {
      console.error(`get file info failed，file info: ${fileContent},docName:${docName}`)
      return
    }
    let projectId = fileContent.result.project_id
    let fileName = fileContent.result.name
    fs.writeFile(`/opt/data/project/${projectId}/${fileName}`, docName, (err) => {
      if (err) {
        console.error('Failed to write file:', err)
      }
    })
  } catch (err) {
    console.error('Failed to sync file to disk', err)
  }
}
exports.handleFileSync = handleFileSync
