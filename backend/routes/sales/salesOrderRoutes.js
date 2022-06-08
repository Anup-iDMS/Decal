import express from 'express';
import { 
   createSalesOrder,
	getSalesOrderById,
	updateSalesOrder,
	deleteSalesOrder,
	getAllSalesOrders,
    getAllMasterDataForSalesOrder,
    getAllJCMastersForReports,
    getSODetailsByLine,
    getCancelSODetailsByLine,
    getBackOrdersBySO,
    getBackOrdersByJC,
    getCustomerOpenSalesOrders,
    getBalancedQtyBySO,
    updateCancelSOLineQty
} from '../../controllers/sales/salesOrderController.js';


import { protect, admin } from '../../middleware/authMiddleware.js'

const router = express.Router();

router
    .route('/all')
    .get(protect, getAllSalesOrders) //GET /api/salesorders/all

router
    .route('/masterdata')
    .get(protect, getAllMasterDataForSalesOrder) //GET /api/salesorders/masterdata

router
    .route('/jcmasterdata')
    .get(protect, getAllJCMastersForReports) //GET /api/salesorders/jcmasterdata
    
router
    .route('/details')
    .get(protect, getSODetailsByLine) //GET /api/salesorders/details

router
    .route('/cancelso')
    .get(protect, getCancelSODetailsByLine) //GET /api/salesorders/cancelso
    
router
    .route('/balancedqtybyso')
    .get(protect, getBalancedQtyBySO) //GET /api/salesorders/balancedqtybyso

router
    .route('/cancelsolineqty')
    .get(protect, updateCancelSOLineQty) //GET /api/salesorders/cancelsolineqty

router
    .route('/backorderbyso')
    .get(protect, getBackOrdersBySO) //GET /api/salesorders/backorderbyso

router
    .route('/backorderbyjc')
    .get(protect, getBackOrdersByJC) //GET /api/salesorders/backorderbyjc

router
    .route('/opensos')
    .get(protect, getCustomerOpenSalesOrders) //GET /api/salesorders/backorderbyjc

router
    .route('/:id')
    .get(protect, getSalesOrderById) //GET /api/salesorders/:id
    .delete(protect, deleteSalesOrder) //DELETE /api/salesorders/:id
    .put(protect, updateSalesOrder) //PUT /api/salesorders/:id
	
	
router
    .route('/')
    .post(protect, createSalesOrder) //POST /api/salesorders
	
export default router;