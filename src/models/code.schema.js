import mongoose from "mongoose";

const CodeSchema = new mongoose.Schema({
    room: { type: String, unique: true },
    user: { type:String },
    code: { type: String, default: "" },
});

const Code = mongoose.model("Code", CodeSchema);
export default Code;
