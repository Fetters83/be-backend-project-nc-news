const {fetchAllUsers} = require('../models/users.models')

function getAllUsers(req,res,next){
    const {query} = req.query
    fetchAllUsers().then((users)=>{
        
        res.status(200).send({users})
    })
}

module.exports = {getAllUsers}
