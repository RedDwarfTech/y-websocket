const http = require('http')

const getFileJsonData = (fileId) => {
  return new Promise((resolve, reject) => {
    const baseUrl = 'http://tex-service.reddwarf-pro.svc.cluster.local:8000'
    const url = `${baseUrl}/tex/file/detail?file_id=${encodeURIComponent(fileId)}`
    http.get(url, (response) => {
      let data = ''
      response.on('data', (chunk) => {
        data += chunk
      })
      response.on('end', () => {
        const json = JSON.parse(data)
        resolve(json)
      })
    }).on('promise error', (error) => {
      console.error(error)
      reject(error)
    })
  })
}
exports.getFileJsonData = getFileJsonData
