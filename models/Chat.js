import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    chatName: {
        type: String
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }],
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }
}, { timestamps: true })

export default mongoose.model("Chat", chatSchema)