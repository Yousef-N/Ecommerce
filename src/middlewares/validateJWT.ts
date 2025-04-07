import {  Response,Request, NextFunction, request } from "express";
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel";
import { ExtendRequest } from "../types/extendedRequest";

const validateJWT = (req: ExtendRequest , res: Response, next: NextFunction) => { //  creating the middleware  to check on user auth
    const authHeader = req.get('authorization');                            // check if the the bearer token auth is in the header
    if (!authHeader) { 
        res.status(403).send("Authorization header was not provided");
        return;
    }
    const token =  authHeader.split(" ")[1];              // if the token is in the header return it in array 
    if (!token) {
        res.status(403).send("Bearer token not found");
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET  as string ,  async (err, payload) => {         // check on the token  if it matches or not 
        if (err) {
            res.status(403).send("invalid token")
            return
        }
        if (!payload) {                                                                 // user check 
            res.status(403).send("Invalid token payload")
            return
        }
        const userPayload = payload as  {      // payload data from the userService login function
            email: string;
            firstName: string;
            lastName: string;
        };

        //fetch user from database based on the payload
        const  user = await userModel.findOne({ email: userPayload.email });
        req.user = user;
        next();
    });
}

export default validateJWT;