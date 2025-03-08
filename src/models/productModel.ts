import Express from "express";
import mongoose, { Document, model, Schema } from "mongoose";


export interface IProduct extends Document {
    title: string;
    image: string;
    price: number;
    stock: number;
}

const productSchema = new Schema<IProduct>({
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
});

const productModel = mongoose.model<IProduct>('product', productSchema)

export default productModel;

