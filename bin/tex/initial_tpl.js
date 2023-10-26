const Y = require('yjs')
const { WebsocketProvider } = require('y-websocket')

exports.initTpl = (docId, projectId, initContext) => {
  let docOpt = {
    guid: docId,
    collectionid: projectId
  }
  const ydoc = new Y.Doc(docOpt)
  const ytext = ydoc.getText(docId)
  const wsProvider = new WebsocketProvider('ws://localhost:1234', docId, ydoc, { WebSocketPolyfill: require('ws') })
  wsProvider.on('status', (event) => {
    if (event.status === 'connected') {
      console.log('connected')
      if (wsProvider.ws) {
        console.log('ws')
        if (initContext && initContext.length > 0) {
          console.log('insert:')
          ytext.insert(0, initContext)
        }
      }
    }
  })
}
