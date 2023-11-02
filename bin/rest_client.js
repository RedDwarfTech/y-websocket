const http = require('http')
var log4js = require('log4js')
var logger = log4js.getLogger()
logger.level = 'warn'

const flushIndex = (fileId, content) => {
  const baseUrl = 'http://tex-service.reddwarf-pro.svc.cluster.local:8000'
  const url = `${baseUrl}/tex/project/flush/idx`
  let req = {
    file_id: fileId,
    content: content
  }
  const requestData = JSON.stringify(req)
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestData)
    }
  }
  const request = http.request(url, options, (response) => {
    logger.warn('request response: ' + JSON.stringify(response))
  })
  request.on('error', (error) => {
    logger.error('send idx file info error' + error)
  })
  request.write(requestData)
  request.end()
}

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
          logger.error('parse json failed' + e + ',data:' + data)
        }
      })
    }).on('promise error', (error) => {
      logger.error('get file info error' + error)
      reject(error)
    })
  })
}
module.exports = {
  getFileJsonData,
  flushIndex
}
