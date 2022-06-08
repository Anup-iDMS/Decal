import express from 'express';
import { 
   createInspectionMethod,
   getInspectionMethodById,
   updateInspectionMethod,
   deleteInspectionMethod,
   getAllInspectionMethods,
   getAllMasterDataForInspectionMethod 
} from '../../controllers/qa/InspectionMethodController.js';


import { protect, admin } from './../../middleware/authMiddleware.js';

const router = express.Router();

router
   .route('/all')
   .get(protect, getAllInspectionMethods) //GET /api/qa/inspectionmethods/all
   
router
   .route('/masterdata')
   .get(protect, getAllMasterDataForInspectionMethod) //GET /api/qa/inspectionmethods/masterdata

router
    .route('/:id')
    .get(protect, getInspectionMethodById) //GET /api/qa/inspectionmethods/:id
    .delete(protect, deleteInspectionMethod) //DELETE /api/qa/inspectionmethods/:id
    .put(protect, updateInspectionMethod) //PUT /api/qa/inspectionmethods/:id
	
router
    .route('/')
    .post(protect, createInspectionMethod) //POST /api/qa/inspectionmethods
	
export default router;