import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import { app, server } from '../src/app.js';
import CartController from '../src/controllers/cartController.js';
import cartsModel from '../src/dao/models/cart.js';

const { expect } = chai; 
chai.use(chaiHttp);

describe('Cart API', () => {
  let cartController;
  let cartId;
  let productId = new mongoose.Types.ObjectId();

  before(async () => {
    cartController = new CartController();

    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

    const cart = new cartsModel({ products: [] });
    const savedCart = await cart.save();
    cartId = savedCart._id;
  });

  after(async () => {
    await cartsModel.deleteMany({});
    await mongoose.disconnect();
    server.close(); 
  });

  describe('GET /api/carts/:cartId', () => {
    it('debería obtener un carrito por ID', (done) => {
      chai.request(app)
        .get(`/api/carts/${cartId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('_id').eql(String(cartId));
          done();
        });
    });

    it('debería devolver un error si el carrito no existe', (done) => {
      chai.request(app)
        .get(`/api/carts/${new mongoose.Types.ObjectId()}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message').eql('Carrito no encontrado');
          done();
        });
    });
  });

  describe('POST /api/carts', () => {
    it('debería crear un nuevo carrito', (done) => {
      chai.request(app)
        .post('/api/carts')
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('_id');
          done();
        });
    });
  });

  describe('POST /api/carts/:cartId/product/:productId', () => {
    it('debería añadir un producto al carrito', (done) => {
      chai.request(app)
        .post(`/api/carts/${cartId}/product/${productId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.equal('Producto añadido al carrito correctamente');
          done();
        });
    });

    it('debería devolver un error si el carrito no existe', (done) => {
      chai.request(app)
        .post(`/api/carts/${new mongoose.Types.ObjectId()}/product/${productId}`)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property('message').eql('Error al añadir producto al carrito');
          done();
        });
    });
  });

  describe('DELETE /api/carts/:cartId/product/:productId', () => {
    it('debería eliminar un producto del carrito', (done) => {
      chai.request(app)
        .delete(`/api/carts/${cartId}/product/${productId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.equal('Producto eliminado del carrito correctamente');
          done();
        });
    });

    it('debería devolver un error si el carrito no existe', (done) => {
      chai.request(app)
        .delete(`/api/carts/${new mongoose.Types.ObjectId()}/product/${productId}`)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property('message').eql('Error al eliminar producto del carrito');
          done();
        });
    });
  });

  describe('POST /api/carts/:cartId/buy', () => {
    it('debería realizar una compra', (done) => {
      chai.request(app)
        .post(`/api/carts/${cartId}/buy`)
        .send({ userId: new mongoose.Types.ObjectId(), quantity: 1 })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('code');
          done();
        });
    });

    it('debería devolver un error si el carrito no existe', (done) => {
      chai.request(app)
        .post(`/api/carts/${new mongoose.Types.ObjectId()}/buy`)
        .send({ userId: new mongoose.Types.ObjectId(), quantity: 1 })
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property('message').eql('Error al realizar la compra');
          done();
        });
    });
  });
});
