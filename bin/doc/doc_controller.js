const persistenceDir = process.env.YPERSISTENCE
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const docId = req.params.docId
  const LeveldbPersistence = require('y-leveldb').LeveldbPersistence
  const ldb = new LeveldbPersistence(persistenceDir)
  const persistedYdoc = await ldb.getYDoc(docId)
  let text = persistedYdoc.getText(docId)
  res.send(text)
})

module.exports = router
