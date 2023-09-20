import User from "../models/UserSchema.js";


// update user functionalities
export const updateUser = async (req, res) => {
    const id = req.params.id;

    try {
        const updateUser = await User.findByIdAndUpdate (id, 
             
            { $set: req.body },
            { new: true }
        );

        res.status(200).json(
            {
                success : true,
                messase : "User updated successfully",
                data : updateUser,
            }
        );
    } catch (err) {
        res.status(500).json(
            {
                success : false,
                messase : "Internal server error, try again later",
            }
        );
    }
};

// delete user functionalities
export const deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
       await User.findByIdAndDelete (
            id,
        );

        res.status(200).json(
            {
                success : true,
                messase : "User deleted successfully",
            }
        );
    } catch (err) {
        res.status(500).json(
            {
                success : false,
                messase : "Internal server error! failed to delete, try again later",
            }
        );
    }
};

// get single user functionalities
export const getSingleUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findById (id,);

        res.status(200).json(
            {
                success : true,
                messase : "User found successfully",
                data : user,
            }
        );
    } catch (err) {
        res.status(404).json(
            {
                success : false,
                messase : "Erorr! User not found",
            }
        );
    }
};

// get all user functionalities
export const getAllUser = async (req, res) => {

    try {
        const users = await User.find ({}).select("-password");

        res.status(200).json(
            {
                success : true,
                messase : "User found",
                data : users,
            }
        );
    } catch (err) {
        res.status(404).json(
            {
                success : false,
                messase : "Erorr! User not found",
            }
        );
    }
};