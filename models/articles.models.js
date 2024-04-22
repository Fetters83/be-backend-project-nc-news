const db = require('../db/connection')
const format = require('pg-format')

function fetchArticleById(article_id){
     let queryString = `SELECT a.* , CAST(COUNT(c.article_id) AS INT) AS "comment_count" 
     FROM articles AS a
     LEFT JOIN comments AS c
     ON a.article_id = c.article_id
     WHERE a.article_id=$1
     GROUP BY a.article_id;`
    return db.query(queryString,[article_id]).then(({rows: articles})=>{

     if(articles.length === 0){
         return Promise.reject({status:404,msg:"article not found"})
     }else {
      return articles
     }
    })
}

function fetchAllArticles(topic){
   

   let queryString = `SELECT a.article_id,a.title,a.topic,a.author, CAST(a.created_at AS DATE),a.votes,a.article_img_url,CAST(COUNT(c.article_id)AS INT) AS "comment_count"
    FROM articles AS a 
    LEFT JOIN comments AS c
    ON a.article_id = c.article_id`

     if(topic){
        queryString += ` WHERE topic='${topic}' `
    }

    queryString += ` GROUP BY a.article_id,a.title,a.topic,a.author,a.created_at,a.votes,a.article_img_url 
    ORDER BY a.created_at DESC;`

        
    return db.query(queryString).then(({rows})=>{
       return rows
    })
}

function checkArticleExists(article_id){
    const articleIdRegex = /^\d*$/
    if(articleIdRegex.test(article_id) === false){
        return Promise.reject({status:400,msg:'Bad request'})
    }
   
    const getVotesQuery = ('SELECT * FROM articles WHERE article_id=$1;')
    return db.query(getVotesQuery,[article_id]).then(({rows:articles})=>{
       
        if(articles.length === 0){
        return Promise.reject({status:404,msg:'article does not exist'})
       }

        
    })
}

 function updateVoteByArticleId(inc_votes,article_id){
  
    const updateVoteQuery = ('UPDATE articles SET votes=votes + $1 WHERE article_id=$2 RETURNING *;')

    if(typeof inc_votes != 'number'){
        return Promise.reject({status:400,msg:'vote increment must be a number'})
    }
   
    return db.query(updateVoteQuery,[inc_votes,article_id]).then(({rows})=>{
            return rows[0]
    })
} 


module.exports = {fetchArticleById,fetchAllArticles,updateVoteByArticleId,checkArticleExists}