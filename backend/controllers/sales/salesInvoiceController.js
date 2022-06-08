import asyncHandler from 'express-async-handler';
import SalesInvoice from './../../models/sales/salesInvoiceModel.js';
import AutoIncrement from './../../models/autoincrement/autoIncrementModel.js';
import { SALES_INVOICE_MODULE_PREFIX } from '../../config/moduleConstants.js';
import { 
   getCurrentFinancialYear, 
   getFirstDayOfFiscalYear, 
   getFirstDayOfMonth, 
   getLastDayOfFiscalYear, 
   getLastDayOfMonth 
} from './../../utils/utility.js';
import { updateDRNOnInvoiceCreation } from '../drn/drnController.js';
import { getHSNByCode } from '../master/hsnController.js';
import { updateSOInvoicedQty } from './salesOrderController.js';
import { sendMailForSalesInvoiceApproval } from './../../mails/salesinvoiceMails.js';

import puppeteer from 'puppeteer';
import DeliveryNote from './../../models/sales/deliveryNoteModel.js';
import { findJCMasterById } from '../master/jcMasterController.js';
import { createMessageRecord } from '../message/messageController.js';

// @desc    Create new SalesInvoice Record
// @route   POST /api/salesinvoice
// @access  Private

const createSalesInvoice = asyncHandler(async (req, res) => {
   //console.log("1. Inside createSalesInvoice function ------------>")
   let totalSalesInvoiceValue = 0;
   let salesInvoiceDetails = [];
   const {
      salesInvoiceNumber,
      drnNumber,
      drnId,
      customer,
      paymentTerms,
      billState,
      billPinCode,
      shipState,
      shipPinCode,
      drnDetails,
      supplierAddressIndex,
      supplierAddress,
      customerBillingAddressIndex,
      customerBillingAddress,
      customerShipingAddressIndex,
      customerShipingAddress
	} = req.body;

   //console.log("1. Sales Invocie Details are ==========>", drnDetails)
  
   //const values  = [...salesInvoiceDetails];
   //values.shift();

   //const newSalesInvoiceDetails = [...values]
   let outputIGST = 0.00;
   let outputCGST = 0.00;
   let outputSGST = 0.00;
   let outputUGST = 0.00;
   let totalTax = 0.00;

   let index = 0;
   for (const salesInvoice  of drnDetails) {
      let newSalesInvoice = {};

      //console.log("Looping Thru SalesInvoice Details and SalesInvoice details are for index ", index)
      newSalesInvoice.salesInvoiceLineNumber = (index+1);
      newSalesInvoice.soNo = salesInvoice.soNo._id
      newSalesInvoice.soLineNumber = salesInvoice.soLineNumber
      newSalesInvoice.batchId = salesInvoice.batchId
      newSalesInvoice.batchDate = salesInvoice.batchDate
      newSalesInvoice.jcNo = salesInvoice.jcNo._id
      newSalesInvoice.dispatchQty = salesInvoice.dispatchQty
      newSalesInvoice.invoicedQty = salesInvoice.dispatchQty
      newSalesInvoice.salesInvoiceUnitRate = salesInvoice.drnUnitRate
      newSalesInvoice.salesInvoiceLineValue = salesInvoice.drnLineValue;

      newSalesInvoice.igstAmt = salesInvoice.igstAmt;
      newSalesInvoice.cgstAmt = salesInvoice.cgstAmt;
      newSalesInvoice.sgstAmt = salesInvoice.sgstAmt;
      newSalesInvoice.ugstAmt = salesInvoice.ugstAmt;

      ////console.log(newSalesInvoice)
      salesInvoiceDetails.push(newSalesInvoice);

      totalSalesInvoiceValue += parseFloat(salesInvoice.drnLineValue)

      outputIGST += parseFloat(salesInvoice.igstAmt)
      outputCGST += parseFloat(salesInvoice.cgstAmt)
      outputSGST += parseFloat(salesInvoice.sgstAmt)
      outputUGST += parseFloat(salesInvoice.ugstAmt)
      index++;
   }
   
   ////console.log("2. NEW Sales Invocie Details are ==========>", salesInvoiceDetails)
   //console.log("1. Preparing the SalesInvoice record INsert")
   totalTax = outputIGST + outputCGST + outputSGST + outputUGST;
   const salesInvoice = new SalesInvoice({
		company: req.user.company,
		createdBy: req.user._id,
		updatedBy: req.user._id,
      salesInvoiceNumber,
      drnNumber,
      salesInvoiceDate: new Date(),
      customer,
      paymentTerms,
      billState,
      billPinCode,
      shipState,
      shipPinCode,
      salesInvoiceTotalAmount: totalSalesInvoiceValue,
      salesInvoiceTotalIGSTAmount: outputIGST,
      salesInvoiceTotalCGSTAmount: outputCGST,
      salesInvoiceTotalSGSTAmount: outputSGST,
      salesInvoiceTotalUGSTAmount: outputUGST,
      salesInvoiceTotalTaxAmount: totalTax,
      salesInvoiceTotalAmountWithTax: (totalSalesInvoiceValue+totalTax),
      salesInvoiceDetails,
      supplierAddressIndex,
      supplierAddress,
      customerBillingAddressIndex,
      customerBillingAddress,
      customerShipingAddressIndex,
      customerShipingAddress
	});
   //console.log("2. Now printing SalesInvoice record to be inserted")
   ////console.log(salesInvoice)
   //console.log("----------------------------------------------------")
   try {
		const createSalesInvoice = await salesInvoice.save();
		////console.log("Created REcord is >>>>>> ", createSalesInvoice);
		if (createSalesInvoice) {
         const aiv = await AutoIncrement.setNextId(SALES_INVOICE_MODULE_PREFIX)
         ////console.log("Before Returning Sales Invocie Data --------->")
         //update DRN Number
         const updatedDRN = await updateDRNOnInvoiceCreation(drnId, req.user._id);
         //update Sales Order for Dispatch Qty
         //updatedBy, soId, soLineNumber, updateJCId, action, dispatchQty
         //console.log("--------------------- Finally Updating Sales Order -------------------------------")
         for (const salesInvoice  of drnDetails) {
            let newSalesInvoice = {};
      
            //console.log("Looping Thru SalesInvoice Details and UPDATING SALES ORDER ", index)
            updateSOInvoicedQty(
               req.user._id, 
               salesInvoice.soNo._id, 
               salesInvoice.soLineNumber, 
               salesInvoice.jcNo._id, 
               "CREATE", 
               salesInvoice.dispatchQty
            )
         }
         //create a message queue
         const message = await createMessageRecord(
            req.user.company, 
            req.user._id, 
            req.user._id,
            "INVOICECREATE",
            createSalesInvoice._id,
            createSalesInvoice.salesInvoiceNumber,
            "N",
            "MAIL"
         );
         //send mail on Sales Invoice Generation
         // try {
         //    //console.log("************* before sending the mail ********** ")
         //    let sidet = await findSalesInvoiceById(createSalesInvoice._id)
         //    const email = sendMailForSalesInvoiceApproval(sidet)
         //    //console.log("SALES INVOICE has been AFTER triggering the mail", email)
         // } catch (error) {
         //    //console.log("Error in sending mail when Invoice is Generated....")
         // }
         res.status(201).json(createSalesInvoice)
      } else {
         res.status(400)
         throw new Error('Invalid SalesInvoice data')
      }
		//res.status(201).json(createSalesInvoice);
    } catch (error) {
		//console.log("Inside create SalesInvoice while creating error ==== ", error)
		res.status(400)
		throw new Error('Error in creating Sales Order Record')
    }
 
})

// @desc    Get SalesInvoice Record by ID
// @route   GET /api/salesinvoice/:id
// @access  Private

const getSalesInvoiceById = asyncHandler(async (req, res) => {
   console.log("2. Inside getSalesInvoiceById function ------------>")
   const salesInvoiceDetails = await SalesInvoice.findById(req.params.id)
                              .populate('customer', 'custName custCode custBillingAddress custShipingAddress custGST custContactPersonName custContactPersonNumber')
                              .populate('salesInvoiceDetails.soNo', 'soNumber soDate poNumber soTargetDate soDetails')
                              .populate('salesInvoiceDetails.jcNo', 'jcDescription jcProdCode hsn unit customerPartNumber jcCustomerDetails')
                              .exec()

   if (salesInvoiceDetails) {

      let index = 0;
      let salesInvoice =  JSON.parse(JSON.stringify(salesInvoiceDetails));
      for (const sid of salesInvoice.salesInvoiceDetails) {
         sid.hsnDetails = {}
         let srs = await getHSNByCode(sid.jcNo.hsn)
         sid.hsnDetails = srs;

         if(salesInvoice.customer.custCode === "C0022") {
            for (const sd of sid.soNo.soDetails) {
               //console.log(`Customer Code is ${salesInvoice.customer.custCode} and SO is ${sid.soNo.soNumber} and line Number is ${sd.lineNumber} and JC No is ${sd.jcNo}`)
               if(sid.jcNo._id.trim() === sd.jcNo.trim()) {
                  //console.log(`^^^^^^^^ Found the Matching JC NO ~~~~~~~ ${sd.jcNo}`)
                  if(sd.customerPONumber !== undefined && sd.customerPONumber !== "-") {
                     //console.log("inside if ---XX---XX___")
                     sid.soNo.poNumber = sd.customerPONumber 
                  } else if(sid.jcNo.jcCustomerDetails[0].customerPONumber !== undefined && sid.jcNo.jcCustomerDetails[0].customerPONumber !== "-") {
                     //console.log("inside ELSE ---OO---OO___")
                     sid.soNo.poNumber = sid.jcNo.jcCustomerDetails[0].customerPONumber;      
                  }
               }
            }
         }

         index++;
      }
      //console.log("SALES INVOICE DETAILS ARE ", salesInvoice)
      //console.log("SALES INVOICE DETAILS ARE salesInvoiceDetails[0].soNo ", salesInvoice.salesInvoiceDetails[0].soNo)
      //console.log("SALES INVOICE DETAILS ARE salesInvoiceDetails[0].soNo.soDetails ", salesInvoice.salesInvoiceDetails[0].soNo.soDetails)
      res.json(salesInvoice)
   } else {
      res.status(404)
      throw new Error('Record Not Found')
   }
})

export const findSalesInvoiceById = asyncHandler(async (id) => {
   ////console.log("2. Inside getSalesInvoiceById function ------------>")
   const salesInvoiceDetails = await SalesInvoice.findById(id)
                              .populate('customer', 'custName custCode custBillingAddress custShipingAddress custGST')
                              .populate('salesInvoiceDetails.soNo', 'soNumber soDate poNumber soTargetDate soDetails')
                              .populate('salesInvoiceDetails.jcNo', 'jcDescription jcProdCode hsn unit customerPartNumber jcCustomerDetails')
                              .exec()

   return salesInvoiceDetails;
   
})


// @desc    Update SalesInvoice Record
// @route   PUT /api/salesinvoice/:id
// @access  Private
const updateSalesInvoice = asyncHandler(async (req, res) => { 
   ////console.log("3. Inside updateSalesInvoice function ------------>")
})

// @desc    Delete a SalesInvoice Record
// @route   DELETE /api/salesinvoice/:id
// @access  Private
const deleteSalesInvoice = asyncHandler(async (req, res) => { 
   ////console.log("4. Inside deleteSalesInvoice function ------------>")
})

// @desc    Get all SalesInvoice Records
// @route   GET /api/salesinvoice/all
// @access  Private
const getAllSalesInvoices = asyncHandler(async (req, res) => {
   ////console.log("5. Inside getAllSalesInvoices function ------------>")
   const pageSize = 10000
   const page = Number(req.query.pageNumber) || 1

   const count = await SalesInvoice.countDocuments()
   ////console.log("Total records count are ==== ", count)

   const salesInvoices = await SalesInvoice.find({})
                     .sort({ salesInvoiceNumber:-1 })
                     .populate('customer', 'custName custCode')
                     .populate('soDetails.jcNo', 'jcDescription jcCustomerDetails')
                     .limit(pageSize)
                     .skip(pageSize * (page - 1))


   ////console.log("Total SalesInvoice are ==== ", salesInvoices)
   ////console.log("Page Number is ==== ", page)
   ////console.log("Total pages are ==== ", Math.ceil(count / pageSize))
	////console.log(salesInvoices)
	
   res.json({ salesInvoices, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get all SalesInvoice Records With Tax
// @route   GET /api/salesinvoice/withtax
// @access  Private
const getAllSalesInvoicesWithTax = asyncHandler(async (req, res) => {
   ////console.log("5. Inside getAllSalesInvoicesWithTax function ------------>")
   const pageSize = 10000
   const page = Number(req.query.pageNumber) || 1

   const count = await SalesInvoice.countDocuments()
   ////console.log("Total records count are ==== ", count)
   let findQuery = {}
   //let startDate = req.query.startDate;
   if(req.query.startDate === "undefined" && req.query.endDate === "undefined") {
      let firstDay = getFirstDayOfMonth();
      let lastDay = getLastDayOfMonth();

      let year = firstDay.getFullYear();
      let month = firstDay.getMonth();
      let date = firstDay.getDate();

      let year1 = lastDay.getFullYear();
      let month1 = lastDay.getMonth();
      let date1 = lastDay.getDate();

      findQuery["salesInvoiceDate"] = { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
   }

   if(req.query.startDate !== "undefined") {
      if(req.query.startDate.trim().length > 0) {
         let year = new Date(req.query.startDate).getFullYear();
         let month = new Date(req.query.startDate).getMonth();
         let date = new Date(req.query.startDate).getDate();

         //findQuery["createdAt"] = { $gte: new Date(year, month, date) }
         if(req.query.endDate.trim().length > 0) {
            let year1 = new Date(req.query.endDate).getFullYear();
            let month1 = new Date(req.query.endDate).getMonth();
            let date1 = new Date(req.query.endDate).getDate();
   
            findQuery["salesInvoiceDate"] = { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
         } else {
            let year1 = new Date().getFullYear();
            let month1 = new Date().getMonth();
            let date1 = new Date().getDate();
            findQuery["salesInvoiceDate"] = { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
         }
      }
   }

   //let endDate = req.query.endDate;
   if(req.query.endDate !== "undefined") {
      if(req.query.endDate.trim().length > 0) {
         let year = new Date(req.query.endDate).getFullYear();
         let month = new Date(req.query.endDate).getMonth();
         let date = new Date(req.query.endDate).getDate();

         if(req.query.startDate != "undefined") {
            if(req.query.startDate.trim().length === 0) {
               findQuery["salesInvoiceDate"] = { $lte: new Date(year, month, date) }
            }
            
         } 
      }
   }

   const salesInvoices = await SalesInvoice.find(findQuery)
                     .sort({ salesInvoiceNumber:-1 })
                     .populate('customer', 'custName custCode')
                     .populate('soDetails.jcNo', 'jcDescription jcCustomerDetails')
                     .limit(pageSize)
                     .skip(pageSize * (page - 1))


   ////console.log("Total SalesInvoice are ==== ", salesInvoices)
   ////console.log("Page Number is ==== ", page)
   ////console.log("Total pages are ==== ", Math.ceil(count / pageSize))
	////console.log(salesInvoices)
	
   res.json({ salesInvoices, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get all Required Master Data for SalesInvoice Screen
// @route   GET /api/salesinvoice/masterdata
// @access  Private
const getAllMasterDataForSalesInvoice = asyncHandler(async (req, res) => {
   ////console.log("6. Inside getAllMasterDataForSalesInvoice function ------------>")
   let autoIncrementedSINo = "";
	const autoIncrementedNo = await AutoIncrement.getNextId(SALES_INVOICE_MODULE_PREFIX)
   ////console.log("autoIncrementedNo === ", autoIncrementedNo)
   let currentFinancialYear = getCurrentFinancialYear();
   ////console.log("1. Inside getAllMasterDataForSalesInvoice and current fiscal year is ",currentFinancialYear)

	if(autoIncrementedNo < 10) {
      autoIncrementedSINo = `DT/${currentFinancialYear}/000${autoIncrementedNo}`
   } else if(autoIncrementedNo < 100) {
      autoIncrementedSINo = `DT/${currentFinancialYear}/00${autoIncrementedNo}`
   } else if(autoIncrementedNo < 1000) {
      autoIncrementedSINo = `DT/${currentFinancialYear}/0${autoIncrementedNo}`
   } else {
      autoIncrementedSINo = `DT/${currentFinancialYear}/${autoIncrementedNo}`
   }
   ////console.log("2. Inside getAllMasterDataForSalesInvoice and autoIncrementedSINo is ",autoIncrementedSINo)
	res.json({ autoIncrementedSINo })
})

// @desc    Get all Required Master Data for SalesInvoice Screen
// @route   GET /api/salesinvoice/customer/:id
// @access  Private
const getAllInvoicesForCustomerId = asyncHandler(async (req, res) => {
   ////console.log("Customer ID is ", req.params.id)
   const salesInvoices = await SalesInvoice.find({ customer: req.params.id })
   .sort({ _id:-1 })
   .populate('customer', 'custName custCode')
   .populate('salesInvoiceDetails.jcNo', 'jcDescription customerPartNumber artUOM adWidth adHeight adArea jcCustomerDetails')
   .populate('salesInvoiceDetails.soNo', 'soNumber soDate poNumber soTargetDate soDetails')
   ////console.log(salesInvoices)
   res.json(salesInvoices)
})

// @desc    Get all SalesInvoice Records
// @route   none. Used Internally in Dispatch and Delivery Modules
// @access  Private
const getSalesInvoicesForDelivery = asyncHandler(async () => {
   const salesInvoices = await SalesInvoice.find({ salesInvoiceStatus: "O" })
   .sort({ _id:-1 })
   .populate('customer', 'custName custCode')
   .populate('salesInvoiceDetails.jcNo', 'jcDescription jcCustomerDetails')
   .populate('salesInvoiceDetails.soNo', 'soNumber soDate poNumber soTargetDate soDetails')
   return salesInvoices;
})

// @desc    Get all SalesInvoice Records
// @route   none. Used Internally in Dispatch and Delivery Modules
// @access  Private
const getSalesInvoicesForDispatch = asyncHandler(async () => {
   const salesInvoices = await SalesInvoice.find({ salesInvoiceStatus: "DN" })
   .sort({ _id:-1 })
   .populate('customer', 'custName custCode')
   .populate('salesInvoiceDetails.jcNo', 'jcDescription jcCustomerDetails')
   .populate('salesInvoiceDetails.soNo', 'soNumber soDate poNumber soTargetDate soDetails')

   return salesInvoices;
})

const updateSalesInvoiceStatusAfterDelivery = asyncHandler(async (id, userId) => {
   ////console.log("1. Inside updateSalesInvoiceStatusAfterDelivery sales Invoice Number is ", id)
   ////console.log("1. Inside updateSalesInvoiceStatusAfterDelivery userId ", userId)
   const salesInvoice = SalesInvoice.findById(id)
   if(salesInvoice) {
      try {
         const updatedSalesInvoice = await SalesInvoice.findOneAndUpdate({ _id: id }, { salesInvoiceStatus:"DN", updatedBy: userId });
         ////console.log("2. After updating Sales Invoice Status ===== ", updatedSalesInvoice)
         return updatedSalesInvoice
      } catch (error) {
         ////console.log("Inside error while creating error ==== ", error)
			throw new Error('Error in Updating Sales Invoice Status')
      }
   } else  {
      throw new Error("Sales Invoice Not Found")
   }
})

const updateSalesInvoiceStatusAfterDispatch = asyncHandler(async (id, userId) => {
   const salesInvoice = SalesInvoice.findById(id)
   if(salesInvoice) {
      try {
         const updatedSalesInvoice = await SalesInvoice.findOneAndUpdate({ _id: id }, { salesInvoiceStatus:"DD", updatedBy: userId });
         ////console.log("2. After updating Sales Invoice Status ===== ", updatedSalesInvoice)
         return updatedSalesInvoice
      } catch (error) {
         ////console.log("Inside error while creating error ==== ", error)
			throw new Error('Error in Updating Sales Invoice Status')
      }
   } else  {
      throw new Error("Sales Invoice Not Found")
   }
})

/** Dashboard Functions Start */
const getYTDNetSale = asyncHandler(async () => {
   let ytdNetSale = 0;
  
   let firstDateOfFiscalYear = getFirstDayOfFiscalYear();
   let lastDateOfFiscalYear = getLastDayOfFiscalYear();

   let year = new Date(firstDateOfFiscalYear).getFullYear();
   let month = new Date(firstDateOfFiscalYear).getMonth();
   let date = new Date(firstDateOfFiscalYear).getDate();

   let year1 = new Date(lastDateOfFiscalYear).getFullYear();
   let month1 = new Date(lastDateOfFiscalYear).getMonth();
   let date1 = new Date(lastDateOfFiscalYear).getDate();

   let findQuery = {
      "salesInvoiceDate": { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
   };

   const siDetailsRecords = await SalesInvoice.find(findQuery).sort({ _id:-1 })

   if(siDetailsRecords.length > 0) {
      siDetailsRecords.forEach(si => {
         ytdNetSale += si.salesInvoiceTotalAmount
      })
   }
   return ytdNetSale.toFixed(2);

})

const getMTDNetSale = asyncHandler(async () => {
   let mtdNetSale = 0;

   let firstDateOfMonth = getFirstDayOfMonth();
   let lastDateOfMonth = getLastDayOfMonth();

   let year = new Date(firstDateOfMonth).getFullYear();
   let month = new Date(firstDateOfMonth).getMonth();
   let date = new Date(firstDateOfMonth).getDate();

   let year1 = new Date(lastDateOfMonth).getFullYear();
   let month1 = new Date(lastDateOfMonth).getMonth();
   let date1 = new Date(lastDateOfMonth).getDate();

   let findQuery = {
      "salesInvoiceDate": { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
   };

   const siDetailsRecords = await SalesInvoice.find(findQuery).sort({ _id:-1 })

   if(siDetailsRecords.length > 0) {
      siDetailsRecords.forEach(si => {
         mtdNetSale += si.salesInvoiceTotalAmount
      })
   }
   return mtdNetSale.toFixed(2);
})

const getMonthlySalesData = asyncHandler(async () => {
   //console.log("1. Inside getMonthlySalesData ------------>")
   let ytdNetSale = 0;

   const monthsArray = [ 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March' ]
   const salesData = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 , 0 ]
   
   let firstDateOfFiscalYear = getFirstDayOfFiscalYear();
   let lastDateOfFiscalYear = getLastDayOfFiscalYear();

   let year = new Date(firstDateOfFiscalYear).getFullYear();
   let month = new Date(firstDateOfFiscalYear).getMonth();
   let date = new Date(firstDateOfFiscalYear).getDate();

   let year1 = new Date(lastDateOfFiscalYear).getFullYear();
   let month1 = new Date(lastDateOfFiscalYear).getMonth();
   let date1 = new Date(lastDateOfFiscalYear).getDate();

   let findQuery = {
      "salesInvoiceDate": { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
   };

   const result = await SalesInvoice.aggregate([
      { $match: { 
            salesInvoiceDate: { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
         } 
      },
      {
         $group: {
            _id: { "year_month": { $substrCP: [ "$salesInvoiceDate", 0, 7 ] } }, 
            //count: { $sum: 1 }
            count: { $sum: "$salesInvoiceTotalAmount" }
            // _id: '$salesInvoiceDate',
            // count: { $sum: 1 }
         }
      },
      {
         $sort: { "_id.year_month": 1 }
      },
      { 
         $project: { 
             _id: 0, 
             count: 1, 
             month_year: { 
                 $concat: [ 
                    { $arrayElemAt: [ monthsArray, { $subtract: [ { $toInt: { $substrCP: [ "$_id.year_month", 5, 2 ] } }, 4 ] } ] },
                  //   "-", 
                  //   { $substrCP: [ "$_id.year_month", 0, 4 ] }
                 ] 
             }
         } 
      },
      { 
            $group: { 
               _id: null, 
               data: { $push: { k: "$month_year", v: "$count" } }
            } 
      },
      {
         $project: { 
            data: { $arrayToObject: "$data" }, 
            _id: 0 
         } 
      }
     
   ]);
   ////console.log("@@@@@@@@@@@@@@@@@@ Result is      ==== ", result)

   if(result.length > 0) {
      const propertyNames = Object.keys(result[0].data);

      const propertyValues = Object.values(result[0].data);
      //console.log(propertyNames)
      //console.log(propertyValues);

      let n = 0;
      propertyNames.forEach(elem => {
         let index = monthsArray.indexOf(elem)
         // //console.log("Month is ", elem)
         // //console.log("Found Index is ", index)
         // //console.log("Matching Value ", propertyValues[n])
         salesData[index] = (propertyValues[n]/100000).toFixed(2)
         n++; 
         // //console.log("Month is ", elem)
         // monthsArray.forEach(m => {
         //    ////console.log(monthsArray.indexOf(elem))
         //    
         // });
      });
   
      let monthlySalesData = {"Months":monthsArray, "Sales" : salesData}
      //console.log(">>>>> ",monthlySalesData)
      return monthlySalesData;
   } else {
      let monthlySalesData = {"Months":monthsArray, "Sales" : []}
      return monthlySalesData;
   }

})

const getMonthlyPPMSalesData = asyncHandler(async () => {
   //console.log("1. Inside getMonthlyPPMSalesData ------------>")
   let ytdNetSale = 0;

   const monthsArray = [ 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March' ]
   const salesData = [ 206078, 156065, 135635, 0, 0, 0, 0, 0, 0, 0, 0 , 0 ]
   
   let firstDateOfFiscalYear = getFirstDayOfFiscalYear();
   let lastDateOfFiscalYear = getLastDayOfFiscalYear();

   let year = new Date(firstDateOfFiscalYear).getFullYear();
   let month = new Date(firstDateOfFiscalYear).getMonth();
   let date = new Date(firstDateOfFiscalYear).getDate();

   let year1 = new Date(lastDateOfFiscalYear).getFullYear();
   let month1 = new Date(lastDateOfFiscalYear).getMonth();
   let date1 = new Date(lastDateOfFiscalYear).getDate();

   let findQuery = {
      "salesInvoiceDate": { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
   };

   const result = await SalesInvoice.aggregate([
      { $unwind: "$salesInvoiceDetails" },
      { $match: { 
            salesInvoiceDate: { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
         } 
      },
      {
         $group: {
            
            _id: { "year_month": { $substrCP: [ "$salesInvoiceDate", 0, 7 ] } }, 
            //total: { $sum: 1 }
            total: { $sum: "$salesInvoiceDetails.dispatchQty" }
            // _id: '$salesInvoiceDate',
            // count: { $sum: 1 }
         }
      },
      {
         $sort: { "_id.year_month": 1 }
      },
      { 
         $project: { 
             _id: 0, 
             total: 1, 
             month_year: { 
                 $concat: [ 
                    { $arrayElemAt: [ monthsArray, { $subtract: [ { $toInt: { $substrCP: [ "$_id.year_month", 5, 2 ] } }, 4 ] } ] },
                  //   "-", 
                  //   { $substrCP: [ "$_id.year_month", 0, 4 ] }
                 ] 
             }
         } 
      },
      { 
            $group: { 
               _id: null, 
               data: { $push: { k: "$month_year", v: "$total" } }
            } 
      },
      {
         $project: { 
            data: { $arrayToObject: "$data" }, 
            _id: 0 
         } 
      }
     
   ]);
   //console.log("@@@@@@@@@@@@@@@@@@ Result is      ==== ", result)

   if(result.length > 0) {
      const propertyNames = Object.keys(result[0].data);

      const propertyValues = Object.values(result[0].data);
      //console.log(propertyNames)
      //console.log(propertyValues);

      let n = 0;
      propertyNames.forEach(elem => {
         let index = monthsArray.indexOf(elem)
         // //console.log("Month is ", elem)
         // //console.log("Found Index is ", index)
         // //console.log("Matching Value ", propertyValues[n])
         salesData[index] = (propertyValues[n])
         n++; 
         // //console.log("Month is ", elem)
         // monthsArray.forEach(m => {
         //    ////console.log(monthsArray.indexOf(elem))
         //    
         // });
      });
   
      let monthlySalesData = {"Months":monthsArray, "Sales" : salesData}
      //console.log(">>>>> getMonthlyPPMSalesData ",monthlySalesData)
      return monthlySalesData;
   } else {
      let monthlySalesData = {"Months":monthsArray, "Sales" : []}
      return monthlySalesData;
   }

})

/** Dashboard Functions End */

/** Reports functions start here */
// @desc    Get Sales Invoices by Line Level Details
// @route   GET /api/salesinvoice/invoicedetails
// @access  Private
const getSIDetailsByLine = asyncHandler(async (req, res) => {

   let salesInvoices = [];
   let findQuery = {};
   let jcId = req.query.jcId;

   //console.log("req.query.jcId >>>>>>>>>>> ", req.query.jcId)
   //console.log("req.query.startDate >>>>>>>>>>> ", req.query.startDate)
   //console.log("req.query.endDate >>>>>>>>>>> ", req.query.endDate)

   if(req.query.jcId !== undefined ) {
      //console.log("When JC IS IS NOT undefined :::::::: ", req.query.jcId)
      if(req.query.jcId.trim().length > 0) {
         findQuery["salesInvoiceDetails.jcNo"] = jcId;
      }
   }
   //let startDate = req.query.startDate;
   if(req.query.startDate !== undefined) {
      //console.log("When START DATE IS NOT undefined :::::::: ", req.query.jcId)
      if(req.query.startDate.trim().length > 0) {
         let year = new Date(req.query.startDate).getFullYear();
         let month = new Date(req.query.startDate).getMonth();
         let date = new Date(req.query.startDate).getDate();

         //findQuery["createdAt"] = { $gte: new Date(year, month, date) }
         if(req.query.endDate.trim().length > 0) {
            let year1 = new Date(req.query.endDate).getFullYear();
            let month1 = new Date(req.query.endDate).getMonth();
            let date1 = new Date(req.query.endDate).getDate();
   
            findQuery["salesInvoiceDate"] = { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
         } else {
            let year1 = new Date().getFullYear();
            let month1 = new Date().getMonth();
            let date1 = new Date().getDate();
            findQuery["salesInvoiceDate"] = { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
         }
      }
   }

   //let endDate = req.query.endDate;
   if(req.query.endDate !== undefined) {
      //console.log("When END DATE IS IS NOT undefined ^^^^^^ ", req.query.jcId)
      if(req.query.endDate.trim().length > 0) {
         let year = new Date(req.query.endDate).getFullYear();
         let month = new Date(req.query.endDate).getMonth();
         let date = new Date(req.query.endDate).getDate();

         if(req.query.startDate != "undefined") {
            if(req.query.startDate.trim().length === 0) {
               findQuery["salesInvoiceDate"] = { $lte: new Date(year, month, date) }
            }
            
         } 

        // findQuery["createdAt"] = { $lt: new Date(year, month, date) }
      }
   }
   //Date dt = new Date(req.query.startDate);
   

   //console.log("********* final FIND query is *********** ", findQuery)

   const siDetailsRecords = 
      await SalesInvoice.find(findQuery)
                     .sort({ salesInvoiceNumber:-1 })
                     .populate('customer', 'custName custCode')
                     .populate('salesInvoiceDetails.jcNo', '_id jcno jcDescription customerPartNumber jcCustomerDetails')
      
   if(siDetailsRecords.length > 0) {
      ////console.log("Sales Orders Length ", siDetailsRecords.length)
      siDetailsRecords.forEach(si => {
         si.salesInvoiceDetails.forEach(sidet => {
            let srs = {}
            
            ////console.log(`For Sales Order ${si.soNumber} line details are ${sidet.jcNo.jcDescription}`)
            srs.salesInvoiceNumber = si.salesInvoiceNumber
            srs.salesInvoiceDate = si.salesInvoiceDate
            srs.salesInvoiceLineNumber = sidet.salesInvoiceLineNumber;
            srs.jcId = sidet.jcNo._id;
            srs.jcNo = sidet.jcNo.jcno;
            srs.customerPartNumber = sidet.jcNo.customerPartNumber;
            srs.jcDescription = sidet.jcNo.jcDescription;
            srs.dispatchQty = sidet.dispatchQty;
            srs.salesInvoiceUnitRate = sidet.salesInvoiceUnitRate;
            srs.salesInvoiceLineValue = sidet.salesInvoiceLineValue;
            srs.name = si.customer.custName;
            salesInvoices.push(srs);
         })
      });
      
      res.json({ salesInvoices });
   } else {
      res.json({ salesInvoices:[] });
   }
   
})

/** Reports functions start here */
// @desc    Get Sales Invoices by Line Level Details
// @route   GET /api/salesinvoice/invoicedetailsbydispatch
// @access  Private
const getSIDetailsByDispatch = asyncHandler(async (req, res) => {

   let salesInvoices = [];
   let findQuery = {};
   let customerId = req.query.customerId;

   //console.log("req.query.customerId >>>>>>>>>>> ", req.query.customerId)
   //console.log("req.query.startDate >>>>>>>>>>> ", req.query.startDate)
   //console.log("req.query.endDate >>>>>>>>>>> ", req.query.endDate)

   if(req.query.customerId !== undefined ) {
      //console.log("When CUSTOMER IS IS NOT undefined :::::::: ", req.query.customerId)
      if(req.query.customerId.trim().length > 0) {
         findQuery["customer"] = customerId;
      }
   }
   //let startDate = req.query.startDate;
   if(req.query.startDate !== undefined) {
      //console.log("When START DATE IS NOT undefined :::::::: ", req.query.customerId)
      if(req.query.startDate.trim().length > 0) {
         let year = new Date(req.query.startDate).getFullYear();
         let month = new Date(req.query.startDate).getMonth();
         let date = new Date(req.query.startDate).getDate();

         //findQuery["createdAt"] = { $gte: new Date(year, month, date) }
         if(req.query.endDate.trim().length > 0) {
            let year1 = new Date(req.query.endDate).getFullYear();
            let month1 = new Date(req.query.endDate).getMonth();
            let date1 = new Date(req.query.endDate).getDate();
   
            findQuery["dispatchDate"] = { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
         } else {
            let year1 = new Date().getFullYear();
            let month1 = new Date().getMonth();
            let date1 = new Date().getDate();
            findQuery["dispatchDate"] = { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
         }
      }
   }

   //let endDate = req.query.endDate;
   if(req.query.endDate !== undefined) {
      //console.log("When END DATE IS IS NOT undefined ^^^^^^ ", req.query.customerId)
      if(req.query.endDate.trim().length > 0) {
         let year = new Date(req.query.endDate).getFullYear();
         let month = new Date(req.query.endDate).getMonth();
         let date = new Date(req.query.endDate).getDate();

         if(req.query.startDate != "undefined") {
            if(req.query.startDate.trim().length === 0) {
               findQuery["dispatchDate"] = { $lte: new Date(year, month, date) }
            }
            
         } 

        // findQuery["createdAt"] = { $lt: new Date(year, month, date) }
      }
   }
   //Date dt = new Date(req.query.startDate);
   

   //console.log("********* final FIND query is *********** ", findQuery)
   
   const siDetailsRecords = 
      await DeliveryNote.find(findQuery)
                     .sort({ salesInvoiceNumber:-1 })
                     .populate({
                        path: 'customer',
                        model: 'Customer',
                        select: 'custName'
                     })
                     .populate({
                        path: 'salesInvoiceNumber',
                        model: 'SalesInvoice',
                        select: 'salesInvoiceNumber salesInvoiceDate salesInvoiceDetails.dispatchQty salesInvoiceDetails.batchDate salesInvoiceDetails.dispatchQty',
                        populate:{
                           path:"salesInvoiceDetails.jcNo",
                           model:"JCMaster",
                           select: 'jcno jcDescription customerPartNumber'
                        }
                     })
                     // .populate('customer', 'custName')
                     // .populate('salesInvoiceNumber', 'salesInvoiceNumber salesInvoiceDate salesInvoiceDetails jcDescription')
                     // .populate('salesInvoiceNumber.salesInvoiceDetails.jcNo', '_id jcDescription')
   
   //console.log("Sales Invocies Found Length ", siDetailsRecords.length) 
  
   if(siDetailsRecords.length > 0) {
      let index = 0;
      for (const si of siDetailsRecords) {
         for (const sidet of si.salesInvoiceNumber.salesInvoiceDetails) {
            //console.log("--- batchDate ==== ", sidet)
            let srs = {};
            srs.salesInvoiceNumber = si.salesInvoiceNumber.salesInvoiceNumber
            
            var dateUTC = new Date(si.salesInvoiceNumber.salesInvoiceDate);
            var dateUTC = dateUTC.getTime() 
            var dateIST = new Date(dateUTC);

            srs.salesInvoiceDate = dateIST
            srs.name = si.customer.custName
            srs.jcNo = sidet.jcNo.jcno
            //let jcDetails = await findJCMasterById(sidet.jcNo);
            ////console.log("JC Details are ", jcDetails.jcDescription)
            ////console.log("JC Details are ", jcDetails)
            srs.jcDescription =  sidet.jcNo.jcDescription
            //srs.cpin = jcDetails.customerPartNumber === undefined?"-":jcDetails.customerPartNumber
            srs.cpin = sidet.jcNo.customerPartNumber === undefined?"-":sidet.jcNo.customerPartNumber
            //srs.batchDate = sidet.batchDate
            srs.batchDate = sidet.batchDate===undefined?null:new Date(new Date(sidet.batchDate).getTime())
            srs.dispatchQty = sidet.dispatchQty
            srs.deliveryNumber = si.deliveryNumber
            srs.transporter = si.transporter
            //srs.docketDate = si.docketDate===undefined?null:si.docketDate
            srs.docketDate = si.docketDate===undefined?null:new Date(new Date(si.docketDate).getTime())
            srs.docketNumber = si.docketNumber

            salesInvoices.push(srs);
            //let srs = await getHSNByCode(sid.jcNo.hsn)
            //sid.hsnDetails = srs;
            //index++;
         }
      }
      // await siDetailsRecords.forEach(async(si) => {
      //    si.salesInvoiceNumber.salesInvoiceDetails.forEach(async(sidet) => {
      //       let srs = {};
            
      //    })
      // })
      //
      res.json({ salesInvoices });
      
      //res.json({ siDetailsRecords });
   } else {
      res.json({ salesInvoices:[] });
   }
   
})
/** Reports functions end here */


// @desc    Get all Required Master Data for SalesInvoice Screen
// @route   GET /api/salesinvoice/printpdf
// @access  Private
const getInvoicePDF = asyncHandler(async (req, res) => {
   
   const browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
   });

   // Open a new page with the headless browser
   const page = await browser.newPage();
   //console.log("TOKEN ---------------> ", req.query.token)
   // Route the headless browser to the webpage for printing
   page.setExtraHTTPHeaders( {Authorization: `Bearer ${req.query.token}`}) 
   //await page.goto('https://www.decaltech.in/'); // add your url
   //await page.goto('http://localhost:3000/taxinvoice/6144451e3cd4582754a43f5d/edit'); // add your url
   ////console.log("$$$$$$$$$$$$$$$ Request User ", req.user)
   // enable request interception
   await page.setRequestInterception(true);
   // add header for the navigation requests
   page.on('request', request => {
     // Do nothing in case of non-navigation requests.
     if (!request.isNavigationRequest()) {
         request.continue();
         return;
      }
      // Add a new header for navigation request.
      const headers = request.headers();
      headers['X-Just-Must-Be-Request-In-Main-Request'] = 1;
      request.continue({ headers });
   });
   // navigate to the website
   await page.goto('https://www.erp-bizeliteinfotech.com/');

   //Print the page as pdf
   const buffer = await page.pdf({ 
      printBackground: true, 
      format: 'A4', 
      PreferCSSPageSize: true 
   }); 
   //console.log(">>>>>>>>>>>>>>. Readt to PRINT PDF file ================= ")
   ////console.log(buffer);
   // send the pdf
   res.type('application/pdf');
   //res.set('Content-Type','application/pdf');
   res.send(buffer);
   //res.json({message: buffer});

   // Close the headless browser
   browser.close();

   //res.json({message:"Print PDF"});
})

// @desc    Get all SalesInvoice Records With Tax
// @route   GET /api/salesinvoice/hsnimpact
// @access  Private
const gethsnImpactedInvoices = asyncHandler(async (req, res) => {
   let findQuery = {};
   let year1 = new Date().getFullYear();
   let month1 = new Date().getMonth();
   let date1 = new Date().getDate();
   findQuery["salesInvoiceDate"] = { $gte: new Date(2021, 9, 1), $lte: new Date(year1, month1, date1) }
   const salesInvoices = await SalesInvoice.find(findQuery)
                     .sort({ salesInvoiceNumber:1 })
                     .populate('customer', 'custName custCode')
                     .populate('salesInvoiceDetails.jcNo', 'jcDescription jcCustomerDetails hsn')
   //console.log("1. Total Number Of Invoices Created ", salesInvoices.length)
   let impactedInvoices = [];
   let impactedInvoicesDetails = [];
   let impactedInvoicesNo = [];
   for (const si of salesInvoices) {
      ////console.log("--X-X-X-X_ sid.jcNo.hsn = ", si)
      let impactedLineItems = 0;
      si.totalLineItems = si.salesInvoiceDetails.length;
      for (const sid of si.salesInvoiceDetails) {
         ////console.log("--X-X-X-X_ sid.jcNo.hsn = ", sid.jcNo.hsn)
         
         if(sid.jcNo.hsn === 49089000 || sid.jcNo.hsn === 49081000) {
            //console.log("--X-X-X-X_ sid.jcNo.hsn = ", sid.jcNo.hsn)
            //console.log("--X-X-X-X_ impactedLineItems = ", impactedLineItems)
            impactedLineItems++;
            if(!impactedInvoicesNo.includes(si.salesInvoiceNumber)) {
               impactedInvoicesNo.push(si.salesInvoiceNumber)
               impactedInvoices.push(si);
            } else {
               
            }
            si.impactedLineItems = impactedLineItems;
         }
        
      }
   }
   for (const si of impactedInvoices) {
      for (const sid of si.salesInvoiceDetails) {
         let srs = {}
         ////console.log("si ==== ", si)
         srs.salesInvoiceNumber = si.salesInvoiceNumber;
         srs.salesInvoiceDate = si.salesInvoiceDate;
         srs.customer = si.customer.custName;
         srs.jcDescription = sid.jcNo.jcDescription;
         srs.hsn = sid.jcNo.hsn;
         srs.invoicedQty = sid.invoicedQty;
         srs.igstAmt = sid.igstAmt;
         srs.cgstAmt = sid.cgstAmt;
         srs.sgstAmt = sid.sgstAmt;
         srs.ugstAmt = sid.ugstAmt;
         srs.salesInvoiceLineValue = sid.salesInvoiceLineValue;
         srs.salesInvoiceTotalAmount = si.salesInvoiceTotalAmount;
         srs.salesInvoiceTotalCGSTAmount = si.salesInvoiceTotalCGSTAmount;
         srs.salesInvoiceTotalSGSTAmount = si.salesInvoiceTotalSGSTAmount;
         srs.salesInvoiceTotalIGSTAmount = si.salesInvoiceTotalIGSTAmount;
         srs.salesInvoiceTotalTaxAmount = si.salesInvoiceTotalTaxAmount;
         srs.salesInvoiceTotalAmountWithTax = si.salesInvoiceTotalAmountWithTax;
         srs.totalLineItems = si.totalLineItems;
         srs.impactedLineItems = si.impactedLineItems;
   
         impactedInvoicesDetails.push(srs);
   
      }
   }
   //console.log("1. Total Number Of Impacted Invoices Created ", impactedInvoices.length)
   //res.json(impactedInvoices);
   res.json(impactedInvoicesDetails);
})

// @desc    Get all SalesInvoice Records With Tax
// @route   None
// @access  Private
const findAllInvoicesForADay = asyncHandler(async () => {
   console.log("----> have reached heer in findAllInvoicesForADay >>>>>>>>>>>>")
   let findQuery = {}
   let startDate = new Date();

   let invoicesCount = 0;
   let invoicesAmountWithTax = 0;
   let invoicesAmountWithoutTax = 0;

   let response = {};
   
   findQuery["salesInvoiceDate"] = { $gte: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()), 
      $lte: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()+1) }

   console.log("----> have reached heer in before firing query >>>>>>>>>>>>".yellow)
   const salesInvoices = await SalesInvoice.find(findQuery)
                     .sort({ salesInvoiceNumber:-1 })
                     console.log("----> have reached heer in AFTER firing query >>>>>>>>>>>>".white)
   if(salesInvoices.length > 0) {
      invoicesCount = salesInvoices.length;
         for (const si of salesInvoices) {
         invoicesAmountWithTax += si.salesInvoiceTotalAmount
         invoicesAmountWithoutTax += si.salesInvoiceTotalAmountWithTax
      }
   }
   console.log("----> all well leaving >>>>>>>>>>>>".pink)
   response['invoicesCount'] = invoicesCount;
   response['invoicesAmountWithTax'] = invoicesAmountWithTax;
   response['invoicesAmountWithoutTax'] = invoicesAmountWithoutTax;

   return response;
})

export {
   createSalesInvoice,
   getSalesInvoiceById,
   updateSalesInvoice,
   deleteSalesInvoice,
   getAllSalesInvoices,
   getAllSalesInvoicesWithTax,
   getAllMasterDataForSalesInvoice,
   getAllInvoicesForCustomerId,
   getSalesInvoicesForDelivery,
   getSalesInvoicesForDispatch,
   updateSalesInvoiceStatusAfterDelivery,
   updateSalesInvoiceStatusAfterDispatch,
   //dashboard functions
   getYTDNetSale,
   getMTDNetSale,
   getMonthlySalesData,
   getInvoicePDF,
   getMonthlyPPMSalesData,
   //reports
   getSIDetailsByLine,
   getSIDetailsByDispatch,
   gethsnImpactedInvoices,
   findAllInvoicesForADay
}