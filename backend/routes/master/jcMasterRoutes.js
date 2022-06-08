import express from 'express';
import { protect, admin } from '../../middleware/authMiddleware.js'


import { 
  createJCMaster,
  getJCMasterById,
  updateJCMaster,
  deleteJCMaster,
  getJCMasters,
  getAllJCMasters,
  getAllMasterDataForJC,
  getCustomerJCs,
  getCustomerJCPOs,
  getJCMastersReport,
  getJCBulkUploadTemplate
} from '../../controllers/master/jcMasterController.js';

const router = express.Router();

router
  .route('/all')
  .get(protect, getAllJCMasters) //GET /api/jcmasters/all


router
  .route('/jcmasterreport')
  .get(protect, getJCMastersReport) //GET /api/jcmasters/jcmasterreport

router
  .route('/jcmasterbulktemplate')
  .get(protect, getJCBulkUploadTemplate) //GET /api/jcmasters/jcmasterbulktemplate

router
  .route('/po/customer/:id')
  .get(protect, getCustomerJCPOs) //GET /api/jcmasters/po/customer/:id
  
router
  .route('/customer/:id')
  .get(protect, getCustomerJCs) //GET /api/jcmasters/customer/:id

router
  .route('/masterdata')
  .get(protect, getAllMasterDataForJC) //GET /api/jcmasters/masterdata

router
  .route('/:id')
  .get(protect, getJCMasterById) //GET /api/jcmasters/:id
  .delete(protect, deleteJCMaster) //DELETE /api/jcmasters/:id
  .put(protect, updateJCMaster) //PUT /api/jcmasters/:id

router
  .route('/')
  .get(protect, getJCMasters)
  .post(protect, createJCMaster)


export default router;