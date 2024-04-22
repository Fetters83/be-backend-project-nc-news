const {fetchAllTopics,fetchAllEndPoints} = require('../models/topics.models')


function getAllTopics(req,res,next){
    fetchAllTopics().then(({rows})=>{
      res.status(200).send({topics:rows})
    })
}






module.exports = {getAllTopics}