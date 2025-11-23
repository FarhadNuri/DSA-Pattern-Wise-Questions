import Pattern from "../models/pattern.model.js"

export async function addPattern(req,res) {
    try {
        const {name} = req.body
        if(!name) {
            return res.status(400).json({message: "Provide name"})
        }
        const pattern = req.body
        const newPattern = new Pattern(pattern)
        await newPattern.save()
        res.status(201).json(newPattern)
    } catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
}

export async function showPatterns(req,res) {
    try {
        const patterns = await Pattern.find({})
        res.status(200).json(patterns)
    } catch(error) {
        res.status(500).json({messag: "Internal Sserver Error"})
    }
}
export async function deletePattern(req,res) {
    try {
        const {id} = req.params
        await Pattern.findByIdAndDelete(id)
        res.status(200).json({message: "Pattern deleted"})
    } catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
}
