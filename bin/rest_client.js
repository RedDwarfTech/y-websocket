const http = require('http')

const getFileJsonData = (fileId) => {
  return new Promise((resolve, reject) => {
    const baseUrl = 'http://tex-service.reddwarf-pro.svc.cluster.local:8000'
    const url = `${baseUrl}/tex/file/y-websocket/detail?file_id=${encodeURIComponent(fileId)}`
    http.get(url, (response) => {
      let data = ''
      response.on('data', (chunk) => {
        data += chunk
      })
      response.on('end', () => {
        try {
          const json = JSON.parse(data)
          resolve(json)
        } catch (e) {
          console.error('parse json failed' + e + ',data:' + data)
        }
      })
    }).on('promise error', (error) => {
      console.error('get file info error' + error)
      reject(error)
    })
  })
}
exports.getFileJsonData = getFileJsonData
