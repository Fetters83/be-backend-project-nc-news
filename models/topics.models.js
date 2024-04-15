const db  = require('../db/connection')


function fetchAllTopics(){
    let queryString = "SELECT * FROM topics;"
    return db.query(queryString)

}

module.exports = {fetchAllTopics}