const express = require('express')
const app = express()
const {getAllTopics,getAllEndPoints} = require('./controllers/topics.controllers')
const endpoints = require('./endpoints.json')

app.use(express.json())

app.get('/api/topics',getAllTopics)

app.get('/api',(req,res,next)=>{
    res.status(200).send({endpoints})
    

})





app.all('*',(req,res,next)=>{
    res.status(404).send({msg:'endpoint not found'})
})

module.exports = app