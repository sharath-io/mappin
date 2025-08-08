import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import pins from "./routes/pins.js";
import users from "./routes/users.js";

dotenv.config()
const app = express();

app.use(express.json())

app.use("/api/users", users)
app.use("/api/pins", pins)

connectDB().then(() => {
  app.listen(8080, ()=> console.log('mappin app project started in 8080'))
});
