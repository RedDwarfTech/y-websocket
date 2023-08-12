const http = require('http')

const getFileJsonData = (fileId) => {
  const baseUrl = 'http://texhub-server-service.reddwarf-pro.cluster.local'
  const url = `${baseUrl}/tex/file/detail?file_id=${encodeURIComponent(fileId)}`
  http.get(url, (response) => {
    let data = ''
    response.on('data', (chunk) => {
      data += chunk
    })
    response.on('end', () => {
      const json = JSON.parse(data)
      console.log(json)
    })
  }).on('error', (error) => {
    console.error(error)
  })
}
exports.getFileJsonData = getFileJsonData
