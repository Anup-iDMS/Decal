import express from 'express';
import { 
   createPPMReport,
   getPPMReport,
   updatePPMReport
} from '../../controllers/qa/ppmReportController.js';

import { protect, admin } from './../../middleware/authMiddleware.js';

const router = express.Router();

router
    .route('/')
    .get(protect, getPPMReport) //GET /api/ppmreport
    .post(protect, createPPMReport) //POST /api/ppmreport

router
    .route('/:id')
    .put(protect, updatePPMReport) //PUT /api/ppmreport/:id
	
export default router;