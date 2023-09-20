import express from 'express';
import { updateDoctor, deleteDoctor, getAllDoctor, getSingleDoctor } from '../controllers/doctorController.js';


const router = express.Router();

// routes of users
router.get("/", getAllDoctor);
router.get("/:id", getSingleDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;