import express from "express"
import dotenv from "dotenv"
import path from "path"
import cors from "cors"
import { connectDB } from "./lib/db.js"
import problemRoute from "./routes/problem.route.js"
import patternRoute from "./routes/pattern.route.js"
dotenv.config()


const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())

const __dirname = path.resolve()

// API routes
app.use("/api/problem", problemRoute)
app.use("/api/pattern", patternRoute)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")))

    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}
app.listen(PORT, () => {
    console.log("Server running on port ", PORT)
    connectDB()
})
