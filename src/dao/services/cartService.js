import cartRepositorie from "../repositories/cartRepositorie.js";
import productRepositorie from "../repositories/productRepositorie.js"; 
import { generateRandomCode } from "../../middlewares/auth.js";
import CartDTO from "../DTO/CartDTO.js";
import ticketRepositorie from "../repositories/ticketRepositorie.js";
import TicketDTO from "../DTO/TicketDTO.js";

const cartService = {
    async getCartById(cartId) {
        return await cartRepositorie.getCartById(cartId);
    },

    async createCart() {
        return await cartRepositorie.createCart();
    },

    async addProduct(cartId, productId) {
        const product = await productRepositorie.getProductById(productId); 
        if (!product) {
            throw new Error(`Producto con ID ${productId} no encontrado`);
        }

        if (product.stock < 1) {
            throw new Error("Producto fuera de stock");
        }

        const updatedCart = await cartRepositorie.addProduct(cartId, productId);
        return updatedCart;
    },

    async deleteProduct(cartId, productId) {
        return await cartRepositorie.deleteProduct(cartId, productId);
    },

    async buyCart(cartId, cartData) {
        const { userId, quantity } = cartData;

        try {
            const cart = await this.getCartById(cartId);

            let totalPurchaseAmount = 0;
            const productsToPurchase = [];
            const productsToKeepInCart = [];

            for (const item of cart.products) {
                const product = await productRepositorie.getProductById(item.product);

                if (!product) {
                    throw new Error(`Producto con ID ${item.product} no encontrado`);
                }

                if (product.stock >= item.productQuantity) {
                    product.stock -= item.productQuantity;
                    await product.save();

                    totalPurchaseAmount += item.productTotal;
                    productsToPurchase.push(item);
                } else {
                    productsToKeepInCart.push(item);
                }
            }

            if (productsToPurchase.length === 0) {
                throw new Error("No hay productos suficientes en stock para realizar la compra");
            }

            const cartDTO = new CartDTO(productsToPurchase, quantity, userId);

            const ticketDTO = new TicketDTO({
                code: generateRandomCode(10),
                purchase_datetime: new Date(),
                amount: totalPurchaseAmount,
                purchaser: userId,
                products: productsToPurchase.map(item => ({
                    product: item.product,
                    productQuantity: item.productQuantity,
                    productTotal: item.productTotal,
                })),
            });

            const ticket = await ticketRepositorie.createTicket(ticketDTO);

            cart.products = productsToKeepInCart;
            await cart.save();

            return ticket;
        } catch (error) {
            throw new Error("Error al realizar la compra: " + error.message);
        }
    },

    async getPurchaseCart() {
        return "purchase";
    }
};

export default cartService;
