const {getAllUsers, getUserByUserName} = require('../controllers/users.controller')
const userRouter = require('express').Router()

//Get all users
userRouter.get('/',getAllUsers)
userRouter.get('/:username',getUserByUserName)

module.exports = userRouter



