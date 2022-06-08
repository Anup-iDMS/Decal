import express from 'express';
import { protect, admin, superAdmin } from '../../middleware/authMiddleware.js';
import { 
  massCustomerUpload, 
  registerCustomer,
  getCustomerProfile,
  getCustomerById,
  getCustomers,
  getAllMasterDataForCustomer,
  updateCustomer
} from '../../controllers/master/customerControllers.js';

const router = express.Router();

router
  .route('/xlstojson')
  .post(massCustomerUpload)

router
  .route('/masterdata')
  .get(protect, getAllMasterDataForCustomer) //GET /api/customers/masterdata

router
  .route('/')
  .get(protect, getCustomers)
  .post(protect, registerCustomer)

router
  .route('/profile')
  .get(protect, getCustomerProfile) //PUT /api/customers/:id

router
  .route('/:id')
  .get(protect, getCustomerById)
  .put(protect, updateCustomer)



export default router;