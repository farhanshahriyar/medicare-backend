import express from 'express';
import { updateDoctor, deleteDoctor, getAllDoctor, getSingleDoctor } from '../controllers/doctorController.js';

import { authenticate, restrict }  from '../auth/verifyToken.js';
import reviewRouter from './review.js';

const router = express.Router();

// nested route
router.use('/:doctorId/reviews', reviewRouter);

// routes of users
router.get("/", getAllDoctor);
router.get("/:id", getSingleDoctor);
router.put("/:id", authenticate, restrict(['doctor']), updateDoctor);
router.delete("/:id", authenticate, restrict(['doctor']), deleteDoctor);

export default router;