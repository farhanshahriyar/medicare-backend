import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js"; // routes=> auth.js
import userRoute from "./routes/user.js"; // routes=> user.js
import doctorRoute from "./routes/doctor.js"; // routes=> doctor.js
import reviewRoute from "./routes/review.js"; // routes=> review.js
import bookingRoute from "./routes/booking.js"; // routes=> booking.js
import { MongoClient } from "mongodb";


const timeSlotsArray = ['9.00am', '10.00am', '11.00am', '12.00pm', '1.00pm', '2.00pm', '3.00pm', '4.00pm', '5.00pm', '6.00pm', '7.00pm', '8.00pm'];

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const corsOptions = {
    origin: true
};


// all get requests here


const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const reserved = client.db('test').collection('reserved');
const appointment = client.db('test').collection('appointment');
const feedback = client.db('test').collection('feedback');
app.get("/", (req, res) => {
    res.send("Api is working perfectly");
});


// connect to mongodb
mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
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
// Use the booking routes
app.use("/api/v1/booking", bookingRoute); //confused konta hbe route!!

app.get('/reserverd', async (req, res) => {
    res.send(await reserved.find().toArray());
});
app.post('/timeslot', async (req, res) => {
    console.log(req.body);
    const dates = (await appointment.find({ date: req.body.date, name: req.body.name }).toArray()).map(i => i.time);

    return res.send({ data: timeSlotsArray.filter(i => !dates.includes(i)) });
});
app.post('/make-appointment', async (req, res) => {
    try {
        const result = await appointment.insertOne(req.body);
        if (result.acknowledged) {
            return res.send({
                success: true,
                messase: "Appointment done successfully",
            });
        } else {
            return res.status(500).json(
                {
                    success: false,
                    messase: "Internal server error, try again later",
                }
            );
        }
    }
    catch (err) {
        res.status(500).json(
            {
                success: false,
                messase: "Internal server error, try again later",
            }
        );
    }
});
app.get('/doctor/:name', async (req, res) => {
    try {
        const data = await reserved.findOne({ name: req.params.name.split('-').join(' ') });

        return res.send(data);
    }
    catch (err) {
        res.status(500).json(
            {
                success: false,
                messase: "Internal server error, try again later",
            }
        );
    }
});

app.get('/get-feedback/:name', async (req, res) => {
    try {
        const data = await feedback.find({ name: req.params.name }).toArray();
        return res.send(data);
    }
    catch (err) {
        res.status(500).json(
            {
                success: false,
                messase: "Internal server error, try again later",
            }
        );
    }
});
app.get('/get-appointment/:email', async (req, res) => {
    try {
        const data = await appointment.find({ 'user.email': req.params.email }).toArray();
        return res.send(data);
    }
    catch (err) {
        res.status(500).json(
            {
                success: false,
                messase: "Internal server error, try again later",
            }
        );
    }
});
app.post('/add-review', async (req, res) => {
    try {
        const data = await feedback.insertOne(req.body);
        if (data.acknowledged) {
            return res.send(data);
        } else {
            res.status(500).json(
                {
                    success: false,
                    messase: "Internal server error, try again later",
                }
            );
        }
    }
    catch (err) {
        res.status(500).json(
            {
                success: false,
                messase: "Internal server error, try again later",
            }
        );
    }
});
// listen to port
app.listen(port, () => {
    connectDB();
    console.log("Server is running on port: " + port);
});

