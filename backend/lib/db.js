import mongoose from "mongoose";

export async function connectDB() {
    try {
        const cnct = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB Connected: ${cnct.connection.host}`)
    } catch(error) {
        console.log("Error connecting to database ",error.message)
    }
}