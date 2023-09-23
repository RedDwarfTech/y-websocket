const express = require('express')
const bodyParser = require('body-parser')
const Y = require('yjs')
const { WebsocketProvider } = require('y-websocket')
const app = express()
app.use(bodyParser.json())

app.post('/y-websocket/file/initial', (req, res) => {
  const docId = req.body.doc_id
  const projectId = req.body.project_id
  const initContext = req.body.file_content
  initTpl(docId, projectId, initContext)
  res.send('success')
})

app.listen(3000, () => {
  console.log('started')
})

const initTpl = (docId, projectId, initContext) => {
  let docOpt = {
    guid: docId,
    collectionid: projectId
  }
  const ydoc = new Y.Doc(docOpt)
  const ytext = ydoc.getText(docId)
  const wsProvider = new WebsocketProvider('ws://localhost:1234', docId, ydoc, { WebSocketPolyfill: require('ws') })
  wsProvider.on('status', (event) => {
    if (event.status === 'connected') {
      if (wsProvider.ws) {
        if (initContext && initContext.length > 0) {
          ytext.insert(0, initContext)
        }
      }
    }
  })
}
