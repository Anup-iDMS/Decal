import express from 'express';
import { 
   registerCompany,
   getCompanyById,
   updateCompany,
   deleteCompany,
   getAllCompany 
} from '../../controllers/master/companyController.js';

import { protect, admin } from '../../middleware/authMiddleware.js'

const router = express.Router();

router
    .route('/all')
    .get(protect, getAllCompany) //GET /api/company/all

router
    .route('/:id')
    .get(protect, getCompanyById) //GET /api/company/:id
    .delete(protect, deleteCompany) //DELETE /api/company/:id
    .put(protect, updateCompany) //PUT /api/company/:id

router.post("/", registerCompany)

export default router;