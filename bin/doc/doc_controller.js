const express = require('express')
const router = express.Router()
const docs = require('../utils').docs

router.get('/', async (req, res) => {
  const docId = req.params.docId
  const doc = docs.get(docId)
  res.send(doc)
})

module.exports = router
