const express = require('express')
const router = express.Router()
const fs = require('fs')
const v8 = require('v8')

router.get('/dump', (req, res) => {
  const snapshotStream = v8.getHeapSnapshot()
  const now = new Date()
  const fileAttri = `${now.toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-')}`
  // It's important that the filename end with `.heapsnapshot`,
  // otherwise Chrome DevTools won't open it.
  const fileName = `/opt/data/y-websocket-dump/${fileAttri}.heapsnapshot`
  const fileStream = fs.createWriteStream(fileName)
  snapshotStream.pipe(fileStream)
  res.send('ok')
})

router.get('/heap', (req, res) => {
  const heap = process.memoryUsage()
  const heapStr = JSON.stringify(heap)
  res.send(heapStr)
})

module.exports = router
