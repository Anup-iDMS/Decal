import express from 'express';

import { 
   createJobCard,
   getJobCardById,
   updateJobCard,
   deleteJobCard,
   getAllJobCards,
   getAllMasterDataForJobCard,
   getYieldReport
} from '../../controllers/production/jobCardController.js';

import { protect, admin } from '../../middleware/authMiddleware.js'

const router = express.Router();

router
    .route('/all')
    .get(protect, getAllJobCards) //GET /api/jobcards/all
    
router
    .route('/yieldreport')
    .get(protect, getYieldReport) //GET /api/jobcards/yieldreport

router
    .route('/masterdata')
    .get(protect, getAllMasterDataForJobCard) //GET /api/jobcards/masterdata

router
    .route('/:id')
    .get(protect, getJobCardById) //GET /api/jobcards/:id
    .delete(protect, deleteJobCard) //DELETE /api/jobcards/:id
    .put(protect, updateJobCard) //PUT /api/jobcards/:id
	
	
router
    .route('/')
    .post(protect, createJobCard) //POST /api/jobcards

export default router;