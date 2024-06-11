import express from "express";
import ProductController from "../controllers/productController.js";
import { generateFakeProduct } from "../utils/fakeProduct.js";
import { errorTypes } from "../utils/errorTypes.js";
import Product from "../dao/models/product.js";
import { isAdmin } from "../middlewares/adminAuth.js";
import { authenticate } from "../middlewares/authenticate.js";
import { auth } from "../middlewares/auth.js";
import { upload } from "../utils.js";
import { isPremium } from "../middlewares/adminAuth.js";

const productRouter = express.Router();
const productController = new ProductController();

//probar middleware
productRouter.get("/", auth, async (req, res) => {
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

// Ruta para actualizar un producto y añadirle una imagen
productRouter.put("/updateProductImage/:pid", upload.single('thumbnail'), (req, res, next) => {
    const { pid } = req.params;
    const thumbnail = req.file ? req.file.path : null;

    if (!thumbnail) {
        return res.status(400).json({ message: "Image file is required" });
    }

    req.body.thumbnail = thumbnail;
    productController.updateProductImage(req, res, next);
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

productRouter.post('/addProduct', authenticate, isPremium, upload.array('thumbnails', 5), (req, res, next) => {
    const thumbnails = req.files.map(file => file.path); 
    req.body.thumbnails = thumbnails; 
    productController.addProduct(req, res, next);
});

productRouter.delete("/:pid", authenticate, productController.deleteProductById);
productRouter.put("/:pid", authenticate, productController.updateProduct);

export { productRouter };
