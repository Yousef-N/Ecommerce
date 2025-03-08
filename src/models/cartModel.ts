import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { IProduct } from "./productModel";


const cartStatusEnum = ["active", "completed"]
export interface ICartItems { 
    product: IProduct;
    unitPrice: Number;
    quantity: Number;
}

export interface ICart extends Document{
    userId: ObjectId| string;
    items: ICartItems[]
    totalAmount: Number;
    status: "active"| "completed"


}

const cartItemSchema = new Schema<ICartItems>({
    product: { type: Schema.Types.ObjectId, ref: "product", required: true },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: {type:Number, required: true}
})

const cartSchema = new Schema<ICart>({
    userId: { type: Schema.Types.ObjectId, ref: "User",required:true },
    items: [cartItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: cartStatusEnum, default: "active" },
})

export const cartModel = mongoose.model<ICart>('Cart',cartSchema)