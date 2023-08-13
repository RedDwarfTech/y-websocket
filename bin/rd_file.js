const getFileJsonData = require('./rest_client.js').getFileJsonData
const fs = require('fs')

const handleFileSync = async (docName, ldb) => {
  try {
    const persistedYdoc = await ldb.getYDoc(docName)
    let text = persistedYdoc.getText(docName)
    if (!text || !text.toString()) {
      return
    }
    console.info('text result:' + text.toString())
    let fileContent = await getFileJsonData(docName)
    if (!fileContent) {
      console.error(`get file info failed，file info: ${fileContent},docName:${docName}`)
      return
    }
    let projectId = fileContent.result.project_id
    let fileName = fileContent.result.name
    let folderPath = `/opt/data/project/${projectId}`
    fs.mkdir(folderPath, { recursive: true }, (error) => {
      if (error) {
        console.error('craete directory failed,', error)
      }
    })
    fs.writeFile(`${folderPath}/${fileName}`, text.toString(), (err) => {
      if (err) {
        console.error('Failed to write file:', err)
      }
    })
  } catch (err) {
    console.error('Failed to sync file to disk', err)
  }
}
exports.handleFileSync = handleFileSync
