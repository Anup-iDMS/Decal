import express from 'express';

import { 
   createFGMI,
   getFGMIById,
   updateFGMI,
   deleteFGMI,
   getAllFGMIs,
   getAllMasterDataForFGMI,
   getFGMIBatchedByJCId,
   updateFGMIThruCorrection
} from '../../controllers/production/fgmiController.js';

import { protect, admin } from '../../middleware/authMiddleware.js'

const router = express.Router();

router
    .route('/jc')
    .get(protect, getFGMIBatchedByJCId) //GET /api/fgmi/jc

router
    .route('/all')
    .get(protect, getAllFGMIs) //GET /api/fgmi/all

router
    .route('/fgcorrection/:fgmiId')
    .put(protect, updateFGMIThruCorrection) //GET /api/fgmi/fgcorrection

router
    .route('/masterdata')
    .get(protect, getAllMasterDataForFGMI) //GET /api/fgmi/masterdata

router
    .route('/:id')
    .get(protect, getFGMIById) //GET /api/fgmi/:id
    .delete(protect, deleteFGMI) //DELETE /api/fgmi/:id
    .put(protect, updateFGMI) //PUT /api/fgmi/:id
	
	
router
    .route('/')
    .post(protect, createFGMI) //POST /api/fgmi

export default router;