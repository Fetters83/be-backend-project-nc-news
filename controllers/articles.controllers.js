const { articleData } = require("../db/data/test-data");
const {
  fetchArticleById,
  fetchAllArticles,
  updateVoteByArticleId,
  checkArticleExists,
  insertNewArticle,
  deleteArticleByArticleId,
} = require("../models/articles.models");
const {
  fetchArticleVotesByUserId,
  fetchArticleVoteValid,
  insertOrDeleteArticleVote,
} = require("../models/articles_comments.models");
const { deleteCommentsByArticleId } = require("../models/comments.models");
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
  const { topic, sort_by, order, limit, p } = req.query;

  if (!topic) {
    fetchAllArticles(topic, sort_by, order, limit, p)
      .then((articles) => {
        if (limit || p) {
          const total_count = Number(articles[0].full_count);

          for (article of articles) {
            delete article.full_count;
          }

          res
            .status(200)
            .send({ total_count: total_count, articles: articles });
        } else {
          res.status(200).send({ articles });
        }
      })
      .catch((err) => {
        next(err);
      });
  } else {
    Promise.all([
      fetchAllArticles(topic, sort_by, order, limit, p),
      checkTopicExists(topic),
    ])
      .then(([articles]) => {
        if (limit || p) {
          const total_count = Number(articles[0].full_count);
          for (article of articles) {
            delete article.full_count;
          }
          res
            .status(200)
            .send({ total_count: total_count, articles: articles });
        }
        res.status(200).send({ articles });
      })
      .catch((err) => {
        next(err);
      });
  }
}

function postVoteByArticleId(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const { username } = req.body;

  fetchArticleVotesByUserId(username, article_id)
    .then((result) => {
      return result;
    })
    .then((result) => {
      return fetchArticleVoteValid(inc_votes, result);
    })
    .then(() => {
      return Promise.all([
        updateVoteByArticleId(inc_votes, article_id),
        checkArticleExists(article_id),
        insertOrDeleteArticleVote(username, article_id, inc_votes),
      ]);
    })
    .then(([result]) => {
      res.status(200).send({ updatedArticleVoteCount: result });
    })
    .catch((err) => {
      next(err);
    });
}

function postNewArticle(req, res, next) {
  const newArticle = req.body;
  const { author } = req.body;
  const { topic } = req.body;

  Promise.all([
    insertNewArticle(newArticle),
    fetchUserByUserName(author),
    checkTopicExists(topic),
  ])
    .then((newArticleId) => {
      return fetchArticleById(newArticleId[0]);
    })
    .then((result) => {
      const newArticleResult = result[0];
      res.status(201).send({ ArticlePosted: newArticleResult });
    })
    .catch((err) => {
      next(err);
    });
}

function removeArticleByArticleId(req, res, next) {
  const { article_id } = req.params;

  checkArticleExists(article_id)
    .then(() => {
      return deleteCommentsByArticleId(article_id);
    })
    .then(() => {
      return deleteArticleByArticleId(article_id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getArticleById,
  getAllArticles,
  postVoteByArticleId,
  postNewArticle,
  removeArticleByArticleId,
};
