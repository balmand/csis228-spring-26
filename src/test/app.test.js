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

describe('Authentication', () => {
    beforeEach(() => {
        process.env.AUTH_USERNAME = 'admin';
        process.env.AUTH_PASSWORD = 'password123';
        process.env.AUTH_SECRET = 'test-secret';
        process.env.AUTH_TOKEN_TTL_SECONDS = '3600';
    });

    it('returns a token for valid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: 'password123' });

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeTruthy();
    });

    it('rejects invalid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: 'wrong-password' });

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ error: 'Invalid credentials' });
    });

    it('blocks protected routes without a token', async () => {
        const response = await request(app).get('/api/v2/clients/test');

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ error: 'Authentication required' });
    });

    it('allows protected routes with a valid token', async () => {
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: 'password123' });

        const response = await request(app)
            .get('/api/v2/clients/test')
            .set('Authorization', `Bearer ${loginResponse.body.token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual('Hello from test');
    });
});
