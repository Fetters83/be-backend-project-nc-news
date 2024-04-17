const {fetchArticleById,fetchAllArticles} = require('../models/articles.models')

function getArticleById(req,res,next){
    const {article_id} = req.params
        fetchArticleById(article_id).then((articles)=>{
        res.status(200).send({articles})
    }).catch((err)=>{
        next(err)
    })

}

function getAllArticles(req,res,next){
       fetchAllArticles().then((articles)=>{
        res.status(200).send({articles})
    }).catch((err)=>{
       next(err)
    })

}

module.exports = {getArticleById,getAllArticles}
