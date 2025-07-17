const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Mongodb connected');
    } catch (error) {
        console.log("Mongodb connection error:", error.message);
        process.exit(1)
    }
}

module.exports = { connectDB }
