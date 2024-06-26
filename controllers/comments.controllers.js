const {fetchCommentsByArticleId,insertCommentByArticleId,deleteCommentById, updateCommentVoteByCommentId, checkCommentExists} = require('../models/comments.models')


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

function removeCommentById(req,res,next){
    const {comment_id} = req.params

    deleteCommentById(comment_id).then((result)=>{
       res.status(204).send({deletedComment:result})
    }).catch((err)=>{
           next(err)
    })

}

function postVoteByCommentId(req,res,next){
    const {comment_id} = req.params
    const {inc_votes} = req.body
   
    Promise.all([updateCommentVoteByCommentId(inc_votes,Number(comment_id)),checkCommentExists(comment_id)]).then((result)=>{
        res.status(201).send({updatedCommentVoteCount:result[0]})
    }).catch((err)=>{
       
        next(err)
    })
      
}

module.exports = {getCommentsByArticleId,postCommentByArticleId,removeCommentById,postVoteByCommentId}