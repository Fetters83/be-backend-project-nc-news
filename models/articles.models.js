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

module.exports = {fetchArticleById}