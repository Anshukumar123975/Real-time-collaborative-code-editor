import dotenv from "dotenv";
import { connectTodb } from "./db/db.js";
import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 7800;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const roomFiles = {}; // Store room-specific file data

connectTodb()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });

        io.on("connection", (socket) => {
            console.log("New client connected");

            socket.on("joinRoom", (roomId) => {
              socket.join(roomId);
              console.log(`User joined room: ${roomId}`);
          
              // Send latest code to the newly joined user
              if (roomFiles[roomId]) {
                  socket.emit("fileData", roomFiles[roomId]); 
              } else {
                  roomFiles[roomId] = { name: "index.js", content: "// Start coding here" };
                  io.to(roomId).emit("fileData", roomFiles[roomId]);
              }
          });
          

            // Update file content
            socket.on("updateCode", ({ room, code }) => {
              if (roomFiles[room]) {
                  roomFiles[room].content = code;
                  
                  // Emit the update to everyone in the room **except sender**
                  socket.to(room).emit("fileData", roomFiles[room]);
                  
                  console.log(`Code updated in room ${room}:`, code); // Debugging
              }
          });
          

            socket.on("disconnect", () => {
                console.log("User disconnected");
            });
        });
    })
    .catch((error) => {
        console.log("Error in connecting to connectTodb: ", error);
    });
