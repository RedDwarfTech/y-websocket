const app = require('../common/tex_express.js').app

app.get('/healthz', (req, res) => {
  res.send('ok')
})
