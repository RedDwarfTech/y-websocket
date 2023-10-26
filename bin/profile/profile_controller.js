const express = require('express')
const router = express.Router()
const fs = require('fs')
const v8 = require('v8')

router.get('/dump', (req, res) => {
  const snapshotStream = v8.getHeapSnapshot()
  // It's important that the filename end with `.heapsnapshot`,
  // otherwise Chrome DevTools won't open it.
  const fileName = `/opt/data/y-websocket-dump/${Date.now()}.heapsnapshot`
  const fileStream = fs.createWriteStream(fileName)
  snapshotStream.pipe(fileStream)

  res.send('ok')
})

router.get('/heap', (req, res) => {
  const heap = process.memoryUsage().heapTotal
  const heapInMB = (heap / 1024 / 1024).toFixed(2)
  res.send(heapInMB.toString() + 'MB')
})

module.exports = router
