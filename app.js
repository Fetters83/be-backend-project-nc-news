const express = require('express')
const app = express()

app.use(express.json())
const cors = require('cors');
app.use(cors());
const apiRouter = require('./routes/api-router')



  app.get('/',(req,res,next)=>{
    res.status(200).send('Welcome to NC News - please navigate to https://be-backend-project-nc-news.onrender.com/api to see list of end points')
}) 
 
//All routes begining with /api
 app.use('/api', apiRouter);


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
    if(err.code === "23503" && err.constraint === "articles_author_fkey"){
        res.status(404).send({status:404,msg:err.msg})
    }
    if(err.code === "23503" && err.constraint === "articles_topic_fkey"){
        res.status(404).send({status:404,msg:"this topic does not exist"})
    }
    next(err)
})

app.all('*',(req,res,next)=>{
    res.status(404).send({msg:'endpoint not found'})
})

module.exports = app