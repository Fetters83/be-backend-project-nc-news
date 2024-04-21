const {fetchArticleById,fetchAllArticles,getVoteCountByArticleId,updateVoteByArticleId} = require('../models/articles.models')
const { checkTopicExists } = require('../models/topics.models')
const { postCommentByArticleId } = require('./comments.controllers')

function getArticleById(req,res,next){
    const {article_id} = req.params
        fetchArticleById(article_id).then((articles)=>{
        res.status(200).send({articles})
    }).catch((err)=>{
        next(err)
    })

}

function getAllArticles(req,res,next){
      const {topic} = req.query
       if(topic){
            Promise.all([fetchAllArticles(topic),checkTopicExists(topic)]).then(([articles])=>{
            res.status(200).send({articles})
         }).catch((err)=>{
            next(err)
         })
    } else {
       
        fetchAllArticles().then((articles)=>{
            res.status(200).send({articles})
         }).catch((err)=>{
            next(err)
         })
    }
    
      



}


function postVoteByArticleId(req,res,next) {
    const {article_id} = req.params
    const {inc_votes} = req.body

    getVoteCountByArticleId(article_id).then(({votes})=>{
        const updateVotes = votes + inc_votes;
       
        updateVoteByArticleId(updateVotes,article_id).then((result)=> {
            res.status(200).send({updatedArticleVoteCount:result})
        }).catch((err)=>{
            
            next(err)
        })
    }).catch((err)=>{
        next(err)
    })
    
}

module.exports = {getArticleById,getAllArticles,postVoteByArticleId}
