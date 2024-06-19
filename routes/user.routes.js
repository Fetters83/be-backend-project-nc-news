const {getAllUsers} = require('../controllers/users.contoller')
const userRouter = require('express').Router()

//Get all users
userRouter.get('/',getAllUsers)

module.exports = userRouter



