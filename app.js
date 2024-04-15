const express = require('express')
const app = express()
const {getAllTopics} = require('./controllers/topics.controllers')

app.use(express.json())

app.get('/api/topics',getAllTopics)



app.all('*',(req,res,next)=>{
    res.status(404).send({msg:'endpoint not found'})
})

module.exports = app