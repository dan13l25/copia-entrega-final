import Product from "../models/product.js";
import { devLogger as logger } from "../../utils/loggers.js";

const productRepositorie = {
    addProduct: async (title, description, price, thumbnails, code, stock, status, category, brand) => {
        try {
            const product = new Product({
                title,
                description,
                price,
                thumbnails,
                code,
                stock,
                status,
                category,
                brand
            });
    
            await product.save();
        } catch (error) {
            logger.error("Error al añadir el producto:", error.message);
            throw error;
        }
    },

    readProducts: async () => {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
            logger.error("Error al leer los productos:", error.message);
            throw error;
        }
    },

    getProducts: async (category, brand, sort) => { 
        try {
            let query = {};
            if (category) {
                query.category = category;
            }
            if (brand) {
                query.brand = brand;
            }
            const options = {
                limit: 4,
                page: 1,
                sort: { price: sort === 'asc' ? 1 : -1 }
            };

            const filter = await Product.paginate(query, options).lean();
            const products = filter.docs.map(product => product.toObject());

            return products;
        } catch (error) {
            logger.error("Error al obtener los productos:", error.message);
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            const product = await Product.findById(id);
            return product; 
        } catch (error) {
            logger.error("Error al obtener el producto:", error.message);
            throw error;
        }
    },

    getByBrand: async (brand) => {
        try {
            const products = await Product.find({ brand });
            return products; 
        } catch (error) {
            logger.error("Error al obtener los productos por marca:", error.message);
            throw error;
        }
    },

    deleteProductById: async (pid) => {
        try {
            await Product.findByIdAndDelete({_id:pid});
        } catch (error) {
            logger.error("Error al eliminar el producto:", error.message);
            throw error;
        }
    },

    updateProduct: async (pid, newData) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(pid, newData, { new: true });
            return updatedProduct;
        } catch (error) {
            logger.error("Error al actualizar el producto:", error.message);
            throw error;
        }
    },

    paginateProducts: async (options) => {
        try {
            return await Product.paginate({}, options);
        } catch (error) {
            logger.error("Error al paginar los productos:", error.message);
            throw error;
        }
    }
};

export default productRepositorie