// const User = require('../models/User')
// const bcrypt = require('bcrypt')
// const joi = require('joi')



// const register = async(req , res , next)=>{

//     const {error:validationError} = validateUser(req.body)

//     const {name,email, password} = req.body

//     try {

//         if(validationError){
//             const error = new Error(validationError.details[0].message)
//             error.statusCode = 400;
//             throw error;
//         }
//         const formatedName = name.toLowerCase()
//         const formatedEmail = email.toLowerCase()


//         const findedUser = await User.findOne({email:formatedEmail})

//         if(findedUser){
//             const error = new Error(' this email is already exist')
//             error.statusCode = 400
//             throw error
//         }

//         const hashedPassword = await bcrypt.hash(password,10)


//         const newUser = new User({
//             name:formatedName,email:formatedEmail,password:hashedPassword
//         })

//        await newUser.save();

//         res.status(200).json({message:"user registered succesfully", status:true});
        
//     } catch (error) {
//         next(error)
        
//     }
// }

// module.exports = register;


// function validateUser(data){
//     const UserSchema = joi.object({
//         name:joi.string().min(2).required(),
//         email:joi.string().email().required(),
//         password:joi.string().min(6).max(12).required(),
    
//     });
//     return UserSchema.validate(data)
// }


const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const joi = require('joi');

const register = async (req, res, next) => {
    const { error: validationError } = validateUser(req.body);

    if (validationError) {
        return res.status(400).json({ message: validationError.details[0].message, status: false });
    }

    const { name, email, password } = req.body;

    try {
        const formattedName = name.trim().toLowerCase();
        const formattedEmail = email.trim().toLowerCase();

        // Check if the email already exists
        const existingUser = await User.findOne({ email: formattedEmail });

        if (existingUser) {
            return res.status(400).json({ message: 'This email already exists', status: false });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name: formattedName,
            email: formattedEmail,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(200).json({ message: "User registered successfully", status: true });
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};

module.exports = register;

function validateUser(data) {
    const UserSchema = joi.object({
        name: joi.string().min(2).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).max(12).required(),
    });
    return UserSchema.validate(data);
}
