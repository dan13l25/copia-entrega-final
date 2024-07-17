/*import { request } from 'supertest';
import { app } from '../src/app.js';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';

describe('User Controller', () => {
  describe('GET /login', () => {
    it('should render login view', async () => {
      const res = await request(app).get('/login');
      expect(res.status).to.equal(200);
      expect(res.text).to.contain('Login');
    });
  });

  describe('POST /login', () => {
    it('should login user successfully', async () => {
      const user = { email: 'user@example.com', password: 'password' };
      const res = await request(app).post('/login').send(user);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('access_token');
    });

    it('should return error if invalid credentials', async () => {
      const user = { email: 'invalid@example.com', password: 'password' };
      const res = await request(app).post('/login').send(user);
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('error');
    });
  });

  describe('GET /register', () => {
    it('should render register view', async () => {
      const res = await request(app).get('/register');
      expect(res.status).to.equal(200);
      expect(res.text).to.contain('Register');
    });
  });

  describe('POST /register', () => {
    it('should register user successfully', async () => {
      const user = { first_name: 'John', last_name: 'Doe', email: 'user@example.com', password: 'password' };
      const res = await request(app).post('/register').send(user);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('access_token');
    });

    it('should return error if user already exists', async () => {
      const user = { first_name: 'John', last_name: 'Doe', email: 'user@example.com', password: 'password' };
      const res = await request(app).post('/register').send(user);
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error');
    });
  });

  describe('GET /logout', () => {
    it('should logout user successfully', async () => {
      const token = jwt.sign({ _id: '1234567890' }, process.env.PRIVATE_KEY, { expiresIn: '5m' });
      const res = await request(app).get('/logout').set('Authorization', `Bearer ${token}`);
      expect(res.status).to.equal(200);
    });
  });

  describe('POST /restore', () => {
    it('should restore password successfully', async () => {
      const user = { email: 'user@example.com', password: 'newpassword' };
      const res = await request(app).post('/restore').send(user);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message');
    });
  });

  describe('POST /request-password-reset', () => {
    it('should send password reset email successfully', async () => {
      const user = { email: 'user@example.com' };
      const res = await request(app).post('/request-password-reset').send(user);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message');
    });
  });

  describe('GET /reset-password/:token', () => {
    it('should render reset password view', async () => {
      const token = 'reset-password-token';
      const res = await request(app).get(`/reset-password/${token}`);
      expect(res.status).to.equal(200);
      expect(res.text).to.contain('Reset Password');
    });
  });

  describe('POST /reset-password', () => {
    it('should reset password successfully', async () => {
      const token = 'reset-password-token';
      const user = { password: 'newpassword' };
      const res = await request(app).post('/reset-password').send(user).set('Authorization', `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message');
    });
  });
});
*/