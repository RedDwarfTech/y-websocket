const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/y-websocket/file/initial', (req, res) => {
  const docId = req.body.doc_id;
  const projectId = req.body.project_id;
  const initContext = req.body.file_content;
  console.log(docId, projectId, initContext);
  init_tpl(docId, projectId, initContext);
  res.send('请求已成功处理');
});

app.listen(3000, () => {
  console.log('服务器已启动');
});

const init_tpl = (docId, projectId, initContext) => {
    let docOpt = {
        guid: docId,
        collectionid: projectId
    };
    const ydoc = new Y.Doc(docOpt);
    const wsProvider = new WebsocketProvider('ws://localhost:1234', docId, ydoc, { WebSocketPolyfill: require('ws') })
    wsProvider.on('status', (event) => {
        if (event.status === 'connected') {
            if (wsProvider.ws) {
                if (initContext && initContext.length > 0) {
                    console.log("write: {}", initContext);
                    ytext.insert(0, initContext);
                }
            }
        }
    });
}

