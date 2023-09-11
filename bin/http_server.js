const http = require('http')

const server = http.createServer((req, res) => {
  if (req.url === '/y-websocket/file/initial' && req.method === 'GET') {
    res.setHeader('Content-Type', 'text/plain')
    res.end('Initial file requested')
  }
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello, World!')
})

const port = 3000
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
