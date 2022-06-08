import express from 'express';
import { 
  registerCompany,
  getAdminDashboard,
  getAllUsersList,
  getAllCompaniesList,
  updateCompany,
  updateUser,
  registerUser,
  getUserById,
  deleteUser,
  deleteCompany,
  getCompanyById 
} from '../../controllers/master/adminController.js';
import { protect, admin, superAdmin } from '../../middleware/authMiddleware.js'

const router = express.Router();

router
    .route('/dashboard')
    .get(protect, getAdminDashboard)

router
  .route('/companies')
  .get(protect, superAdmin, getAllCompaniesList)

router
  .route('/company')
  .post(protect, superAdmin, registerCompany)

router
  .route('/users')
  .get(protect, superAdmin, getAllUsersList)
  .post(protect, superAdmin, registerUser)

router
  .route('/users/:id')
  .get(protect, superAdmin, getUserById)
  .delete(protect, superAdmin, deleteUser)
  .put(protect, superAdmin, updateUser)

router
  .route('/companies/:id')
  .get(protect, superAdmin, getCompanyById)
  .delete(protect, superAdmin, deleteCompany)
  .put(protect, superAdmin, updateCompany)

export default router;