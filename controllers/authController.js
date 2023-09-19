import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js'
import jwt  from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// register controller
export const register = async (req, res) => {
    const { email , password, name, role, photo, gender } = req.body;
    try {

        let user = null;

        if (role === 'patient') {
            user = await User.findOne({ email });
        } else if (role === 'doctor') {
            user = await Doctor.findOne({ email });
        }

        // check if user already exists
        if (user) {
            return res.status(400).json({
                error: 'User already exists'
            });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if(role==='patient') {
            user = new User({
                email,
                password: hashedPassword,
                name,
                role,
                photo,
                gender
            });
        }

        if(role==='doctor') {
            user = new Doctor({
                email,
                password: hashedPassword,
                name,
                role,
                photo,
                gender
            });
        }

        // save user to db
        await user.save();
        res.status(200).json({
            success: true,
            message: 'User registered successfully'
        });

    } catch (err) {
        // console.log(err);
        res.status(500).json({
            success: false, message: 'Internal server error, try again later'
        });
    }
};
// login controller
export const login = async (req, res) => {
    try {

    } catch (err) {
        console.log(err);
    }
}