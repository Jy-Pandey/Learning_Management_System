import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./database/db.js";
import cors from "cors";

dotenv.config({});
//Call database connect here
connectDB();

const app = express();
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true, //
    limit: "16kb",
  })
);

// Static files serve karta hai
app.use(express.static("public"));

app.use(cookieParser());
// CORS (Cross-Origin Resource Sharing) ek browser security feature hai jo ek origin se dusre origin pe requests ko restrict ya allow karta hai.
app.use(cors({
    origin: "http://localhost:5173", // frontend ka origin
    credentials: true, // if you're using cookies
  })
);


// routes
import userRouter from "./routes/user.route.js"
import courseRouter from "./routes/course.route.js"
import mediaRouter from "./routes/uploadMedia.js"
import purchaseRouter from "./routes/coursePurchase.route.js"
import courseProgressRouter from "./routes/courseProgress.route.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/courses", courseRouter)
app.use("/api/v1/media", mediaRouter)
app.use("/api/v1/purchase", purchaseRouter)
app.use("/api/v1/progress", courseProgressRouter);


// Default middleware
app.use("/", (_, res, next) => {
  res.send("Welcome to LMS project");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
  console.log(`Server is running on http://localhost:${PORT}`);
})