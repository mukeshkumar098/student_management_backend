import bcrypt from "bcrypt"

import jwt from 'jsonwebtoken';
import { userModel } from "../schemas/AuthSchema.js";

export const register = async (req, res) => {
    try {
        let { name, email, password } = req.body
        console.log( req.body);
        

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const hashedPassword = await bcrypt.hash(password, +process.env.SALT_ROUND);


        const newUser = new userModel({ name, email, password: hashedPassword });


        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User successfully registered",
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
        });


    } catch (error) {
        console.log(error);

    }
}



export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            token: token,
            user: user,
            message: "successfully login"
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
