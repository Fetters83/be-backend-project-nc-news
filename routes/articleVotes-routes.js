const { getArticleVoteByUserId } = require('../controllers/articleVotes.controllers');

const articleVotesRouter = require('express').Router()

//Get result of checking the article votes table
//Determines if a user has aleady voted against a specific article_id

articleVotesRouter.get('/',getArticleVoteByUserId)


module.exports = articleVotesRouter;