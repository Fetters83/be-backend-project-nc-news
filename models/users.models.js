const db = require('../db/connection')
const format = require('pg-format');


function fetchAllUsers(){
    const queryString = format(`SELECT * FROM users;`)
    return db.query(queryString).then(({rows}) =>{
        return rows
    })
}

module.exports = {fetchAllUsers}