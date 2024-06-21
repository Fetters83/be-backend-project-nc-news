const {fetchAllUsers,fetchUserByUserName} = require('../models/users.models')

function getAllUsers(req,res,next){
    const {query} = req.query
    fetchAllUsers().then((users)=>{
        
        res.status(200).send({users})
    })
}

function getUserByUserName(req,res,next){
    const {username} = req.params
       fetchUserByUserName(username).then((user)=>{
       res.status(200).send(user)
    }).catch((err)=>{
        next(err)
    })

}
module.exports = {getAllUsers,getUserByUserName}
