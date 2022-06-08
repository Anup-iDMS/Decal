import express from 'express';
import { 
   createPDIR,
   getPDIRById,
   updatePDIR,
   deletePDIR,
   getAllPDIRs,
   getAllMasterDataForPDIR 
} from '../../controllers/qa/PDIRController.js';

import { protect, admin } from './../../middleware/authMiddleware.js';

const router = express.Router();

router
   .route('/all')
   .get(protect, getAllPDIRs) //GET /api/qa/pdir/all
   
router
   .route('/masterdata')
   .get(protect, getAllMasterDataForPDIR) //GET /api/qa/pdir/masterdata

router
    .route('/:id')
    .get(protect, getPDIRById) //GET /api/qa/pdir/:id
    .delete(protect, deletePDIR) //DELETE /api/qa/pdir/:id
    .put(protect, updatePDIR) //PUT /api/qa/pdir/:id
	
router
    .route('/')
    .post(protect, createPDIR) //POST /api/qa/pdir
	
export default router;