'use strict'

const path = require('path')

const EventEmitter = require('events').EventEmitter
EventEmitter.defaultMaxListeners = 100
process.setMaxListeners(EventEmitter.defaultMaxListeners)

const P = require('bluebird')
const server = require('../../src/server')
P.onPossiblyUnhandledRejection(() => {})

module.exports = () => {

  require('cls-hooked')

  const app = require(path.resolve(__dirname, '../../src/server.js'))

  const output = {
    app,
    pauseTime: 100,
    resolve: (v) => P.resolve(v),
    reject: (v) => P.reject(v),
    delay: (ms, v) => ms > 0 ? P.delay(ms, v) : P.delay(100)
  }

  output.standardSetup = () => {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Invalid NODE_ENV')
    }
    return output.startServer()
  }

  output.standardTearDown = (server) => new P(
    (resolve) => {
      if (server) {
        server.stop(() => {
          server = null
          return resolve()
        })
      }
    })

  output.startServer = () => new P((resolve) => {
    output.app.start((server) => {
      resolve(server)
    })
  })

  return output
}
