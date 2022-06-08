import express from 'express';
import { 
   createIssue,
	getIssueById,
	updateIssue,
	deleteIssue,
	getAllIssues,
   getAllMasterDataForIssue
} from './../../controllers/master/issueController.js';

import { protect, admin } from './../../middleware/authMiddleware.js';

const router = express.Router();

router
   .route('/masterdata')
   .get(protect, getAllMasterDataForIssue) //GET /api/issues/masterdata

router
   .route('/all')
   .get(protect, getAllIssues) //GET /api/issues/all
   
router
    .route('/:id')
    .get(protect, getIssueById) //GET /api/issues/:id
    .delete(protect, deleteIssue) //DELETE /api/issues/:id
    .put(protect, updateIssue) //PUT /api/issues/:id
	
router
    .route('/')
    .post(protect, createIssue) //POST /api/issues
	
export default router;