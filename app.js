const express = require('express')
const app = express()
const {getAllTopics} = require('./controllers/topics.controllers')
const {getArticleById,getAllArticles,postVoteByArticleId} = require('./controllers/articles.controllers')
const {getCommentsByArticleId,postCommentByArticleId} = require('./controllers/comments.controllers')
const endpoints = require('./endpoints.json')
app.use(express.json())

app.get('/api/topics',getAllTopics)

app.get('/api',(req,res,next)=>{
    res.status(200).send({endpoints})
})
app.get('/api/articles/:article_id',getArticleById)

app.patch('/api/articles/:article_id',postVoteByArticleId)

app.get('/api/articles',getAllArticles)

app.get('/api/articles/:article_id/comments',getCommentsByArticleId)

app.post('/api/articles/:article_id/comments',postCommentByArticleId)

//Error handling middleware

app.use((err,req,res,next)=>{
if(err.status && err.msg){
     res.status(err.status).send({msg:err.msg})
    }
    next(err)
})

app.use((err,req,res,next)=>{
    if(err.code === "22P02"){
    res.status(400).send({status:400,msg:"Bad request"})
    }
    next(err)
})

app.use((err,req,res,next)=>{
    if(err.code === "23503" && err.constraint === "comments_article_id_fkey"){
     res.status(404).send({status:404, msg:"this article does not exist"})   
    }
    if(err.code === "23503" && err.constraint === "comments_author_fkey"){
        res.status(404).send({status:404,msg:"you are not yet a valid user"})
    }
})

app.all('*',(req,res,next)=>{
    res.status(404).send({msg:'endpoint not found'})
})

module.exports = app