const request = require('supertest')
const db  = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const express = require('express')
const app = require('../app')
const endpointsFile = require('../endpoints.json')

beforeAll(()=>seed(data))
afterAll(()=>db.end())

describe('api/topics',()=>{
    test('GET:200 should return an array of topic objects with the properties slug and description',()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body:{topics}})=>{
            expect(topics.length).toBe(3)
            topics.forEach((topic)=>{
                expect(topic).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                )
            })
        })

    })
    test('GET:404 incorrect endpoint should return an object with a key of msg and value of Bad request',()=>{
        return request(app)
        .get('/api/invalid_endpoint')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('endpoint not found')
         
        })

    })
})

describe('/api',()=>{
    test('GET:200 responds with an object detailing all available endpoints in the app',()=>{
        return request(app)
        .get('/api')
        .expect(200)
         .then(({body:{endpoints}})=>{
          expect(endpoints).toMatchObject(endpointsFile)
          for(let endpoint in endpoints){
            if(endpoint!="GET /api"){
                  expect(endpoints[endpoint]).toEqual(
                    expect.objectContaining({
                        description: expect.any(String),
                        queries: expect.any(Array),
                        exampleResponse: expect.any(Object)
                    }))
                }
            }
        })
    })
})

describe('api/articles/:article_id',()=>{
    test('GET:200 responds with an object asscoiated with the article id',()=>{
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body:{articles}})=>{
                articles.forEach((article)=>{
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic:expect.any(String),
                        author:expect.any(String),
                        body:expect.any(String),
                        created_at:expect.any(String),
                        votes:expect.any(Number),
                        article_img_url:expect.any(String)
                    })
                )
            })
            expect(articles).toHaveLength(1)
         })
    })
    test('GET:404 when article_id is of a valid data type, but does not exist,obj returned with a error message of article not found',()=>{
        return request(app)
        .get('/api/articles/9999')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("article not found")
        })
    })
    test('GET:400 when artist_id is of an invalid data type, object returned with err msg of Bad request',()=>{
        return request(app)
        .get('/api/articles/invalid_id')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad request")
        })
    })
})
describe('/api/articles',()=>{
    test('GET:200 should return an array of article objects with the correct properties',()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body:{articles}})=>{
            expect(articles).toHaveLength(13)
            articles.forEach((article)=>{
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic:expect.any(String),
                        author:expect.any(String),
                        created_at:expect.any(String),
                        votes:expect.any(Number),
                        article_img_url:expect.any(String),
                        comment_count: expect.any(Number)
                    })
                )
            })
            expect(articles).toBeSortedBy('created_at',{
                descending:true,})
        })
    })
})
describe('/api/articles/:article_id/comments',()=>{
    test('GET:200 should return an array of comments linked',()=>{
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body:{comments}})=>{
            expect(comments).toHaveLength(11)
            comments.forEach((comment)=>{
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id:expect.any(Number),
                        votes:expect.any(Number),
                        created_at:expect.any(String),
                        author:expect.any(String),
                        body:expect.any(String),
                        article_id:expect.any(Number)
                    })
                )
            })
            expect(comments).toBeSortedBy('created_at',{
                descending:true,})
        })
    })
    test('GET: 404 when passed article_id is of a valid type but no comments are found',()=>{
        return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('no comments found')
        })
    })
    test('GET: 400 when passed article_id of invalid type object returned with an err message of Bad request',()=>{
        return request(app)
        .get('/api/articles/invalid_id/comments')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad request')
        })
    })

})
describe('/api/articles/:article_id/comments',()=>{
    test('POST:201 when passed an object with a username and body, body text is posted in the comments table to the specified article_id',()=>{
        const newComment = {username:"rogersop",body:"my first comment"};
        return request(app)
        .post('/api/articles/1/comments')
        .expect(201)
        .send(newComment)
        .then(({body})=>{
            expect(body).toEqual({comment:{body:"my first comment"}})
            
            
        })
    })
    test('POST:404 when an article_id of the correct type but non existent is passed, an object is returned with a 404 status and error message',()=>{
        const newComment = {username:"rogersop",body:"my first comment"};
        return request(app)
        .post('/api/articles/9999/comments')
        .expect(404)
        .send(newComment)
        .then(({body})=>{
            expect(body.msg).toBe("this article does not exist")
            
            
        })
    
    })
    test('POST:404 when a username of the correct type is passed but does not exist in the user table, an object is returned with a 404 status and error message',()=>{
        const newComment = {username:"invalidname",body:"my first comment"};
        return request(app)
        .post('/api/articles/1/comments')
        .expect(404)
        .send(newComment)
        .then(({body})=>{
            expect(body.msg).toBe("you are not yet a valid user")
            
            
        })
    
    })
    test('POST:400 when a username of an incorrect type is passed, an object is returned with a 400 status and error message',()=>{
        const newComment = {username:1,body:"my first comment"};
        return request(app)
        .post('/api/articles/1/comments')
        .expect(400)
        .send(newComment)
        .then(({body})=>{
            expect(body.msg).toBe("Bad request")
            
            
        })
    
    })
    test('POST:400 when a comment of an incorrect data type is passed, an object is returned with a 404 status and error message',()=>{
        const newComment = {username:"rogersop",body:1};
        return request(app)
        .post('/api/articles/1/comments')
        .expect(400)
        .send(newComment)
        .then(({body})=>{
            expect(body.msg).toBe("Bad request")
            
            
        })
    
    })
    test('POST:400 when an article_id of an incorrect data type is passed, an object is returned with a 404 status and error message',()=>{
        const newComment = {username:"rogersop",body:1};
        return request(app)
        .post('/api/articles/invalid_id/comments')
        .expect(400)
        .send(newComment)
        .then(({body})=>{
            expect(body.msg).toBe("Bad request")
            
            
        })
    
    })
})
describe('/api/articles/:article_id',()=>{
    test('PATCH:200 when request body pass in with a inc_votes value of 1, articles_id total vote count should increase by 1',()=>{
        const vote = {inc_votes: 1}
        const expectedObject = {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 101,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        }
        return request(app)
        .patch('/api/articles/1')
        .expect(200)
        .send(vote)
        .then(({body:{updatedArticleVoteCount}})=>{
           expect(updatedArticleVoteCount).toMatchObject(expectedObject)
          
         })
    })
    test('Patch:400 when passed an object with an incorrect data inc_vote data type, an object is returned with a status of 400 and an err message',()=>{
        const vote = {inc_votes: 'invalid_vote'}
        return request(app)
        .patch('/api/articles/1')
        .expect(400)
        .send(vote)
        .then(({body})=>{
            expect(body.msg).toBe('vote increment must be a number')
        })
    })
    test('Patch:404 when passed a non existent article_id of the correct data type, an object is returned with a status of 404 and an err message',()=>{
        const vote = {inc_votes: 1}
        return request(app)
        .patch('/api/articles/9999')
        .expect(404)
        .send(vote)
        .then(({body})=>{
            expect(body.msg).toBe('article does not exist')
        })
    })
    test('Patch:400 when passed an article_id of an incorrect data type, an object is returned with a status of 400 and an err message',()=>{
        const vote = {inc_votes: 1}
        return request(app)
        .patch('/api/articles/invalid_id')
        .expect(400)
        .send(vote)
        .then(({body})=>{
            expect(body.msg).toBe('Bad request')
        })
    })
})
describe('/api/comments/:comment_id',()=>{
    test('DELETE:204 when passed a valid comment_id, an object with the status 204 is returned',()=>{
                           
        db.query(`SELECT COUNT(comment_id) FROM comments;`).then(({rows})=>{
            expect(rows[0].count).toBe("19")
        })
    
        return request(app)
        .delete('/api/comments/19')
        .expect(204).then(()=>{
            db.query(`SELECT COUNT(comment_id) FROM comments;`).then(({rows})=>{
                expect(rows[0].count).toBe("18")
            })
        })

        })
    test('DELETE:404 when passed a non existent valid comment_id, an object with the status 404 and error message is returned',()=>{
        return request(app)
        .delete('/api/comments/20')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('comment does not exist')
            })
        })
    test('DELETE:400 when passed a comment_id of an incorrect data type, an object with the status 400 and error message is returned',()=>{
        return request(app)
        .delete('/api/comments/invalid_id')
        .expect(400)
        .then(({body})=>{
         expect(body.msg).toBe('Bad request')
                })
            })          
    })

    describe('/api/user',()=>{
        test('GET:200 should respond with an array of objects of all users and the correct properties',()=>{
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({body:{users}})=>{
                expect(users).toHaveLength(4)
                users.forEach((user)=>{
                    expect(user).toEqual(
                        expect.objectContaining({
                            username: expect.any(String),
                            name:expect.any(String),
                            avatar_url:expect.any(String)
                        })
                    )
            
                })
            })
        })
    })
describe('/api/articles/?topic',()=>{
    test('GET:200 responds with an array of article objects associated with the topic query',()=>{
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({body:{articles}})=>{
            expect(articles).toHaveLength(1)
            expect(articles[0].article_id).toBe(5)
            expect(articles[0].title).toBe('UNCOVERED: catspiracy to bring down democracy')
            expect(articles[0].topic).toBe('cats')
            expect(articles[0].author).toBe('rogersop')
            expect(articles[0].created_at).toBe('2020-08-02T23:00:00.000Z')
            expect(articles[0].votes).toBe(0)
            expect(articles[0].article_img_url).toBe ('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')

        })
    })
    test('GET:404 when an non existent topic is passed as a query a status of 404 is returned with an error message',()=>{
        return request(app)
        .get('/api/articles/?topic=invalid_topic')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('topic not found')
        })
    })
}
)
describe('/api/articles/:article_id',()=>{
    test('GET:200 call to articles/:article_id endpoint should now return a comment count in its response object',()=>{
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body:{articles}})=>{
            expect(articles[0].comment_count).toBe(11)
            expect(articles[0].article_id).toBe(1)
            expect(articles[0].title).toBe('Living in the shadow of a great man')
            expect(articles[0].topic).toBe('mitch')
            expect(articles[0].author).toBe('butter_bridge')
            expect(articles[0].body).toBe('I find this existence challenging')
            expect(articles[0].created_at).toBe('2020-07-09T20:11:00.000Z')
            expect(articles[0].votes).toBe(101)
            expect(articles[0].article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
        })
    })
})
describe('/api/articles?topic=topic&sort_by=sort_by&order=order',()=>{
    test('GET 200: Accepts a sort query and responds with articles ordered by the column name',()=>{
        return request(app)
        .get('/api/articles?topic=mitch&sort_by=article_id&order=ASC')
        .expect(200)
        .then(({body:{articles}})=>{
          expect(articles).toBeSortedBy('article_id')
        })
    })
    test('GET 400: when invalid sort_by is called a 400 bad request is returned with err msg ',()=>{
        return request(app)
        .get('/api/articles?topic=mitch&sort_by=INVALID_SORTBY&order=ASC')
        .expect(400)
        .then(({body})=>{      
            expect(body.msg).toBe('invalid sort query')
        })
    })
    test('GET 400: when invalid order is called a 400 bad request is returned with err msg',()=>{
        return request(app)
        .get('/api/articles?topic=mitch&sort_by=votes&order=INVALID')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('invalid order query')
        })
    })
 
})
describe('/api/articles?sort_by=sort_by',()=>{
    test('GET 200: Accepts a single sort query and responds with articles ordered by the column name in descending order',()=>{
        return request(app)
        .get('/api/articles?sort_by=article_id')
        .expect(200)
        .then(({body:{articles}})=>{
          expect(articles).toBeSortedBy('article_id',{descending:true})
        })
    })

 
})
 describe('/',()=>{
    test('GET 200: Base URL returns a message to navigate to /api for further enpoint infotmation',()=>{
        return request(app)
        .get('/')
        .expect(200)
        .then((response)=>{
            expect(response.text).toBe('Welcome to NC News - please navigate to https://be-backend-project-nc-news.onrender.com/api to see list of end points')
        })
    })
}) 
describe('/api/users/:username', ()=>{
    test('GET 200: returns an object of the user by the given username',()=>{
        return request(app)
        .get('/api/users/icellusedkars')
        .expect(200)
        .then(({body})=>{
                expect(body).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        name:expect.any(String),
                        avatar_url:expect.any(String)
                    })
                )
        
            })
        })
        test('GET 404: when passed a non existent username, server responds with status 404 and an error message', ()=>{
            return request(app)
            .get('/api/users/notauser')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe('user not found')
            })
        })
    })
