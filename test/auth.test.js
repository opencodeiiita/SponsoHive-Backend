const request = require('supertest');
const app = require('../server');
const User = require('../models/User'); 
const mongoose = require('mongoose');

describe('Authentication Routes', () => {
  it('should sign up a new user successfully', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  it('should log in an existing user', async () => {
    await User.create({ name: 'Test User', email: 'test@example.com', password: 'password123' });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
