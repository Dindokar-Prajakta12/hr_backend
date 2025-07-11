// const mongoose = require('mongoose')


// const getConnection = ()=>{
//     try{
//         mongoose.set('strictQuery', true);
//         mongoose
//         .connect(process.env.MONGO_URL)
//         .then((connection)=>{
//             console.log("db is connected");
//         }).catch((error)=>{
//             console.log("failed to connect to db");

//         })

//     }catch (error){
//         console.log(error.message);
//     }
// };

// module.exports = getConnection


const mongoose = require('mongoose');

const getConnection = async () => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB is connected");
    } catch (error) {
        console.error("Failed to connect to DB:", error.message);
    }
};

module.exports = getConnection;

