const mongoose = require('mongoose');


const connectDB = async ()=>{
    const conn = await mongoose.connect(process.env.MONGO_URI); //goh mikhore.mongoose.connect promise return mikone va asynce
    console.log(`mongoDB connected : ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = connectDB