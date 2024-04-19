const request = require('supertest')
const db  = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const express = require('express')
const app = require('../app')
const endpoints = require('../endpoints.json')

beforeAll(()=>seed(data))
afterAll(()=>db.end())

describe('api/topics',()=>{
    test('GET:200 should return an array of topic objects with the properties slug and description',()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body})=>{
            expect(body.length).toBe(3)
            body.forEach((row)=>{
                expect(row).toEqual(
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
    test('GET:404 when artist_id is of a valid data type, but does not exist,obj returned with a error message of article not found',()=>{
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
describe('/api/article',()=>{
    test('GET:200 should return an array of article objects with the correct properties',()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body:{articles}})=>{
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
            expect(typeof body.comment.body).toBe("string")
            
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
    test('POST:400 when a username of an incorrect type is passed, an object is returned with a 404 status and error message',()=>{
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
})