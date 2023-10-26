const express = require('express')
const router = express.Router()
const client = require('prom-client')
const collectDefaultMetrics = client.collectDefaultMetrics
collectDefaultMetrics({ gcDurationBuckets: [0.1, 0.2, 0.3] })

router.get('/', async (req, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  try {
    let metricsPromise = client.register.metrics()
    const metricsString = await metricsPromise
    const metricsBuffer = Buffer.from(metricsString)
    response.end(metricsBuffer)
  } catch (e) {
    console.error('get metrics error', e)
    response.end('metrics default')
  }
})

module.exports = router
