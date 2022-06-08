import express from 'express';
import { 
   createSAC,
   getSACById,
   updateSAC,
   deleteSAC,
   getAllSACs
} from '../../controllers/master/sacController.js';

import { protect, admin } from '../../middleware/authMiddleware.js'

const router = express.Router();

router
    .route('/all')
    .get(protect, getAllSACs) //GET /api/sac/all

router
    .route('/:id')
    .get(protect, getSACById) //GET /api/sac/:id
    .delete(protect, deleteSAC) //DELETE /api/sac/:id
    .put(protect, updateSAC) //PUT /api/sac/:id
	
	
router
    .route('/')
    .post(protect, createSAC) //POST /api/sac

export default router;