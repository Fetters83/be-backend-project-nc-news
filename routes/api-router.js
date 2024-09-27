const apiRouter = require('express').Router()
const articlesRouter = require('./articles-routes')
const topicsRouter = require('./topics-routes')
const commentsRouter = require('./comments-routes')
const userRoutes = require('./user.routes')
const { endpointsRouter } = require('./endpoints-router')
const articleVotesRouter = require('./articleVotes-routes')

apiRouter.use('/articles',articlesRouter)
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/comments',commentsRouter)
apiRouter.use('/users',userRoutes)
apiRouter.use('/',endpointsRouter)
apiRouter.use('/article_votes',articleVotesRouter)
  
module.exports = apiRouter;