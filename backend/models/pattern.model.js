import mongoose from "mongoose";

const patternSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    }
},
{timestamps:true})

const Pattern = mongoose.model("Pattern",patternSchema)

export default Pattern