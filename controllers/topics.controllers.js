const {fetchAllTopics,fetchAllEndPoints, insertTopic} = require('../models/topics.models')


function getAllTopics(req,res,next){
    fetchAllTopics().then(({rows})=>{
      res.status(200).send({topics:rows})
    })
}

function postTopic(req,res,next){
    const{slug} = req.body
    const{description} = req.body   
     insertTopic(slug,description).then((topic)=>{
      res.status(201).send({newTopic:topic})
     }).catch((err)=>{
        next(err)
     }) 
}






module.exports = {getAllTopics,postTopic}