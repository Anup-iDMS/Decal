import express from 'express';

import { 
   createDRN,
   getDRNById,
   updateDRN,
   deleteDRN,
   getAllUnApprovedDRNs,
   getAllMasterDataForDRN,
   getAllOpenDRNs,
   getAllApprovedDRNs,
   getRejectedDRNs
} from "../../controllers/drn/drnController.js";

import { protect, admin } from '../../middleware/authMiddleware.js'

const router = express.Router();

router
   .route('/all')
   .get(protect, getAllUnApprovedDRNs) //GET /api/drn/all

router
   .route('/open')
   .get(protect, getAllOpenDRNs) //GET /api/drn/open

router
   .route('/approved')
   .get(protect, getAllApprovedDRNs) //GET /api/drn/approved

router
   .route('/rejected')
   .get(protect, getRejectedDRNs) //GET /api/drn/rejected

router
   .route('/masterdata')
   .get(protect, getAllMasterDataForDRN) //GET /api/drn/masterdata

router
   .route('/:id')
   .get(protect, getDRNById) //GET /api/drn/:id
   .delete(protect, deleteDRN) //DELETE /api/drn/:id
   .put(protect, updateDRN) //PUT /api/drn/:id

router
   .route('/')
   .post(protect, createDRN) //POST /api/drn

export default router;


