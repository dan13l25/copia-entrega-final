import mongoose from "mongoose";
const { Schema } = mongoose;

const collection = "Carts";

const schema = new Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
    },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, default: 1 }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const cartsModel = mongoose.model(collection, schema);

export default cartsModel;