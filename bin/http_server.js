const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

app.post('/y-websocket/file/initial', (req, res) => {
  // initTpl(docId, projectId, initContext)
  res.send('success')
})

app.listen(3000, () => {
  console.log('started')
})
