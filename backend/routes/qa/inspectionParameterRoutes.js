import express from 'express';
import {  
   createInspectionParameter,
   getInspectionParameterById,
   updateInspectionParameter,
   deleteInspectionParameter,
   getAllInspectionParameters,
   getAllMasterDataForInspectionParameter
 } from '../../controllers/qa/InspectionParamertsController.js';


import { protect, admin } from './../../middleware/authMiddleware.js';

const router = express.Router();

router
   .route('/all')
   .get(protect, getAllInspectionParameters) //GET /api/qa/inspectionparams/all
   
router
   .route('/masterdata')
   .get(protect, getAllMasterDataForInspectionParameter) //GET /api/qa/inspectionparams/masterdata

router
    .route('/:id')
    .get(protect, getInspectionParameterById) //GET /api/qa/inspectionparams/:id
    .delete(protect, deleteInspectionParameter) //DELETE /api/qa/inspectionparams/:id
    .put(protect, updateInspectionParameter) //PUT /api/qa/inspectionparams/:id
	
router
    .route('/')
    .post(protect, createInspectionParameter) //POST /api/qa/inspectionparams
	
export default router;