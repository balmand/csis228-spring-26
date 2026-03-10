const request = require('supertest');
const app = require('../app');

describe('GET /api/hello', () =>{
    it('should return Hello world', async () =>{
        const response = await request(app).get('/api/hello');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({message: "hello world"});
    });
});

test('POST /api/user', async() =>{
    const response = await request(app).post('/api/user');
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toEqual("John");
});