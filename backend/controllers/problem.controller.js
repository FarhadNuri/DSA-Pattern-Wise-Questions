import Problem from "../models/problem.model.js"

export async function addProblem(req,res) {
    try {
        const {patternId} = req.body
        if(!patternId) {
            return res.status(400).json({message: "Pattern ID is required"})
        }
        const problem = req.body
        const newProblem = new Problem(problem)
        await newProblem.save()
        res.status(201).json(newProblem)
    } catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
}

export async function showProblems(req,res) {
    try {
        const problems = await Problem.find({})
        res.status(200).json(problems)
    } catch(error) {
        res.status(500).json({messag: "Internal Sserver Error"})
    }
}
export async function updateProblem(req,res) {
    try {
        const {id} = req.params
        const updatedProblem = await Problem.findByIdAndUpdate(id, req.body, {new: true})
        res.status(200).json(updatedProblem)
    } catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
}

export async function deleteProblem(req,res) {
    try {
        const {id} = req.params
        await Problem.findByIdAndDelete(id)
        res.status(200).json({message: "Problem deleted"})
    } catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
}
