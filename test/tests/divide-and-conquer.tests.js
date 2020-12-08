'use strict'

const chai = require('chai')
const { assert } = require('console')
const expect = chai.expect

const testTools = require(require('path').resolve('./test/tools'))

describe('devide-and-conquer', async () => {
  const t = testTools()
  const MatrixTransform = require('../../src/modules/matrix_math/transformations')

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

    it('should be able test modules', async () => {
      let scope = {}
      await t.resolve()
        .then(() => {
          expect(_server.stop).to.be.a('function')
          expect(MatrixTransform).to.be.a('function')
          expect(MatrixTransform.testMatrix()).to.be.an('object')
          scope = null
        })
        .catch((err) => {
          scope = null
          throw err
        })
    })

    it('should be able test the matrix', async () => {
      let scope = {
        testMatrix: MatrixTransform.testMatrix()
      }
      await t.resolve()
        .then(() => {
          expect(scope.testMatrix.identityResult).to.deep.equal(
            [ 4, 3, 2, 1 ]
          )
          scope = null
        })
        .catch((err) => {
          scope = null
          throw err
        })
    })

    it('should be able to loop a fibonnaci function', async () => {
      let scope = {}
      await t.resolve()
        .then(() => {

          const N = 40
          const fib_n = (n) => {

            if (n <= 0) {
              return 0
            }
            if (n <= 2) {
              return 1
            }

            return fib_n(n - 1) + fib_n(n - 2)
          }

          expect(fib_n(0)).to.equal(0)
          expect(fib_n(1)).to.equal(1)
          expect(fib_n(2)).to.equal(1)

          let prev1 = 1, prev2 = 1, next = 0

          console.time('fib_loop')
          for (let n = 3; ; n++) {
            next = prev1 + prev2

            !process.CONSOLE_DEBUG || console.log('N=', n, 'prev1=', prev1, 'prev2=', prev2, 'next=', next)

            !process.CONSOLE_DEBUG || console.time('fib')
            const f_exp = fib_n(n)
            !process.CONSOLE_DEBUG || console.timeEnd('fib')
            expect(f_exp).to.equal(next)

            if (n > N) {
              break
            } else {
              [ prev1, prev2 ] = [ prev2, next ]
            }
          }
          console.timeEnd('fib_loop')
          console.log('N=', N, 'prev1=', prev1, 'prev2=', prev2, 'next=', next)

          scope = null
        })
        .catch((err) => {
          scope = null
          throw err
        })

        /** O^2
          N= 3 prev1= 1 prev2= 1 next= 2
          fib: 0.112ms
          N= 4 prev1= 1 prev2= 2 next= 3
          fib: 0.008ms
          N= 5 prev1= 2 prev2= 3 next= 5
          fib: 0.003ms
          N= 6 prev1= 3 prev2= 5 next= 8
          fib: 0.003ms
          N= 7 prev1= 5 prev2= 8 next= 13
          fib: 0.003ms
          N= 8 prev1= 8 prev2= 13 next= 21
          fib: 0.004ms
          N= 9 prev1= 13 prev2= 21 next= 34
          fib: 0.008ms
          N= 10 prev1= 21 prev2= 34 next= 55
          fib: 0.007ms
          N= 11 prev1= 34 prev2= 55 next= 89
          fib: 0.010ms
          N= 12 prev1= 55 prev2= 89 next= 144
          fib: 0.016ms
          N= 13 prev1= 89 prev2= 144 next= 233
          fib: 0.024ms
          N= 14 prev1= 144 prev2= 233 next= 377
          fib: 0.038ms
          N= 15 prev1= 233 prev2= 377 next= 610
          fib: 0.063ms
          N= 16 prev1= 377 prev2= 610 next= 987
          fib: 0.098ms
          N= 17 prev1= 610 prev2= 987 next= 1597
          fib: 0.283ms
          N= 18 prev1= 987 prev2= 1597 next= 2584
          fib: 0.253ms
          N= 19 prev1= 1597 prev2= 2584 next= 4181
          fib: 0.041ms
          N= 20 prev1= 2584 prev2= 4181 next= 6765
          fib: 0.059ms
          N= 21 prev1= 4181 prev2= 6765 next= 10946
          fib: 0.093ms
          N= 22 prev1= 6765 prev2= 10946 next= 17711
          fib: 0.150ms
          N= 23 prev1= 10946 prev2= 17711 next= 28657
          fib: 0.249ms
          N= 24 prev1= 17711 prev2= 28657 next= 46368
          fib: 0.389ms
          N= 25 prev1= 28657 prev2= 46368 next= 75025
          fib: 0.664ms
          N= 26 prev1= 46368 prev2= 75025 next= 121393
          fib: 1.079ms
          N= 27 prev1= 75025 prev2= 121393 next= 196418
          fib: 1.725ms
          N= 28 prev1= 121393 prev2= 196418 next= 317811
          fib: 2.810ms
          N= 29 prev1= 196418 prev2= 317811 next= 514229
          fib: 4.992ms
          N= 30 prev1= 317811 prev2= 514229 next= 832040
          fib: 7.446ms
          N= 31 prev1= 514229 prev2= 832040 next= 1346269
          fib: 12.287ms
          N= 32 prev1= 832040 prev2= 1346269 next= 2178309
          fib: 19.267ms
          N= 33 prev1= 1346269 prev2= 2178309 next= 3524578
          fib: 31.258ms
          N= 34 prev1= 2178309 prev2= 3524578 next= 5702887
          fib: 49.292ms
          N= 35 prev1= 3524578 prev2= 5702887 next= 9227465
          fib: 78.538ms
          N= 36 prev1= 5702887 prev2= 9227465 next= 14930352
          fib: 125.378ms
          N= 37 prev1= 9227465 prev2= 14930352 next= 24157817
          fib: 200.658ms
          N= 38 prev1= 14930352 prev2= 24157817 next= 39088169
          fib: 320.563ms
          N= 39 prev1= 24157817 prev2= 39088169 next= 63245986
          fib: 530.889ms
          N= 40 prev1= 39088169 prev2= 63245986 next= 102334155
          fib: 852.568ms
          N= 41 prev1= 63245986 prev2= 102334155 next= 165580141
          fib: 1353.395ms
          N= 42 prev1= 102334155 prev2= 165580141 next= 267914296
          fib: 2210.899ms
          N= 43 prev1= 165580141 prev2= 267914296 next= 433494437
          fib: 3574.108ms
          N= 44 prev1= 267914296 prev2= 433494437 next= 701408733
          fib: 5765.366ms
          N= 45 prev1= 433494437 prev2= 701408733 next= 1134903170
          fib: 9351.091ms
          N= 46 prev1= 701408733 prev2= 1134903170 next= 1836311903
          fib: 15093.414ms
          N= 47 prev1= 1134903170 prev2= 1836311903 next= 2971215073
          fib: 24505.019ms
          N= 48 prev1= 1836311903 prev2= 2971215073 next= 4807526976
          fib: 45832.114ms
          N= 49 prev1= 2971215073 prev2= 4807526976 next= 7778742049
          fib: 75092.632ms
          N= 50 prev1= 4807526976 prev2= 7778742049 next= 12586269025
          fib: 120536.113ms
          N= 51 prev1= 7778742049 prev2= 12586269025 next= 20365011074
          fib: 194303.942ms
          N= 52 prev1= 12586269025 prev2= 20365011074 next= 32951280099
          fib: 322021.603ms
          N= 53 prev1= 20365011074 prev2= 32951280099 next= 53316291173
          fib: 512991.247ms
          N= 54 prev1= 32951280099 prev2= 53316291173 next= 86267571272
          fib: 832406.816ms
          N= 55 prev1= 53316291173 prev2= 86267571272 next= 139583862445
          fib: 1327472.103ms
          N= 56 prev1= 86267571272 prev2= 139583862445 next= 225851433717
          fib: 2145469.292ms
          N= 57 prev1= 139583862445 prev2= 225851433717 next= 365435296162
          fib: 3474968.691ms
          N= 58 prev1= 225851433717 prev2= 365435296162 next= 591286729879
          fib: 5664979.050ms
          N= 59 prev1= 365435296162 prev2= 591286729879 next= 956722026041
          fib: 9095704.139ms
          N= 60 prev1= 591286729879 prev2= 956722026041 next= 1548008755920
          fib: 14721020.342ms
         */
    })



  })
})
