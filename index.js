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

// all put request here
// all post request here
// all delete request here
// all patch request here
// all delete request here


app.listen(port, () => {
    console.log("Server is running on port: " + port);
});