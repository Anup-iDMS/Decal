import express from 'express';
import { 
   createMessage,
   getAllMessages
} from '../../controllers/message/messageController.js';


import { protect, admin } from './../../middleware/authMiddleware.js';

const router = express.Router();

// router
//    .route('/masterdata')
//    .get(protect, getAllMasterDataForIssue) //GET /api/issues/masterdata

router
   .route('/all')
   .get(protect, getAllMessages) //GET /api/messages/all
   
// router
//     .route('/:id')
//     .get(protect, getIssueById) //GET /api/issues/:id
//     .delete(protect, deleteIssue) //DELETE /api/issues/:id
//     .put(protect, updateIssue) //PUT /api/issues/:id
	
router
    .route('/')
    .post(protect, createMessage) //POST /api/messages

    
export default router;