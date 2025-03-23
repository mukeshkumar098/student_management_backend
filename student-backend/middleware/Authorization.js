import jwt from "jsonwebtoken";
import { userModel } from "../schemas/AuthSchema.js";


export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];

    console.log(token);
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Token is missing." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    const user = await userModel.findById(decoded.id);
   
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
    }

    res.status(500).json({ success: false, message: "Internal server error during authentication." });
  }
};
