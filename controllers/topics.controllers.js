const {fetchAllTopics,fetchAllEndPoints} = require('../models/topics.models')


function getAllTopics(req,res,next){
    fetchAllTopics().then((body)=>{
      res.status(200).send(body.rows)
    })
}






module.exports = {getAllTopics}