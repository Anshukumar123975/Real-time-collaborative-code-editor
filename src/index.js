import dotenv from "dotenv"
import { connectTodb } from "./db/db.js"
import app from "./app.js";
import { createServer } from "http";

const PORT = 7300;
const server  = createServer(app);

connectTodb()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        })
    })
    .catch((error) => {
        console.log("Error in connecting to connectTodb: ",error);    
    })