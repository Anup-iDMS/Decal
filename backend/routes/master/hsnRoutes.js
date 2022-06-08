import express from 'express';
import { 
   createHSN,
   getHSNById,
   updateHSN,
   deleteHSN,
   getAllHSNs
} from '../../controllers/master/hsnController.js';

import { protect, admin } from '../../middleware/authMiddleware.js'

const router = express.Router();

router
    .route('/all')
    .get(protect, getAllHSNs) //GET /api/hsnsac/all

router
    .route('/:id')
    .get(protect, getHSNById) //GET /api/hsnsac/:id
    .delete(protect, deleteHSN) //DELETE /api/hsnsac/:id
    .put(protect, updateHSN) //PUT /api/hsnsac/:id
	
	
router
    .route('/')
    .post(protect, createHSN) //POST /api/hsnsac

export default router;