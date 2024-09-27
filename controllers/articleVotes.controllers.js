const {
  fetchArticleVotesByUserId,
} = require("../models/articles_comments.models");

function getArticleVoteByUserId(req, res, next) {
  const { username } = req.body;
  const { article_id } = req.body;
  fetchArticleVotesByUserId(username, article_id).then((result) => {
    res.status(200).send({result:{ msg: result }});
  }).catch((err)=>{
    next(err)
  });
}

module.exports = { getArticleVoteByUserId };
