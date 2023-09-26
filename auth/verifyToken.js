import jwt from 'jsonwebtoken';
import Doctor from '../models/DoctorSchema.js';
import User from '../models/UserSchema.js';


export const authenticate = async (req, res, next) => {
    // get token from headers
    const authToken = req.headers.authorization;

    // check if token is available
    if (!authToken || !authToken.startsWith('Bearer')) {
        return res
        .status(401)
        .json({
            success: false,
            message: "No token, authorization denied"
        });
    }

    try {
        const token = authToken.split(' ')[1];
        // verify token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decodedToken.id;
        req.role = decodedToken.role;

        next(); // must call next() to pass the request to next middleware
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res
            .status(401)
            .json({
                message: "Token is expired"
            });
        }
        return res.status(401).json({
            success: false,

            message: "Token is not valid"
        });
    } 
}

export const restrict = roles=> async (req, res, next) => {
    const userId = req.userId;

    let user;

    const patient = await User.findById(userId);
    const doctor = await Doctor.findById(userId);

    if(patient) {
        user = patient;
    } if(doctor){
        user = doctor;
    }

    if(!roles.includes(user.role)) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to access this route"
        });
    }
    next();
}