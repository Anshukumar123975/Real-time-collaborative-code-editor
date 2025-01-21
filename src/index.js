import dotenv from "dotenv"
import { connectTodb } from "./db/db.js"
import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 7300;
const server  = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // Replace with your frontend URL
        methods: ["GET", "POST"],
    },
});

connectTodb()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        })
        io.on("connection", (socket) => {
            console.log("New client connected");
          
            // When a user joins a room
            socket.on("joinRoom", (roomId) => {
              socket.join(roomId);  // Join the room with roomId
              console.log(`User joined room: ${roomId}`);
            });
          
            // When a message is sent, emit it to the same room
            socket.on("sendMessage", async (data) => {
              const { room, sender, message } = data;
              // Emit the message to the room
              try {
                // Save the message to the database using the sendMessage controller
                const savedMessage = await sendMessage({ room, sender, message });
    
                // Emit the saved message to the room
                io.to(room).emit("receiveMessage", {
                    sender: savedMessage.sender,
                    message: savedMessage.message,
                });
    
                console.log(`Message sent and saved: ${savedMessage.message}`);
            } catch (error) {
                console.error("Error sending message:", error);
            }
              console.log(room);
              console.log(room, message);
            });
          
            // When the user disconnects (optional clean-up)
            socket.on("disconnect", () => {
              console.log("User disconnected");
            });
          });
    })
    .catch((error) => {
        console.log("Error in connecting to connectTodb: ",error);    
    })