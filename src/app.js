import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import express from "express";
import cors from "cors";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";
// import { userModel } from "./models/user.models.js";
// import { advertisementModel } from "./models/advertisement.model.js";

connectDB();


const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, //which frontend is allowed
    credentials: true, // for allowing the cookies and authentication
  })
);
app.use(express.json({ limit: "16kb" })); // for accepting the data from (Apis, axios, fetch, form, get post etc)
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // designed for url data such as form data
app.use(express.static("public")); // public assets to access static files
app.use(cookieParser());

// import routes
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);

app.get("/", (req, res) => {
    res.send("Hello world"); 
  });

export { app };