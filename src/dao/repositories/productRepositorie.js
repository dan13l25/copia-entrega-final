import Product from "../models/product.js";
import { devLogger as logger } from "../../utils/loggers.js";

const productRepositorie = {
    addProduct: async (req, title, description, price, thumbnails, code, stock, status, category, brand) => {
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
            req.logger.error("Error al añadir el producto:", error.message);
            throw error;
        }
    },

    readProducts: async (req) => {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
            req.logger.error("Error al leer los productos:", error.message);
            throw error;
        }
    },


    getProducts: async (req,category, brand, sort) => { 
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
            req.logger.error("Error al obtener los productos:", error.message);
            throw error;
        }
    },

    getProductById: async (req,id) => {
        try {
            const product = await Product.findById(id);
            return product; 
        } catch (error) {
            req.logger.error("Error al obtener el producto:", error.message);
            throw error;
        }
    },

    getByBrand: async (req,brand) => {
        try {
            const products = await Product.find({ brand });
            return products; 
        } catch (error) {
            req.logger.error("Error al obtener los productos por marca:", error.message);
            throw error;
        }
    },

    deleteProductById: async (req,pid) => {
        try {
            await Product.findByIdAndDelete({_id:pid});
        } catch (error) {
            req.logger.error("Error al eliminar el producto:", error.message);
            throw error;
        }
    },

    updateProduct: async (req,pid, newData) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(pid, newData, { new: true });
            return updatedProduct;
        } catch (error) {
            req.logger.error("Error al actualizar el producto:", error.message);
            throw error;
        }
    },

    paginateProducts: async (req,options) => {
        try {
            return await Product.paginate({}, options);
        } catch (error) {
            req.logger.error("Error al paginar los productos:", error.message);
            throw error;
        }
    },

    updateProductImage: async (req, pid, thumbnail) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                pid,
                { $set: { thumbnails: [thumbnail] } }, 
                { new: true }
            );
            return updatedProduct;
        } catch (error) {
            req.logger.error("Error al actualizar la imagen del producto:", error.message);
            throw error;
        }
    }
};

export default productRepositorie