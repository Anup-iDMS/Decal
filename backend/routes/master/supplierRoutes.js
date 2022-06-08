import express from 'express'
import { protect, admin, superAdmin } from '../../middleware/authMiddleware.js'
import {
  massSupplierUpload,
  registerSupplier,
  getSupplierProfile,
  findSupplierById,
  getSuppliers,
  getAllMasterDataForSupplier,
  updateSupplier,
  getSupplierById,
} from '../../controllers/master/supplierController.js'

const router = express.Router()

router.route('/xlstojson').post(massSupplierUpload)

router.route('/masterdata').get(protect, getAllMasterDataForSupplier) //GET /api/customers/masterdata

router.route('/').get(protect, getSuppliers).post(protect, registerSupplier)

router.route('/profile').get(protect, getSupplierProfile) //PUT /api/customers/:id

router.route('/:id').get(protect, getSupplierById).put(protect, updateSupplier)

export default router
