import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
    solved: {
        type: Boolean,
        default:false
    }, 
    name: {
        type: String,
        default: ''
    },
    link: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    },
    patternId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pattern',
        required: true
    }
},{timestamps:true})

const Problem = mongoose.model("Problem",problemSchema)

export default Problem