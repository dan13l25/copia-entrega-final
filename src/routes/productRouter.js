import express from "express";
import ProductController from "../controllers/productController.js";
import { generateFakeProduct } from "../utils/fakeProduct.js";
import { errorTypes } from "../utils/errorTypes.js";
import Product from "../dao/models/product.js";
import { isAdmin } from "../middlewares/adminAuth.js";
import { authenticate } from "../middlewares/authenticate.js";
import { auth } from "../middlewares/auth.js";

const productRouter = express.Router();
const productController = new ProductController();

//probar middleware
productRouter.get("/",auth ,async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 4;
        const page = parseInt(req.query.page) || 1;

        const options = {
            limit,
            page,
            lean: true
        };

        const products = await Product.paginate({}, options);
        const totalPages = Math.ceil(products.total / limit);
        const isValid = page >= 1 && page <= totalPages;

        products.isValid = isValid;
        return res.json(products);

    } catch (error) {
        console.error(error);
        res.status(errorTypes.ERROR_INTERNAL_ERROR).send("Error al recibir productos");
    }
});

productRouter.get("/mockingproducts", (req, res) => {
    try {
        const fakeProducts = generateFakeProduct();
        res.json(fakeProducts);
    } catch (error) {
        console.error("Error al generar productos ficticios:", error.message);
        res.status(errorTypes.ERROR_INTERNAL_ERROR).json({ error: "Error interno del servidor" });
    }
});

// Ruta para renderizar la página de productos
productRouter.get("/view", productController.renderProductsPage);
productRouter.get("/:pid", productController.getProductById);
productRouter.get("/brand/:brand", productController.getByBrand);
productRouter.post('/addProduct', authenticate, isAdmin, (req, res, next) => productController.addProduct(req, res, next));
productRouter.put("/:pid", productController.updateProduct);
productRouter.delete("/:pid", productController.deleteProductById);

export { productRouter };
