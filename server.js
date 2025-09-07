import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import pgClient from "./db.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT;



app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use("/api/users", userRoutes);



try {
pgClient.connect().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});}
catch (error) {
    console.error("Failed to connect to the database:", error);
}