const db  = require('../db/connection')
const endpoints = require('../endpoints.json')





function fetchAllTopics(){
    let queryString = "SELECT * FROM topics;"
    return db.query(queryString)

}





module.exports = {fetchAllTopics}