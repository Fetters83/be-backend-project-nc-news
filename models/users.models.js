const db = require('../db/connection')
const format = require('pg-format');


function fetchAllUsers(){
    const queryString = format(`SELECT * FROM users;`)
    return db.query(queryString).then(({rows}) =>{
        return rows
    })
}

function fetchUserByUserName(username){
    const queryString = (`SELECT * FROM users WHERE username=$1`)
    return db.query(queryString,[username]).then(({rows}) =>{
        if(rows.length === 0) {
            return Promise.reject({status:404,msg:'user not found'})
        }
        return rows[0]
    })
}
module.exports = {fetchAllUsers,fetchUserByUserName}