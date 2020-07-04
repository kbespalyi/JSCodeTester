'use strict'

const chai = require('chai')
const expect = chai.expect

const testTools = require(require('path').resolve('./test/tools'))

describe('devide-and-conquer', async () => {
  const t = testTools()

  describe('test', async () => {
    let _server

    beforeEach(async () => {
      await t.standardSetup()
        .then((server) => {
          _server = server
          process.CONSOLE_DEBUG = false
        })
        .catch((err) => {
          _server = null
          process.CONSOLE_DEBUG = false
          throw err
        })
    })

    afterEach(async () => {
      await t.standardTearDown(_server)
        .then(() => {
          _server = null
          process.CONSOLE_DEBUG = false
        })
        .catch((err) => {
          _server = null
          process.CONSOLE_DEBUG = false
          throw err
        })
    })

    it('should be able test', async () => {
      await t.resolve()
        .then(() => {
          expect(_server.stop).to.be.an('function')
        })
        .catch((err) => {
          throw err
        })
    })
  })
})
