const badRequest = require('./badRequest')
const errorResponse = require('./errorResponse')
const forbidden = require('./forbidden')
const getCollection = require('./getCollection')
const notFound = require('./notFound')
const ok = require('./ok')
const serverError = require('./serverError')
const successResponse = require('./successResponse')

module.exports = {
    badRequest,
    errorResponse,
    forbidden,
    getCollection,
    notFound,
    ok,
    serverError,
    successResponse
}