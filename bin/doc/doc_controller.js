const persistenceDir = process.env.YPERSISTENCE
const express = require('express')
const router = express.Router()
const initTpl = require('../tex/initial_tpl.js').initTpl

router.get('/', async (req, res) => {
  const docId = req.params.docId
  const LeveldbPersistence = require('y-leveldb').LeveldbPersistence
  const ldb = new LeveldbPersistence(persistenceDir)
  const persistedYdoc = await ldb.getYDoc(docId)
  let text = persistedYdoc.getText(docId)
  res.send(text)
})

router.post('/initial', async (req, res) => {
  const docId = req.body.doc_id
  const projectId = req.body.project_id
  const fileContent = req.body.file_content
  initTpl(docId, projectId, fileContent)
  res.end('success')
})

module.exports = router
