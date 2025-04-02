import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
    },
    members: {
        type: [String],
    },
    message: {
        type: String,
        default: "",
    }
}
)

export const Room = mongoose.model("Room",roomSchema);