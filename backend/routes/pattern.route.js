import express from "express"
import { addPattern, showPatterns, deletePattern } from "../controllers/pattern.controller.js"
const router = express.Router()

router.post("/",addPattern)
router.get("/",showPatterns)
router.delete("/:id",deletePattern)

export default router