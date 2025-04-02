import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import roomRoutes from "./routes/room.routes.js"
// import codeRoutes from "./routes/code.routes.js"
const app =express();
app.use(express.json());
app.use(cors());
app.use("/auth",authRoutes)
app.use("/room",roomRoutes);
// app.use("/code",codeRoutes);
export default app;