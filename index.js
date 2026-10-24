var stream = require('readable-stream')
var assert = require('assert')
var zlib = require('zlib')

module.exports = function (req, res) {
  assert.equal(typeof req, 'object', 'http-gzip-maybe: req should be type object')
  assert.equal(typeof res, 'object', 'http-gzip-maybe: res should be type object')

  var acceptEncoding = req.headers['accept-encoding']
  if (!acceptEncoding) acceptEncoding = ''

  if (acceptEncoding.match(/\bbr\b/) && typeof zlib.createBrotliCompress === 'function') {
    res.setHeader('Content-Encoding', 'br')
    return zlib.createBrotliCompress()
  } else if (acceptEncoding.match(/\bgzip\b/)) {
    res.setHeader('Content-Encoding', 'gzip')
    return zlib.createGzip()
  } else if (acceptEncoding.match(/\bdeflate\b/)) {
    res.setHeader('Content-Encoding', 'deflate')
    return zlib.createDeflate()
  } else {
    return new stream.PassThrough()
  }
}
