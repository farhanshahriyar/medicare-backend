import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = user => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET_KEY, {
        expiresIn: '15d'
    });
};


// register controller
export const register = async (req, res) => {
    const { email, password, name, role, photo, gender } = req.body;
    try {

        let user = await User.findOne({ email }) || await Doctor.findOne({ email });

        // if (role === 'patient') {
        //     user = await User.findOne({ email });
        // } else if (role === 'doctor') {
        //     user = await Doctor.findOne({ email });
        // }

        // check if user already exists
        if (user) {
            return res.status(400).json({
                error: 'User already exists'
            });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (role === 'patient') {
            user = new User({
                email,
                password: hashedPassword,
                name,
                role,
                photo,
                gender
            });
        }

        if (role === 'doctor') {
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
            message: 'User registered successfully',
            data: user
        });

    } catch (err) {
        // console.log(err);
        res.status(500).json({
            success: false, error: 'Internal server error, try again later'
        });
    }
};



// login controller
export const login = async (req, res) => {
    const { email } = req.body;

    try {

        let user = null;
        const patient = await User.findOne({ email });
        const doctor = await Doctor.findOne({ email });

        if (patient) {
            user = patient;
        }
        else if (doctor) {
            user = doctor;
        }

        // check if user exists
        if (!user) {
            return res.status(404).json({
                error: 'User does not exist'
            });
        }

        // compare password
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                status: false,
                error: 'Invalid credentials'
            });
        }

        // generate token
        // const token = generateToken(user);
        // const { password, role, appointments, ...rest } = user._doc;

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            // token,
            // user: rest,
            data: user
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false, error: 'Failed to login, try again later'
        });
    }
};