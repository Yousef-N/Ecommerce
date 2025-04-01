import express, { request } from "express";
import getActiveCartForUser, { addItemToCart, updateItemInCart ,deleteItemInCart, clearCart, checkout} from '../services/cartService'
import validateJWT from "../middlewares/validateJWT";
import { ExtendRequest } from "../types/extendedRequest";
import { Response } from 'express';
import productModel from '../models/productModel';
import { validateLocaleAndSetLanguage } from "typescript";

const router = express.Router();


router.get('/',
    validateJWT,
    async (req:ExtendRequest, res) => {  
    const userId = req.user._id;
    const cart = await getActiveCartForUser({ userId })
    res.status(200).send(cart)
    });

router.post('/item',
    validateJWT,
    async (req: ExtendRequest, res) => {
        const userId = req?.user?._id;
        const { productId, quantity } = req.body
        const response = await addItemToCart({ userId, productId, quantity })
        res.status(response.statusCode).send(response.data);
    });

router.put('/item',
    validateJWT,
    async (req: ExtendRequest, res) => {
        const userId = req?.user?._id;
        const { productId, quantity } = req.body
        const response = await updateItemInCart({ userId, productId, quantity })
        res.status(response.statusCode).send(response.data);
    });

router.delete('/items/:productId', validateJWT, async (req: ExtendRequest, res) => {
    const userId = req?.user?._id;
    const { productId } = req.params;
    const response = await deleteItemInCart({ userId, productId });
    res.status(response.statusCode).send(response.data);
});

router.delete('/',validateJWT,async(req: ExtendRequest, res)=> {
    const userId = req?.user?._id;
    const response = await clearCart({userId});
    res.status(response.statusCode).send(response.data);
});

router.post('/checkout', validateJWT, async (req: ExtendRequest, res)=> {
    const userId = req?.user?._id;
    const { address } = req.body;
    const response = await checkout({ userId, address });
    res.status(response.statusCode).send(response.data);
});

export default router