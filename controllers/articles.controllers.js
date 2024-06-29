const {
  fetchArticleById,
  fetchAllArticles,
  updateVoteByArticleId,
  checkArticleExists,
  insertNewArticle,
} = require("../models/articles.models");
const { checkTopicExists } = require("../models/topics.models");
const { fetchUserByUserName } = require("../models/users.models");

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

function getAllArticles(req, res, next) {
  const { topic, sort_by, order } = req.query;

  if (!topic) {
    fetchAllArticles(topic, sort_by, order)
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch((err) => {
        next(err);
      });
  }
  Promise.all([
    fetchAllArticles(topic, sort_by, order),
    checkTopicExists(topic),
  ])
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

function postVoteByArticleId(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  Promise.all([
    updateVoteByArticleId(inc_votes, article_id),
    checkArticleExists(article_id),
  ])
    .then(([result]) => {
      res.status(200).send({ updatedArticleVoteCount: result });
    })
    .catch((err) => {
      next(err);
    });
}

function postNewArticle(req,res,next){
  const newArticle = req.body
  const {author} = req.body
  const {topic} = req.body


  Promise.all([insertNewArticle(newArticle),fetchUserByUserName(author),checkTopicExists(topic)]).then((newArticleId)=>{
    return fetchArticleById(newArticleId[0])
  }).then((result)=>{
    const newArticleResult = result[0]
    res.status(201).send({ArticlePosted:newArticleResult})
  }).catch((err)=>{
     next(err)
  })


}

module.exports = { getArticleById, getAllArticles, postVoteByArticleId,postNewArticle };
