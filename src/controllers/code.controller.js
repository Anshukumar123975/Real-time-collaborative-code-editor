import Code from "../models/code.schema.js";

export const saveCode = async (room, user, code) => {
    try {
        let existingCode = await Code.findOne({ room });

        if (existingCode) {
            existingCode.code = code;
            await existingCode.save();
        } else {
            await Code.create({ room, user, code });
        }
    } catch (error) {
        console.error("Error saving code:", error);
        throw error;
    }
};

export const getCode = async (room) => {
    try {
        const codeData = await Code.findOne({ room });
        return codeData ? codeData.code : "";
    } catch (error) {
        console.error("Error fetching code:", error);
        throw error;
    }
};
