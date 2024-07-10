const db = require("../db/connection");
const format = require("pg-format")
const endpoints = require("../endpoints.json");

function fetchAllTopics() {
  const queryString = "SELECT * FROM topics;";
  return db.query(queryString);
}

function checkTopicExists(topic) {
  return db
    .query("SELECT * FROM topics where slug=$1", [topic])
    .then(({ rows: topics }) => {
      if (topics.length === 0) {
       return Promise.reject({ status: 404, msg: "topic not found" });
      }
    });
}

function insertTopic(slug,description){
  const regex = /[a-zA-Z0-9_]+/i;
  if(slug) {
    if(typeof slug != 'string' ){
      return Promise.reject({status:400,msg:'slug must be of type string'})
    }
    if(!regex.test(slug)){
      return Promise.reject({status:400,msg:"slug must contain alpha numeric characters"})
    }
  }
  if(description) {
    if(typeof description != 'string' ){
      return Promise.reject({status:400,msg:'description must be of type string'})
    }
    if(!regex.test(description)){
      return Promise.reject({status:400,msg:"description must contain alpha numeric characters"})
    }
  }
  if(!slug){
    return Promise.reject({status:400,msg:"slug must be provided"})
  }
  if(!description){
    return Promise.reject({status:400,msg:"description must be provided"})
  }
  const queryString = format(`INSERT INTO topics (slug,description) VALUES (%L) RETURNING *;`,[slug,description]) 
  return db.query(queryString).then(({rows})=>{
     return rows[0]
  })
}
module.exports = { fetchAllTopics, checkTopicExists, insertTopic };
