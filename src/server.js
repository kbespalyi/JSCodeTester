'use strict'

// Server definition
const EventEmitter = require('events').EventEmitter
EventEmitter.defaultMaxListeners = 100
const emitter = new EventEmitter()
emitter.setMaxListeners(EventEmitter.defaultMaxListeners)

// LOGS
process.CONSOLE_DEBUG = (process.env.CONSOLE_DEBUG === 'true')

const disableConsole = (
  process.env.NODE_ENV === 'production'
  && !process.env.CONSOLE_DEBUG
)

const P = require('bluebird')
P.config({
  cancellation: true,
  longStackTraces: false,
  monitoring: true,
  warnings: true
})
P.onPossiblyUnhandledRejection(() => {})

require('dotenv').config()

const path = require('path')
const express = require('express')
const router = express.Router()
const cors = require('cors')
const compression = require('compression')
const port = process.env.PORT || 5000

const app = (module.exports = express())

app.use(cors())
app.use(express.json())
app.use(compression())
app.disable('x-powered-by')

app.start = (cb) => {
  // Start the web server
  const httpServer = app.listen(port, () => {

    router.route('/').get((req, res) => {
      console.log(req)
      res.status(200).json({status: 'OK'})
    })
    
    app.stop = (callback) => {
      app.removeAllListeners('started')
      httpServer.close()
      if (callback) {
        callback()
      }
    }

    // if cb is passed this method is being called by the tests,
    // so don't write this line out to screen.
    if (cb) {
      return cb(app)
    }

    console.log(`Server is running on port: ${port}`)  
    return app.emit('started')
  })
}
  
global.app = app
global.appRequire = (name) => {
  return require(path.join(__dirname, name))
}

// start the server if `$ node server.js`
if (require.main === module) {
  app.start()
}
