import express from "express";
import { login, register } from "../controller/Authcontroller.js";
const userRoute=express.Router();


userRoute.post("/register",register)
userRoute.post("/login",login)

export {userRoute}