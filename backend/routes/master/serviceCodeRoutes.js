import express from 'express';
import { 
   createServiceCode,
   getServiceCodeById,
   updateServiceCode,
   deleteServiceCode,
   getAllServiceCodes,
   getAllMasterDataForServiceCode
} from '../../controllers/master/serviceCodeController.js';

import { protect, admin } from '../../middleware/authMiddleware.js'

const router = express.Router();

router
   .route('/all')
   .get(protect, getAllServiceCodes) //GET /api/servicecode/all

router
   .route('/masterdata')
   .get(protect, getAllMasterDataForServiceCode) //GET /api/servicecode/masterdata

router
   .route('/:id')
   .get(protect, getServiceCodeById) //GET /api/servicecode/:id
   .delete(protect, deleteServiceCode) //DELETE /api/servicecode/:id
   .put(protect, updateServiceCode) //PUT /api/servicecode/:id
	
	
router
   .route('/')
   .post(protect, createServiceCode) //POST /api/servicecode

export default router;