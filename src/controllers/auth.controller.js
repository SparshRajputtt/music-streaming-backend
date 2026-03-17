import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();


/*POST /api/auth/register */
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role = "user" } = req.body;

        const existingUser = await userModel.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists, please choose another one.' });
        }

        //Hashing password before saving to database
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;

        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
            role
        });

        const token = jwt.sign({
            id: newUser._id,
            username: newUser.username,
            role: newUser.role
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token);

        res.status(201).json({ message: "User registered successfully.", user: newUser });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


/*POST /api/auth/login */
const loginUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await userModel.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Ivalid credentials." });
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '12h' });

        res.cookie('token', token);

        res.status(200).json({
            message: "User logged in successfully.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


const logoutUser = async (req, res) => {
    res.clearCookie('token'),
    res.status(200).json({ message: "User logged out successfully." });
}


export default {
    registerUser,
    loginUser,
    logoutUser
}
