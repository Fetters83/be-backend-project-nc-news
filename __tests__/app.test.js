const request = require('supertest')
const db  = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const express = require('express')
const app = require('../app')

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