const db = require('../db/connection')

function fetchCommentsByArticleId(article_id){
    const queryString = `SELECT c.comment_id,c.votes,c.created_at,c.author,c.body,c.article_id 
    FROM comments AS c
    JOIN articles AS a
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

module.exports = {fetchCommentsByArticleId}