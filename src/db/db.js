import mongoose from "mongoose"

export const connectTodb = async() => {
    try{
        const connectionInstance = await mongoose.connect("mongodb://localhost:27017/code-editor");
        console.log(`Mongodb connected: ${connectionInstance.connection.host}`);
    } 
    catch(error){
        console.log("Error in connecting to db: ",error);
        process.exit(1);
    }
}