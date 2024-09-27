const {getArticleById,getAllArticles,postVoteByArticleId, postNewArticle, removeArticleByArticleId} = require('../controllers/articles.controllers')
const {getCommentsByArticleId,postCommentByArticleId} = require('../controllers/comments.controllers')
const articlesRouter = require('express').Router()

//get articles
articlesRouter.get('/',getAllArticles)
articlesRouter.get('/:article_id',getArticleById)
articlesRouter.get('/:article_id/comments',getCommentsByArticleId)
//update articles vote
articlesRouter.patch('/:article_id',postVoteByArticleId)
//post comments by article ID
articlesRouter.post('/:article_id/comments',postCommentByArticleId)
//post new article
articlesRouter.post('/',postNewArticle)

//delete articles
articlesRouter.delete('/:article_id',removeArticleByArticleId)
module.exports = articlesRouter;