const endpoints = require('../endpoints.json')

function getEndPoints(req,res,next){

    res.status(200).send({endpoints})
}

module.exports = {getEndPoints}