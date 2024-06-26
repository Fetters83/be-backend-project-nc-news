const { json } = require('express');
const db = require('../db/connection')
const format = require('pg-format');

function fetchCommentsByArticleId(article_id){
    const queryString = `SELECT c.comment_id,c.votes,c.created_at,c.author,c.body,c.article_id 
    FROM comments AS c
    LEFT JOIN articles AS a
    ON c.article_id = a.article_id
    WHERE a.article_id=$1
    ORDER BY c.created_at DESC;`
    return db.query(queryString,[article_id]).then(({rows})=>{
         if(rows.length === 0){
            return Promise.reject({status:404,msg:'no comments found'})
        } 
        return rows
    })
}

function insertCommentByArticleId(article_id,{username,body}){
    article_id = Number(article_id)
    const valuesArray = []
    valuesArray.push(body,article_id,username)

    const insertCommentStr = format(`INSERT INTO comments (body, article_id,author)
    VALUES (%L)
    RETURNING body;`,valuesArray)

    if(typeof username != 'string' || typeof body != 'string'){
        return Promise.reject({status:400,msg:'Bad request'})
    }
   
    return db.query(insertCommentStr).then(({rows})=>{
        return rows[0]
    })
}

function deleteCommentById(comment_id){

    const deleteCommentStr = `DELETE FROM comments WHERE comment_id=$1 RETURNING *;`
    return db.query(deleteCommentStr,[comment_id]).then(({rows})=>{
       
        if(rows.length === 0){
           return Promise.reject({status:404,msg:'comment does not exist'})
        } 
          return rows[0]
    })

}

function updateCommentVoteByCommentId(inc_votes,comment_id){
    const incVoteStr = `UPDATE comments SET votes=votes + $1 WHERE comment_id = $2 RETURNING body,votes;`
    if(!typeof inc_votes  === 'number'){
        return Promise.reject({status:400,msg:'Bad request'})
    }
    return db.query(incVoteStr,[inc_votes,comment_id]).then((/* {rows} */{rows})=>{
        //console.log(rows[0])
        return rows[0]
    })
}

function checkCommentExists(comment_id){
    const getCommentQuery = `SELECT comment_id FROM comments WHERE comment_id = $1;`
    return db.query(getCommentQuery,[comment_id]).then(({rows})=>{
          if(rows.length === 0) {
           return Promise.reject({status:404,msg:'comment not found'})
        }
        Promise.resolve(true)
       
    })

}

module.exports = {fetchCommentsByArticleId,insertCommentByArticleId,deleteCommentById,updateCommentVoteByCommentId,checkCommentExists}