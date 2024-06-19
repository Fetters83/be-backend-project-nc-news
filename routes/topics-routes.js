const {getAllTopics} = require('../controllers/topics.controllers')
const topicsRouter = require('express').Router()

//Get all topics
topicsRouter.get('/',getAllTopics)

module.exports = topicsRouter