import Doctor from "../models/DoctorSchema.js";


// update Doctor functionalities
export const updateDoctor = async (req, res) => {
    const id = req.params.id;

    try {
        const updateDoctor = await Doctor.findByIdAndUpdate (id, 
             
            { $set: req.body },
            { new: true }
        );

        res.status(200).json(
            {
                success : true,
                messase : "Doctor updated successfully",
                data : updateDoctor,
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

// delete Doctor functionalities
export const deleteDoctor = async (req, res) => {
    const id = req.params.id;

    try {
       await Doctor.findByIdAndDelete (
            id,
        );

        res.status(200).json(
            {
                success : true,
                messase : "Doctor deleted successfully",
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

// get single Doctor functionalities
export const getSingleDoctor = async (req, res) => {
    const id = req.params.id;

    try {
        const doctor = await Doctor.findById(id).select("-password");

        res.status(200).json(
            {
                success : true,
                messase : "Doctor found successfully",
                data : doctor,
            }
        );
    } catch (err) {
        res.status(404).json(
            {
                success : false,
                messase : "Erorr! Doctor not found",
            }
        );
    }
};

// get all Doctor functionalities
export const getAllDoctor = async (req, res) => {

    try {

        const {query} = req.query;
        let doctors;

        if(query){
            doctors = await Doctor.find({
            isApproved: 'approved', 
            $or: [
                {name: {$regex: query, $options: 'i'}}, 
                { specialization: {$regex: query, $options: 'i'}},
                ],
            }).select("-password");
        } else {
          doctors = await Doctor.find ({isApproved: "approved"}).select("-password");
        }

        res.status(200).json(
            {
                success : true,
                messase : "Doctor found",
                data : doctors,
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