import express from 'express';
import { 
   createDeliveryNote,
   getAllDeliveryNotes,
   deleteDeliveryNote,
   updateDeliveryNote,
   getDeliveryNoteById,
   getAllMasterDataForDeliveryNote
} from '../../controllers/sales/deliveryNoteController.js';
import { protect, admin } from '../../middleware/authMiddleware.js'

const router = express.Router();

router
   .route('/all')
   .get(protect, getAllDeliveryNotes) //GET /api/deliverynote/all
   
router
   .route('/masterdata')
   .get(protect, getAllMasterDataForDeliveryNote) //GET /api/deliverynote/masterdata

router
   .route('/:id')
   .get(protect, getDeliveryNoteById) //GET /api/deliverynote/:id
   .delete(protect, deleteDeliveryNote) //DELETE /api/deliverynote/:id
   .put(protect, updateDeliveryNote) //PUT /api/deliverynote/:id

router
   .route('/')
   .post(protect, createDeliveryNote) //POST /api/deliverynote

export default router;