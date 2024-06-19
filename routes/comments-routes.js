const {removeCommentById} = require('../controllers/comments.controllers')

const commentsRouter = require('express').Router()

//Delete comment by Id
commentsRouter.delete('/:comment_id',removeCommentById)

module.exports = commentsRouter