import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import Product from '../src/dao/models/product.js';
import { MONGO_URL } from '../src/utils.js';

const requester = supertest('http://localhost:8080');

describe('Product Controller', () => {
  before(async () => {
    await mongoose.connect(MONGO_URL);
  });

  after(async () => {
    await mongoose.disconnect();
  });

  let productId;

  describe('GET /api/products', () => {
    it('should return a list of products', async () => {
      const res = await requester.get('/api/products');
      expect(res.status).to.equal(200);
      expect(res.body.docs).to.be.an('array');
    });
  });

  describe('GET /api/products/:pid', () => {
    it('should return a product by id', async () => {
      const product = await Product.create({
        title: 'Test Product',
        description: 'Test Description',
        code: '123',
        category: 'Test Category',
        brand: 'Test Brand',
        price: 10,
        stock: 100,
        status: true,
        thumbnails: ['image.jpg'],
        owner: new mongoose.Types.ObjectId() // Proporcionar un ObjectId válido
      });
      productId = product._id;
      const res = await requester.get(`/api/products/${product._id}`);
      expect(res.status).to.equal(200, `Expected status 200 but got ${res.status}`);
      expect(res.body).to.have.property('title', 'Test Product');
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const res = await requester.post('/api/products')
        .send({
          title: 'New Product',
          description: 'New Description',
          code: '456',
          category: 'New Category',
          brand: 'New Brand',
          price: 20,
          stock: 50,
          status: true,
          thumbnails: ['image.jpg'],
          owner: new mongoose.Types.ObjectId() // Proporcionar un ObjectId válido
        });
      expect(res.status).to.equal(201, `Expected status 201 but got ${res.status}`);
      expect(res.body).to.have.property('title', 'New Product');
      productId = res.body._id;
    });
  });

  describe('PUT /api/products/:pid', () => {
    it('should update a product', async () => {
      const res = await requester.put(`/api/products/${productId}`)
        .send({ title: 'Updated Product', price: 15 });
      expect(res.status).to.equal(200, `Expected status 200 but got ${res.status}`);
      expect(res.body).to.have.property('title', 'Updated Product');
    });
  });

  describe('DELETE /api/products/:pid', () => {
    it('should delete a product', async () => {
      const res = await requester.delete(`/api/products/${productId}`);
      expect(res.status).to.equal(204, `Expected status 204 but got ${res.status}`);
    });
  });
});
