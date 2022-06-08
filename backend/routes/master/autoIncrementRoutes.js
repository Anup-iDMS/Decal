import express from 'express';
import { 
   createAutoIncrement,
   getAutoIncrementById,
   updateAutoIncrement,
   deleteAutoIncrement,
   getAllAutoIncrements
} from './../../controllers/master/autoIncrementController.js';

import { protect, admin } from './../../middleware/authMiddleware.js';

const router = express.Router();

router
   .route('/all')
   .get(protect, getAllAutoIncrements) //GET /api/autoincrement/all
   
router
    .route('/:id')
    .get(protect, getAutoIncrementById) //GET /api/autoincrement/:id
    .delete(protect, deleteAutoIncrement) //DELETE /api/autoincrement/:id
    .put(protect, updateAutoIncrement) //PUT /api/autoincrement/:id
	
router
    .route('/')
    .post(protect, createAutoIncrement) //POST /api/autoincrement
	
export default router;