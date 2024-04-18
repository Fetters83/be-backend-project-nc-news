# Northcoders News API

Before using this repo, please follow the below instructions:

1. Add the below files to the root of this project
 .env-test
 .env-production
2. In the .env.test file add the below line:
PGDATABASE=nc_news_test
3. In the .env.development file add the below line:
PGDATABASE=nc_news

**You must have Postgres SQL installed on your machine locally! vist https://www.postgresql.org/**

Packages to Install 

4. express - terminal command: npm install express
5. jest - terminal command: npm install jest
6. dotenv - terminal command: npm install dotenv --save
7. pg-format - npm install pg-format
8. supertest - npm install supertest --save-dev
9. jest-sorted - npm install --save-dev jest-sorted

Using Endpoints

1. Download Insomnia or your prefered web API testing platform (https://insomnia.rest/, https://www.postman.com/)
2. In the file app.listen, the function currently uses port 9090, you can change it to a desired port if you choose to do so e.g. app.listen(<port>,()=>{
    console.log('listening on <port>)
})
3. In the terminal, type the command 'node listen.js' - a log in your console should indicate that the your port is listening for requests e.g listening on port 9090
4. In your web API testing software you can make a call to the below endpoints

localhost:9090/api
 - lists all available endpoints in response
localhost:9090/api/topics
 - list all topics in the database
localhost:9090/api/articles
 - lists all articles and their comment count from the database
localhost:9090/api/articles/:article_id
 - lists all articles by the given article_id (replace article_id with a number)
localhost:9090/api/articles/:article_id/comments
 - lists all comments asscoiate with a given article_id (replace article_id with a number)


