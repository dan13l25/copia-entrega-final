import cartService from "../dao/services/cartService.js";
import { errorTypes } from "../utils/errorTypes.js";
import { CustomError } from "../utils/customError.js"; 
import { devLogger as logger } from "../utils/loggers.js";

export default class CartController {
    constructor() {
        console.log("CartController funciona");
    }

    async getCartById(req, res, next) {
        const { cartId } = req.params;
        try {
            const cart = await cartService.getCartById(cartId);
            if (cart) {
                res.json(cart);
            } else {
                next(CustomError.createError({
                    name: "CartNotFoundError",
                    message: "Carrito no encontrado",
                    code: errorTypes.ERROR_NOT_FOUND,
                    description: `Cart with id ${cartId} not found`
                }));
            }
        } catch (error) {
            logger.error("Error al obtener el carrito:", error.message);
            next(CustomError.createError({
                name: "GetCartError",
                message: "Error al obtener el carrito",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    }

    async createCart(req, res, next) {
        try {
            const newCart = await cartService.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            logger.error("Error al crear el carrito:", error.message);
            next(CustomError.createError({
                name: "CreateCartError",
                message: "Error al crear el carrito",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    }

    async addProduct(req, res, next) {
        const { cartId, productId } = req.params;
        try {
            await cartService.addProduct(cartId, productId);
            res.send("Producto añadido al carrito correctamente");
        } catch (error) {
            logger.error("Error al añadir producto al carrito:", error.message);
            next(CustomError.createError({
                name: "AddProductError",
                message: "Error al añadir producto al carrito",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    }

    async deleteProduct(req, res, next) {
        const { cartId, productId } = req.params;
        try {
            await cartService.deleteProduct(cartId, productId);
            res.send("Producto eliminado del carrito correctamente");
        } catch (error) {
            logger.error("Error al eliminar producto del carrito:", error.message);
            next(CustomError.createError({
                name: "DeleteProductError",
                message: "Error al eliminar producto del carrito",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    }

    async buyCart(req, res, next) {
        const { cartId } = req.params;
        const cartData = req.body;
        try {
            const ticket = await cartService.buyCart(cartId, cartData);
            res.json(ticket);
        } catch (error) {
            logger.error("Error al realizar la compra:", error.message);
            next(CustomError.createError({
                name: "BuyCartError",
                message: "Error al realizar la compra",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    }

    async getBuyCart(req, res, next) {
        const { cartId } = req.params;
        const userId = req.session.userId;
        const user = req.session.user;
        const isAuthenticated = req.session.isAuthenticated;
        const jwtToken = req.session.token;

        try {
            const cart = await cartService.getCartById(cartId, userId);
            const purchaseCartView = await cartService.getPurchaseCart();
            res.render(purchaseCartView, { user, isAuthenticated, jwtToken, cart });
        } catch (error) {
            logger.error("Error al obtener el carrito de compra:", error.message);
            next(CustomError.createError({
                name: "GetBuyCartError",
                message: "Error al obtener el carrito de compra",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    }
}
