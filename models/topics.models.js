const db  = require('../db/connection')
const endpoints = require('../endpoints.json')





function fetchAllTopics(){
    let queryString = "SELECT * FROM topics;"
    return db.query(queryString)

}


function checkTopicExists(topic){
      return db.query('SELECT * FROM topics where slug=$1',[topic]).then(({rows:topics})=>{
            if(topics.length===0){
            return Promise.reject({status:404,msg:'topic not found'})
        }
    })
  }
  


module.exports = {fetchAllTopics,checkTopicExists}