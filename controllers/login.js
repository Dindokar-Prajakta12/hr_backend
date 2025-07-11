const User = require('../models/User.js')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')


const login = async(req , res , next)=>{
    const {email,password}= req.body

    try {
        const formatedEmail = email.toLowerCase()

        const findedUser = await User.findOne({email:formatedEmail});

        if(!findedUser){
            const error = new Error("no user found");
           error.statusCode = 400;
           throw error;
        }

        const isPassMatch = await bcrypt.compare(password,findedUser.password)
        if(!isPassMatch){
            const error = new Error('incorrect password');
            error.statusCode = 400;
            throw error;

        }

        const accessToken = jwt.sign(
            {email:formatedEmail,userId:findedUser._id},
            process.env.ACCESS_TOKEN_KEY,
            {expiresIn:"7d"}
        );
        res.status(200).json({message:"Login Succesfully" ,status:true, token:accessToken})

    
    } catch (error) {
        next(error);


        
    }
};

module.exports = login;