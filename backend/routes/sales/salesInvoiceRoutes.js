import express from 'express';

import { 
   createSalesInvoice,
   getSalesInvoiceById,
   updateSalesInvoice,
   deleteSalesInvoice,
   getAllSalesInvoices,
   getAllSalesInvoicesWithTax,
   getAllMasterDataForSalesInvoice,
   getAllInvoicesForCustomerId,
   getInvoicePDF,
   getSIDetailsByLine,
   getSIDetailsByDispatch,
   gethsnImpactedInvoices
} from "../../controllers/sales/salesInvoiceController.js";

import { protect, admin } from '../../middleware/authMiddleware.js'

const router = express.Router();

router
   .route('/all')
   .get(protect, getAllSalesInvoices) //GET /api/salesinvoice/all

router
   .route('/withtax')
   .get(protect, getAllSalesInvoicesWithTax) //GET /api/salesinvoice/withtax

router
   .route('/hsnimpact')
   .get(protect, gethsnImpactedInvoices) //GET /api/salesinvoice/withtax

router
   .route('/masterdata')
   .get(protect, getAllMasterDataForSalesInvoice) //GET /api/salesinvoice/masterdata

router
   .route('/invoicedetails')
   .get(protect, getSIDetailsByLine) //GET /api/salesinvoice/invoicedetails

router
   .route('/invoicedetailsbydispatch')
   .get(protect, getSIDetailsByDispatch) //GET /api/salesinvoice/invoicedetailsbydispatch
   
router
   .route('/printpdf')
   .get(protect, getInvoicePDF) //GET /api/salesinvoice/masterdata

router
   .route('/customer/:id')
   .get(protect, getAllInvoicesForCustomerId) //GET /api/salesinvoice/customer/:id

router
   .route('/:id')
   .get(protect, getSalesInvoiceById) //GET /api/salesinvoice/:id
   .delete(protect, deleteSalesInvoice) //DELETE /api/salesinvoice/:id
   .put(protect, updateSalesInvoice) //PUT /api/salesinvoice/:id

router
   .route('/')
   .post(protect, createSalesInvoice) //POST /api/salesinvoice

export default router;
