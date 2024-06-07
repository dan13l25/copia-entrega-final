import productRepositorie from "../repositories/productRepositorie.js";

const productService = {
    addProduct: async (req, title, description, price, thumbnails, code, stock, status, category, brand) => {
        try {
            await productRepositorie.addProduct(req, title, description, price, thumbnails, code, stock, status, category, brand);
        } catch (error) {
            req.logger.error("Error al añadir el producto:", error.message);
            throw error;
        }
    },

    readProducts: async (req) => {
        try {
            return await productRepositorie.readProducts();
        } catch (error) {
            req.logger.error("Error al leer los productos:", error.message);
            throw error;
        }
    },

    getProducts: async (req,category, brand, sort) => {
        try {
            return await productRepositorie.getProducts(category, brand, sort);
        } catch (error) {
            req.logger.error("Error al obtener los productos:", error.message);
            throw error;
        }
    },

    getProductById: async (req,id) => {
        try {
            return await productRepositorie.getProductById(id);
        } catch (error) {
            req.logger.error("Error al obtener el producto:", error.message);
            throw error;
        }
    },

    getByBrand: async (req,brand) => {
        try {
            return await productRepositorie.getByBrand(brand);
        } catch (error) {
            req.logger.error("Error al obtener los productos por marca:", error.message);
            throw error;
        }
    },

    deleteProductById: async (req,pid) => {
        try {
            await productRepositorie.deleteProductById(pid);
        } catch (error) {
            req.logger.error("Error al eliminar el producto:", error.message);
            throw error;
        }
    },

    updateProduct: async (req,pid, newData) => {
        try {
            return await productRepositorie.updateProduct(pid, newData);
        } catch (error) {
            req.logger.error("Error al actualizar el producto:", error.message);
            throw error;
        }
    },

    paginateProducts: async (req,options) => {
        try {
            return await productRepositorie.paginateProducts(options);
        } catch (error) {
            req.logger.error("Error al paginar los productos:", error.message);
            throw error;
        }
    },

    updateProductImage: async (req,pid, thumbnail) => {
        try {
            return await productRepositorie.updateProductImage(pid, thumbnail);
        } catch (error) {
            req.logger.error("Error al actualizar la imagen del producto:", error.message);
            throw error;
        }
    }
};

export default productService;