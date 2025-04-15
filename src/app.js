import dotenv from "dotenv";
dotenv.config({
  path: "./env",
});
import express from "express";
import cors from "cors";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";
// import { userModel } from "./models/user.models.js";
// import { advertisementModel } from "./models/advertisement.model.js";

connectDB();

// const seed = async () => {
//   await connectDB();

//   // Clear existing data
//   // await User.deleteMany({});
//   // await Ad.deleteMany({});

//   const users = [
//   {
//       name: "Carlos Santana",
//       email: "carlos.santana@example.com",
//       password: "password123",
//       avatar: "https://dummyimage.com/100x100/000/fff&text=Carlos",
//       role: "publisher",
//       country: "Mexico",
//       isSubscribed: false
//     },
//     {
//       name: "Lily Adams",
//       email: "lily.adams@example.com",
//       password: "password123",
//       avatar: "https://dummyimage.com/100x100/000/fff&text=Lily",
//       role: "publisher",
//       country: "UK",
//       isSubscribed: true
//     },
//     {
//       name: "David Brown",
//       email: "david.brown@example.com",
//       password: "password123",
//       avatar: "https://dummyimage.com/100x100/000/fff&text=David",
//       role: "advertiser",
//       country: "Australia",
//       isSubscribed: true
//     },
//     {
//       name: "Sarah Lee",
//       email: "sarah.lee@example.com",
//       password: "password123",
//       avatar: "https://dummyimage.com/100x100/000/fff&text=Sarah",
//       role: "publisher",
//       country: "USA",
//       isSubscribed: false
//     },
//     {
//       name: "John Martinez",
//       email: "john.martinez@example.com",
//       password: "password123",
//       avatar: "https://dummyimage.com/100x100/000/fff&text=John",
//       role: "advertiser",
//       country: "Spain",
//       isSubscribed: true
//     },
//     {
//       name: "Michael Scott",
//       email: "michael.scott@example.com",
//       password: "password123",
//       avatar: "https://dummyimage.com/100x100/000/fff&text=Michael",
//       role: "publisher",
//       country: "USA",
//       isSubscribed: false
//     },
//     {
//       name: "Rachel Green",
//       email: "rachel.green@example.com",
//       password: "password123",
//       avatar: "https://dummyimage.com/100x100/000/fff&text=Rachel",
//       role: "advertiser",
//       country: "USA",
//       isSubscribed: true
//     }
//   ];
  

//   const ads = await advertisementModel.insertMany([
//     {
//       image: "https://dummyimage.com/600x400/000/fff&text=Ad4",
//       title: "New Year Party Essentials",
//       subtitle: "Everything you need for the best celebration",
//       content: "Get all your party essentials delivered with free shipping.",
//       createdBy: "67fa3577ac39df75170f68ea", // Replace with actual user ObjectId from `users` array
//       status: "approved",
//       clicks: 150,
//       revenue: 620.40,
//       impressions: 1300
//     },
//     {
//       image: "https://dummyimage.com/600x400/000/fff&text=Ad5",
//       title: "Fitness Equipment Sale",
//       subtitle: "Work out from home!",
//       content: "Get 20% off on all fitness equipment. Stay fit at home.",
//       createdBy: "67fa2f7fc0ff1eb55181721e", // Replace with actual user ObjectId from `users` array
//       status: "pending",
//       clicks: 80,
//       revenue: 310.50,
//       impressions: 1100
//     }
//   ]);

//   console.log(`✅ Inserted ${users.length} users and ${ads.length} ads`);
//   process.exit(0);
// };

// seed();

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "https://adsmangfront.vercel.app",
  credentials: true,
};

app.use(cors(corsOptions));         // allow CORS on all routes
app.options("*", cors(corsOptions)); // allow preflight requests

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