const persistenceDir = process.env.YPERSISTENCE
const expressDoc = require('express')
const routerDoc = expressDoc.Router()
const initTpl = require('../tex/initial_tpl.js').initTpl

routerDoc.get('/', async (req, res) => {
  const docId = req.params.docId
  const LeveldbPersistence = require('y-leveldb').LeveldbPersistence
  const ldb = new LeveldbPersistence(persistenceDir)
  const persistedYdoc = await ldb.getYDoc(docId)
  let text = persistedYdoc.getText(docId)
  res.send(text)
})

/**
 * https://discuss.yjs.dev/t/is-it-possible-to-using-http-to-do-some-initial-job/2108/1
 */
routerDoc.post('/initial', async (req, res) => {
  const docId = req.body.doc_id
  const projectId = req.body.project_id
  const fileContent = req.body.file_content
  initTpl(docId, projectId, fileContent)
  res.end('success')
})

module.exports = routerDoc
