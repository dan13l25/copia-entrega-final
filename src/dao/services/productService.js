import productRepositorie from "../repositories/productRepositorie.js";

const productService = {
    addProduct: async (title, description, price, thumbnails, code, stock, status, category, brand, owner) => {
        try {
            await productRepositorie.addProduct(title, description, price, thumbnails, code, stock, status, category, brand, owner);
        } catch (error) {
            throw error;
        }
    },

    readProducts: async () => {
        try {
            return await productRepositorie.readProducts();
        } catch (error) {
            throw error;
        }
    },

    getProducts: async (category, brand, sort) => {
        try {
            return await productRepositorie.getProducts(category, brand, sort);
        } catch (error) {
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            return await productRepositorie.getProductById(id);
        } catch (error) {
            throw error;
        }
    },

    getByBrand: async (brand) => {
        try {
            return await productRepositorie.getByBrand(brand);
        } catch (error) {
            throw error;
        }
    },

    deleteProductById: async (id) => {
        try {
            await productRepositorie.deleteProductById(id);
        } catch (error) {
            throw error;
        }
    },

    updateProduct: async (id, newData) => {
        try {
            return await productRepositorie.updateProduct(id, newData);
        } catch (error) {
            throw error;
        }
    },

    paginateProducts: async (options) => {
        try {
            return await productRepositorie.paginateProducts(options);
        } catch (error) {
            throw error;
        }
    },

    updateProductImage: async (id, thumbnail) => {
        try {
            return await productRepositorie.updateProductImage(id, thumbnail);
        } catch (error) {
            throw error;
        }
    }
};

export default productService;
