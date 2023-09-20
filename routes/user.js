import express from 'express';
import { updateUser, deleteUser, getAllUser, getSingleUser } from '../controllers/userController.js';


const router = express.Router();

// routes of users
router.get("/", getAllUser);
router.get("/:id", getSingleUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;