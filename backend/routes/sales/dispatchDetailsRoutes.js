import express from 'express';
import {
   updateDeliveryNoteAndCreateDispatchDetails,
   getAllDispatchDetails, 
   getDispatchDetailsById, 
   updateDispatchDetails,
   deleteDispatchDetails,
   getAllMasterDataForDispatchDetails
} from '../../controllers/sales/deliveryNoteController.js';
import { protect, admin } from '../../middleware/authMiddleware.js'

const router = express.Router();

router
   .route('/all')
   .get(protect, getAllDispatchDetails) //GET /api/dispatchdetails/all

router
   .route('/masterdata')
   .get(protect, getAllMasterDataForDispatchDetails) //GET /api/dispatchdetails/masterdata

router
   .route('/updatedispatch/:id')
   .put(protect, updateDeliveryNoteAndCreateDispatchDetails)   

router
   .route('/:id')
   .get(protect, getDispatchDetailsById) //GET /api/dispatchdetails/:id
   .put(protect, updateDispatchDetails) //PUT /api/dispatchdetails/:id
   .delete(protect, deleteDispatchDetails) //DELETE /api/dispatchdetails/:id

export default router;