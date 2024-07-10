const {getAllTopics, postTopic} = require('../controllers/topics.controllers')
const topicsRouter = require('express').Router()

//Get all topics
topicsRouter.get('/',getAllTopics)
//Post new topic
topicsRouter.post('/',postTopic)

module.exports = topicsRouter