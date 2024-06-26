const {removeCommentById, postVoteByCommentId} = require('../controllers/comments.controllers')

const commentsRouter = require('express').Router()

//Delete comment by Id
commentsRouter.delete('/:comment_id',removeCommentById)

//add vote to comment by comment id
commentsRouter.patch('/:comment_id',postVoteByCommentId)

module.exports = commentsRouter