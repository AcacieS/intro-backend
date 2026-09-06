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

export {
    registerUser
}