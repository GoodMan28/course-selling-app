// common auth file for both the user and the admin
import jwt from "jsonwebtoken";
import express from "express"
import { ADMIN_JWT_SECRET } from "../config.js";
export function auth(req, res, next) {
    let token = req.headers.token;
    if(!token) {
        return res.status(404).json({
            "msg": "Token header empty"
        })
    }
    try {
        let decodedPayload = jwt.verify(token, ADMIN_JWT_SECRET);
        req.id = decodedPayload.id;
        next();
    }
    catch(err) {
        return res.status(404).json({
            "msg": "The token verification has failed"
        })
    }
}