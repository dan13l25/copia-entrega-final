import productRepositorie from "../repositories/productRepositorie.js";
import { devLogger as logger } from "../../utils/loggers.js";

const productService = {
    addProduct: async (title, description, price, thumbnails, code, stock, status, category, brand) => {
        try {
            await productRepositorie.addProduct(title, description, price, thumbnails, code, stock, status, category, brand);
        } catch (error) {
            logger.error("Error al añadir el producto:", error.message);
            throw error;
        }
    },

    readProducts: async () => {
        try {
            return await productRepositorie.readProducts();
        } catch (error) {
            logger.error("Error al leer los productos:", error.message);
            throw error;
        }
    },

    getProducts: async (category, brand, sort) => {
        try {
            return await productRepositorie.getProducts(category, brand, sort);
        } catch (error) {
            logger.error("Error al obtener los productos:", error.message);
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            return await productRepositorie.getProductById(id);
        } catch (error) {
            logger.error("Error al obtener el producto:", error.message);
            throw error;
        }
    },

    getByBrand: async (brand) => {
        try {
            return await productRepositorie.getByBrand(brand);
        } catch (error) {
            logger.error("Error al obtener los productos por marca:", error.message);
            throw error;
        }
    },

    deleteProductById: async (pid) => {
        try {
            await productRepositorie.deleteProductById(pid);
        } catch (error) {
            logger.error("Error al eliminar el producto:", error.message);
            throw error;
        }
    },

    updateProduct: async (pid, newData) => {
        try {
            return await productRepositorie.updateProduct(pid, newData);
        } catch (error) {
            logger.error("Error al actualizar el producto:", error.message);
            throw error;
        }
    },

    paginateProducts: async (options) => {
        try {
            return await productRepositorie.paginateProducts(options);
        } catch (error) {
            logger.error("Error al paginar los productos:", error.message);
            throw error;
        }
    }
};

export default productService;