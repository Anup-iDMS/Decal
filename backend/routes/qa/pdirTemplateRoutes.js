import express from 'express';
import { 
   createPDIRTemplate,
   getPDIRTemplateById,
   updatePDIRTemplate,
   deletePDIRTemplate,
   getAllPDIRTemplates,
   getAllMasterDataForPDIRTemplate 
} from '../../controllers/qa/PDIRTemplateController.js';

import { protect, admin } from './../../middleware/authMiddleware.js';

const router = express.Router();

router
   .route('/all')
   .get(protect, getAllPDIRTemplates) //GET /api/qa/pdirtemplates/all
   
router
   .route('/masterdata')
   .get(protect, getAllMasterDataForPDIRTemplate) //GET /api/qa/pdirtemplates/masterdata

router
    .route('/:id')
    .get(protect, getPDIRTemplateById) //GET /api/qa/pdirtemplates/:id
    .delete(protect, deletePDIRTemplate) //DELETE /api/qa/pdirtemplates/:id
    .put(protect, updatePDIRTemplate) //PUT /api/qa/pdirtemplates/:id
	
router
    .route('/')
    .post(protect, createPDIRTemplate) //POST /api/qa/pdirtemplates
	
export default router;