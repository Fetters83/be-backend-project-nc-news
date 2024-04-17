const db = require('../db/connection')

function fetchArticleById(article_id){
     let queryString = "SELECT * FROM articles WHERE article_id=$1;"
    return db.query(queryString,[article_id]).then(({rows: articles})=>{

     if(articles.length === 0){
         return Promise.reject({status:404,msg:"article not found"})
     }else {
      return articles
     }
    })
}

function fetchAllArticles(){
    const queryString = `SELECT a.article_id,a.title,a.topic,a.author, CAST(a.created_at AS DATE),a.votes,a.article_img_url,CAST(COUNT(c.article_id)AS INT) AS "comment_count"
    FROM articles AS a 
    JOIN comments AS c
    ON a.article_id = c.article_id
    GROUP BY a.article_id,a.title,a.topic,a.author,a.created_at,a.votes,a.article_img_url
    ORDER BY a.created_at DESC;`
    return db.query(queryString).then(({rows})=>{
          if(rows.length === 0){
           return Promise.reject({status:404,msg:'invalid query'})
        } else {
            return rows
        }
   
    })
}

module.exports = {fetchArticleById,fetchAllArticles}