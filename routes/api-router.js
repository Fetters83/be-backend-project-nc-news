const apiRouter = require('express').Router()
const articlesRouter = require('./articles-routes')
const topicsRouter = require('./topics-routes')
const commentsRouter = require('./comments-routes')
const userRoutes = require('./user.routes')
const { endpointsRouter } = require('./endpoints-router')

apiRouter.use('/articles',articlesRouter)
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/comments',commentsRouter)
apiRouter.use('/users',userRoutes)
apiRouter.use('/',endpointsRouter)
  
module.exports = apiRouter;