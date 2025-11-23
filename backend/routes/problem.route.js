import express from "express"
import { addProblem, showProblems, updateProblem, deleteProblem } from "../controllers/problem.controller.js"
const router = express.Router()

router.post("/",addProblem)
router.get("/",showProblems)
router.put("/:id", updateProblem)
router.delete("/:id",deleteProblem)

export default router