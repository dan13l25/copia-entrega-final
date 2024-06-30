import Product from "../models/product.js";

const productRepositorie = {
    addProduct: async (title, description, price, thumbnails, code, stock, status, category, brand, owner) => {
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
                brand,
                owner
            });

            await product.save();
        } catch (error) {
            throw error;
        }
    },

    readProducts: async () => {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
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
            throw error;
        }
    },

    getProductById: async (id) => {
         try {
            console.log(`Buscando producto con ID: ${id}`);
            const product = await Product.findById(id);
            if (!product) {
                console.log(`Producto no encontrado: ${id}`);
            }
            return product;
        } catch (error) {
            throw error;
        }
    },

    getByBrand: async (brand) => {
        try {
            const products = await Product.find({ brand });
            return products; 
        } catch (error) {
            throw error;
        }
    },

    deleteProductById: async (id) => {
        try {
            await Product.findByIdAndDelete({_id: id});
        } catch (error) {
            throw error;
        }
    },

    updateProduct: async (id, newData) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, newData, { new: true });
            return updatedProduct;
        } catch (error) {
            throw error;
        }
    },

    paginateProducts: async (options) => {
        try {
            return await Product.paginate({}, options);
        } catch (error) {
            throw error;
        }
    },

    updateProductImage: async (id, thumbnail) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                { $set: { thumbnails: [thumbnail] } }, 
                { new: true }
            );
            return updatedProduct;
        } catch (error) {
            throw error;
        }
    }
};

export default productRepositorie;
