const express = require('express')
const https = require('https')
const app = express()
const PORT = process.env.PORT || 3000

const RAPIDAPI_KEY = '839015423amshe6bb0e09653e6f2p13ac83jsncd55cef17962'
const RAPIDAPI_HOST = 'myanmar-all-in-one-2d-results.p.rapidapi.com'

const ROUTES = {
  '/live': '/api/v1/live',
  '/daily': '/api/v1/2d3d-daily-results',
  '/calendar': '/api/v1/2d3d-calendar-database',
  '/holiday': '/api/v1/holiday',
  '/private-exchange': '/api/v1/myanmar-local-private-exchange',
  '/history': '/api/v1/2d-calendar-history-free-available',
}

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

app.get('/', function(req, res) {
  res.json({ status: 'ok', routes: Object.keys(ROUTES) })
})

Object.keys(ROUTES).forEach(function(route) {
  app.get(route, function(req, res) {
    const options = {
      hostname: RAPIDAPI_HOST,
      path: ROUTES[route],
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
        'Content-Type': 'application/json'
      }
    }

    const apiReq = https.request(options, function(apiRes) {
      let data = ''
      apiRes.on('data', function(chunk) { data += chunk })
      apiRes.on('end', function() {
        try {
          res.json(JSON.parse(data))
        } catch(e) {
          res.status(500).json({ status: 'error', message: 'Parse error' })
        }
      })
    })

    apiReq.on('error', function(e) {
      res.status(500).json({ status: 'error', message: e.message })
    })

    apiReq.end()
  })
})

app.listen(PORT, function() {
  console.log('Server running at http://localhost:' + PORT)
})