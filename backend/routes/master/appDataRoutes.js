import express from 'express';
import { 
   /** 1. Product Category Functions */
   createProdCategory,
   getProdCategoryById,
   updateProdCategory,
   deleteProdCategory,
   getProdCats,
   getAllProductCategories,
    /** 2. Product Code Functions */
    createProdCode,
    getProdCodeById,
    updateProdCode,
    deleteProdCode,
    getProdCodes,
    getAllProductCodes,
    getAllMasterDataForProductCode,
    /** 3. UOM Functions */
    createUOM,
    getUOMById,
    updateUOM,
    deleteUOM,
    getUOMs,
    getAllUOMs,
   /** 4. Machine Master Functions */
   createMachineMaster,
   getMachineMasterById,
   updateMachineMaster,
   deleteMachineMaster,
   getAllMachineMasters,
   getMachineMasters
} from '../../controllers/master/appControllers.js';

import { protect, admin } from '../../middleware/authMiddleware.js'

const router = express.Router();
/** 1. Product Category Routes */
router
  .route('/prodcat')
  .get(protect, getProdCats)
  .post(protect, createProdCategory)

router
  .route('/prodcat/all')
  .get(protect, getAllProductCategories)

router
  .route('/prodcat/:id')
  .get(protect, getProdCategoryById) //GET /api/prodcat/:id
  .delete(protect, deleteProdCategory) //DELETE /api/prodcat/:id
  .put(protect, updateProdCategory) //PUT /api/prodcat/:id

/** 2. Product Code Routes */
router
  .route('/prodcode')
  .get(protect, getProdCodes)
  .post(protect, createProdCode)

router
  .route('/prodcode/masterdata')
  .get(protect, getAllMasterDataForProductCode)

router
  .route('/prodcode/all')
  .get(protect, getAllProductCodes)

router
  .route('/prodcode/:id')
  .get(protect, getProdCodeById) //GET /api/prodcode/:id
  .delete(protect, deleteProdCode) //DELETE /api/prodcode/:id
  .put(protect, updateProdCode) //PUT /api/prodcode/:id

/** 3. UOM Routes */
router
  .route('/uom')
  .get(protect, getUOMs)
  .post(protect, createUOM)

router
  .route('/uom/all')
  .get(protect, getAllUOMs)

router
  .route('/uom/:id')
  .get(protect, getUOMById) //GET /api/uom/:id
  .delete(protect, deleteUOM) //DELETE /api/uom/:id
  .put(protect, updateUOM) //PUT /api/uom/:id

/** 4. Machine Master Routes */
router
  .route('/machinemaster')
  .get(protect, getMachineMasters)
  .post(protect, createMachineMaster)

router
  .route('/machinemaster/all')
  .get(protect, getAllMachineMasters)

router
  .route('/machinemaster/:id')
  .get(protect, getMachineMasterById) //GET /api/machinemaster/:id
  .delete(protect, deleteMachineMaster) //DELETE /api/machinemaster/:id
  .put(protect, updateMachineMaster) //PUT /api/machinemaster/:id

export default router;
