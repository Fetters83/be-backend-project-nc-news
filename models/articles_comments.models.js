const db = require("../db/connection");
const format = require("pg-format");

function fetchArticleVotesByUserId(username, article_id) {
  return db
    .query(`SELECT * FROM article_votes WHERE username=$1 AND article_id=$2;`, [
      username,
      article_id,
    ])
    .then(({ rows }) => {
      if (rows.length >= 1) {
        return true;
      } else {
        return false;
      }
    });
}

function fetchArticleVoteValid(inc_votes, result) {
  if (result === true && inc_votes === 1) {
    return Promise.reject({
      status: 200,
      msg: "you cannot vote again on this article",
    });
  }
  if (result === false && inc_votes === -1) {
    return Promise.reject({
      status: 200,
      msg: "you cannot remove vote on this article as there is no existing vote",
    });
  }

  return true;
}

function insertOrDeleteArticleVote(username, article_id, inc_votes) {
  article_id = Number(article_id);
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 404,
      msg: "article_id must be of type integer",
    });
  }
  const valuesArray = [];
  valuesArray.push(username, article_id);

  const insertArticleVoteQuery = format(
    `INSERT INTO article_votes (username,article_id) VALUES (%L) RETURNING *;`,
    valuesArray
  );
  const deleteArticleVoteQuery = `DELETE FROM article_votes WHERE username=$1 AND article_id=$2;`;

  if (inc_votes === 1) {
    return db.query(insertArticleVoteQuery).then(() => {
      return "success";
    });
  }

  if (inc_votes === -1) {
    return db.query(deleteArticleVoteQuery, [username, article_id]).then(() => {
      return "success";
    });
  }
}

module.exports = {
  fetchArticleVotesByUserId,
  fetchArticleVoteValid,
  insertOrDeleteArticleVote,
};
