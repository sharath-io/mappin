import bcrypt from "bcrypt";
import User from "../models/User.js";

export const createNewUser = async(req,res) =>{
    try{
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);

        //create new user
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
        })

        //save user and send response
        const user = await newUser.save();
        res.status(200).json(user._id);

    }catch(error){
        res.status(500).json(error)
    }
}


export const loginUser =async (req,res) =>{
    try{
        // find user
        const user = await User.findOne({username:req.body.username});
        !user && res.status(400).json("Wrong username or password");

        // validate password
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("Wrong username or password");

        res.status(200).json({_id:user._id, username:user.username})

    }catch(error){
        res.status(500).json(error)
    }
}


/*
bcrypt.genSalt(10) creates a salt using 10 rounds of processing.
A salt is random data added to a password before hashing to make the hash unique, even if two users have the same password.


const hashedPassword = await bcrypt.hash(req.body.password,salt);
This hashes the user's plain-text password using the generated salt.
Prevents storing raw passwords in the database, which is crucial for security.
*/