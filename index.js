import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const corsOptions = {
    origin: true
};


// all get requests here

app.get("/", (req, res) => {
    res.send("Api is working perfectly");
});

// connect to mongodb
mongoose.set('strictQuery', false)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
    })
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.log(err);
        console.log("something went wrong while connecting to mongodb");
    }
};

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.listen(port, () => {
    connectDB();
    console.log("Server is running on port: " + port);
});

