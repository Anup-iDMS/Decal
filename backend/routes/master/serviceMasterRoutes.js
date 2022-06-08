import express from 'express';
import { protect, admin } from '../../middleware/authMiddleware.js'

import { 
   createServiceMaster,
	getServiceMasterById,
	updateServiceMaster,
	deleteServiceMaster,
	getAllServiceMasters,
	getAllMasterDataForServiceMaster,
} from '../../controllers/master/serviceMasterController.js';

const router = express.Router();

router
  .route('/all')
  .get(protect, getAllServiceMasters) //GET /api/servicemaster/all

router
  .route('/masterdata')
  .get(protect, getAllMasterDataForServiceMaster) //GET /api/servicemaster/masterdata

router
  .route('/:id')
  .get(protect, getServiceMasterById) //GET /api/servicemaster/:id
  .delete(protect, deleteServiceMaster) //DELETE /api/servicemaster/:id
  .put(protect, updateServiceMaster) //PUT /api/servicemaster/:id

router
  .route('/')
  .post(protect, createServiceMaster)


export default router;