import cartsModel from "../models/cart.js";
import Product from "../models/product.js";

const cartRepositorie = {
    async getCartById(req, cartId) {
        try {
            return await cartsModel.findById(cartId).lean();
        } catch (error) {
            req.logger.error("Error al obtener el carrito:", error.message);
            throw error;
        }
    },

    async createCart(req) {
        try {
            const newCart = new cartsModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            req.logger.error("Error al crear el carrito:", error.message);
            throw error;
        }
    },

    async addProduct(req, cartId, productId) {
        try {
            let cart = await cartsModel.findById(cartId);
            if (!cart) {
                throw new Error("El carrito no existe.");
            }

            const product = await Product.findById(productId);
            if (!product) {
                throw new Error("El producto no existe.");
            }

            const existingProduct = cart.products.find(item => String(item.product) === String(productId));
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();
        } catch (error) {
            req.logger.error("Error al añadir producto al carrito:", error.message);
            throw error;
        }
    },

    async deleteProduct(req, cartId, productId) {
        try {
            let cart = await cartsModel.findById(cartId);
            if (!cart) {
                throw new Error("El carrito no existe.");
            }

            const index = cart.products.findIndex(item => String(item.product) === String(productId));
            if (index !== -1) {
                cart.products.splice(index, 1);
                await cart.save();
            } else {
                throw new Error("El producto no está en el carrito.");
            }
        } catch (error) {
            req.logger.error("Error al eliminar producto del carrito:", error.message);
            throw error;
        }
    }
};

export default cartRepositorie;
