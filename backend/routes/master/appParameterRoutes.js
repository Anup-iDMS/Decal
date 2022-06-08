import express from 'express';
import { 
   createAppParameter,
   getAppParameterById,
   updateAppParameter,
   deleteAppParameter,
   getAllAppParameters,
   getAllMasterDataForAppParameter 
} from './../../controllers/master/appParameterController.js';


import { protect, admin } from './../../middleware/authMiddleware.js';

const router = express.Router();

router
   .route('/all')
   .get(protect, getAllAppParameters) //GET /api/appparameters/all
   
router
   .route('/masterdata')
   .get(protect, getAllMasterDataForAppParameter) //GET /api/appparameters/masterdata

router
    .route('/:id')
    .get(protect, getAppParameterById) //GET /api/appparameters/:id
    .delete(protect, deleteAppParameter) //DELETE /api/appparameters/:id
    .put(protect, updateAppParameter) //PUT /api/appparameters/:id
	
router
    .route('/')
    .post(protect, createAppParameter) //POST /api/appparameters
	
export default router;