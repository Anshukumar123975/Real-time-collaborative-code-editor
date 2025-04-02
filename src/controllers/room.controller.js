import { Room } from "../models/room.models.js";

export const roomCreate = async (req, res) => {
    const { creatorId } = req.body;
    let randomRoomId = generateRoomId();
    try{
        
        const existingRoom = await Room.findOne({ roomId: randomRoomId });
        if (existingRoom) {
            return roomCreate(creatorId);
        }

        const newRoom = new Room({
            roomId: randomRoomId,
            members: [creatorId], 
        });

        await newRoom.save();

        res.status(200).json({ roomId: newRoom.roomId });
    }  
    catch(error){
        res.status(500).json({ error: "Failed to create room" });
    }         
    
};

const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 18).toUpperCase();
};
