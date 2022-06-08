import express from 'express';

import { 
   createCreditNote,
	getCreditNoteById,
	updateCreditNote,
	getAllCreditNotes,
	getAllMasterDataForCreditNote,
   getAllCreditNotesWithTax
} from "../../controllers/sales/creditNoteController.js";

import { protect, admin } from '../../middleware/authMiddleware.js'

const router = express.Router();

router
   .route('/all')
   .get(protect, getAllCreditNotes) //GET /api/creditnote/all

router
   .route('/withtax')
   .get(protect, getAllCreditNotesWithTax) //GET /api/creditnote/withtax

router
   .route('/masterdata')
   .get(protect, getAllMasterDataForCreditNote) //GET /api/creditnote/masterdata

router
   .route('/:id')
   .get(protect, getCreditNoteById) //GET /api/creditnote/:id
   .put(protect, updateCreditNote) //PUT /api/creditnote/:id

router
   .route('/')
   .post(protect, createCreditNote) //POST /api/creditnote

export default router;