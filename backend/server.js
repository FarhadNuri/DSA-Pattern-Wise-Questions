import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./lib/db.js"
import problemRoute from "./routes/problem.route.js"
import patternRoute from "./routes/pattern.route.js"
dotenv.config()


const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// API routes
app.use("/api/problem", problemRoute)
app.use("/api/pattern", patternRoute)

app.listen(PORT, () => {
    console.log("Server running on port ", PORT)
    connectDB()
})
