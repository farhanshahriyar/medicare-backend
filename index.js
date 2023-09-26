import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js"; // routes=> auth.js
import userRoute from "./routes/user.js"; // routes=> user.js
import doctorRoute from "./routes/doctor.js"; // routes=> doctor.js
import reviewRoute from "./routes/review.js"; // routes=> review.js

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
app.use('/api/v1/auth', authRoute); // application to use authRoute for any incoming http request to domain/api/v1/auth/ register or login
app.use('/api/v1/users', userRoute); // application to use userRoute for any incoming http request to domain/api/v1/user/ get, update, delete, get single user
app.use('/api/v1/doctors', doctorRoute); // application to use doctorRoute for any incoming http request to domain/api/v1/doctor/ get, update, delete, get single doctor
app.use('/api/v1/reviews', reviewRoute); // application to use reviewRoute for any incoming http request to domain/api/v1/review/ get, update, delete, get single review

// listen to port
app.listen(port, () => {
    connectDB();
    console.log("Server is running on port: " + port);
});

