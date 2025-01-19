const expressHealth = require('express')
const routerHealth = expressHealth.Router()

routerHealth.get('/healthz', (req, res) => {
  res.send('ok')
})

module.exports = routerHealth
