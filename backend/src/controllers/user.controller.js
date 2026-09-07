import { request } from "express";
import { User } from "../models/user.model.js";

//async wait: something which finishes 1 task and then proceeds to another. It doesn't mess up things
const registerUser = async (request, response) => {
    try{
        const {username, email, password} = request.body;

        // basic validation
        if(!username || !email || !password){
            return response.status(400).json({ message: "Some required fields are missing."})
        }

        // check if user exists alreadyW
        const existing = await User.findOne({ email: email.toLowerCase() });
        if(existing){
            return response.status(400).json({message: "user already exists"});
        }
        //create user
        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password,
            loggedIn: false,
        });
        response.status(201).json({
            message: "User registered",
            user: {id: user._id, email: user.email, username: user.username}
        })
    }catch(error){
        //our server has issue
        response.status(500).json({ message: "Internal server error", error: error.message});
    }
};

const loginUser = async (request, response) => {
    try {
        
        //checking if the user already exists
        const { email, password} = request.body;
        if(!email || !password){
            return response.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });
        if(!user) return response.status(404).json({
            message: "User not found"
        });

        // compare passwords
        const isMatch = await user.comparePassword(password);
        if(!isMatch) return response.status(400).json({
            message: "Invalid credentials"
        });

        response.status(200).json({
            message: "User Logged in",
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }
        });
    }catch(error){
        response.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const logoutUser = async (request, response) => {
    try {
        const { email } = request.body;
        const user = await User.findOne({
            email
        });
        if(!user) return response.status(404).json({
            message: "User not found"
        });
        response.status(200).json({
            message: "Logout successfully"
        })
    } catch(error){
        response.status(500).json({
            message: "Internal Server Error", error
        })
    }
}
export {
    registerUser,
    loginUser,
    logoutUser
}