const User = require('../models/User')
const bcrypt = require("bcryptjs");
// const UpdatePassword = async(req , res , next)=>{
//     const {password,confirmPassword , token} = req.body
//     try {
//         const findedUser = await User.findOne({'otp.token':token})
//         if(!findedUser){
//             const error = new Error("something went wrong")
//             error.statusCode = 400;
//             throw error;
//         }
//         if(new Date(findedUser.otp.sendTime).getTime()+5*60*1000< new Date().getTime()
//         ){
//             const error = new Error("something went wrong")
//             error.statusCode = 400;
//             throw error;
//     }

//     if(password !==confirmPassword){
//         const error = new Error("password does not match");
//         error.statusCode = 400;
//         throw error;
//     }

//     const hashedPassword = await bcrypt.hash(password,10)

//     findedUser.password = hashedPassword
//     findedUser.otp.sendTime=null
//     findedUser.otp.token=null

//     await findedUser.save()

//     res.status(200).json({message:"password updated succesfully " , status:true})
        
//     } catch (error) {
//         next(error)
        
//     }
//  }

// ...existing code...
const UpdatePassword = async(req , res , next)=>{
    const {password, confirmPassword, token} = req.body
    try {
        if (!password || !confirmPassword) {
            const error = new Error("Password and confirmPassword are required");
            error.statusCode = 400;
            throw error;
        }

        const findedUser = await User.findOne({'otp.token':token})
        if(!findedUser){
            const error = new Error("something went wrong")
            error.statusCode = 400;
            throw error;
        }
        if(new Date(findedUser.otp.sendTime).getTime()+5*60*1000< new Date().getTime()
        ){
            const error = new Error("something went wrong")
            error.statusCode = 400;
            throw error;
        }

        if(password !== confirmPassword){
            const error = new Error("password does not match");
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password,10)

        findedUser.password = hashedPassword
        findedUser.otp.sendTime=null
        findedUser.otp.token=null

        await findedUser.save()

        res.status(200).json({message:"password updated succesfully " , status:true})

    } catch (error) {
        next(error)
    }
}
// ...existing code...
 module.exports = UpdatePassword