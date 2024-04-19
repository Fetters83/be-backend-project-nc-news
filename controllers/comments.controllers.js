const {fetchCommentsByArticleId,insertCommentByArticleId} = require('../models/comments.models')

function getCommentsByArticleId(req,res,next){
    const {article_id} = req.params
    fetchCommentsByArticleId(article_id).then((comments)=>{
       res.status(200).send({comments})
    }).catch((err)=>{
        next(err)
    })
}

function postCommentByArticleId(req,res,next){
    const{article_id} = req.params
    const commentBody = req.body
    insertCommentByArticleId(article_id,commentBody).then((comment)=>{
       res.status(201).send({comment})
     }).catch((err)=>{
        next(err)
     })
}

module.exports = {getCommentsByArticleId,postCommentByArticleId}