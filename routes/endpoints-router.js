const {getEndPoints} = require('../controllers/endpoints.controllers')

const endpointsRouter = require('express').Router()

endpointsRouter.get('/',getEndPoints)

module.exports = {endpointsRouter}