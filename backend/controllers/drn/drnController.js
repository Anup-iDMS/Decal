import asyncHandler from 'express-async-handler';
import DRN from './../../models/drn/drnModel.js';
import AutoIncrement from '../../models/autoincrement/autoIncrementModel.js';
import { findCustomerById, getAllCustomers } from '../master/customerControllers.js';
import { getAllJCMasters, getCustomerSpecificJCs, getHSNDetailsForJCId } from '../master/jcMasterController.js';

import { DRN_MODULE_PREFIX } from '../../config/moduleConstants.js';
import { getHSNByCode } from '../master/hsnController.js';
import { updateFGMIThruDRNUpdate } from '../production/fgmiController.js';
import { updateSOBalanceQty } from '../sales/salesOrderController.js';
import { sendMailForDRNApproval } from './../../mails/applicationMails.js';

import { 
   getFirstDayOfFiscalYear,
   getFirstDayOfMonth,
   getLastDayOfMonth,
   getLastDayOfFiscalYear
} from '../../utils/utility.js';
import { createMessageRecord } from '../message/messageController.js';

// @desc    Create new DRN Record
// @route   POST /api/drn
// @access  Private

const createDRN = asyncHandler(async (req, res) => {
   //1. create a record in DRN table
   let totalDRNValue = 0;
   const {
      drnNumber,
      drnDate,
      customer,
      paymentTerms,
      supplierAddressIndex,
      supplierAddress,
      customerBillingAddressIndex,
      customerBillingAddress,
      customerShipingAddressIndex,
      customerShipingAddress,
      qaRemark,
      billState,
      billPinCode,
      shipState,
      shipPinCode,
      drnTotalAmount,
      drnDetails
	} = req.body;

   const values  = [...drnDetails];
   values.shift();

   const newDRNDetails = [...values]

   /** variable for GST calculations - START */
   let gst = 0.00;
   let igst = 0.00;
   let cgst = 0.00;
   let sgst = 0.00;

   let outputIGST = 0.00;
   let outputCGST = 0.00;
   let outputSGST = 0.00;
   let outputUGST = 0.00;

   let totalTaxableCGSTValue = 0;
   let totalTaxableSGSTValue = 0;
   let totalTaxableIGSTValue = 0;

   let totalInvoiceAmountWithGST = 0;
   let totalTax = 0;

   let supplierAndBuyerStateCodeMatching = false;

   const custDetails = await findCustomerById(customer);
   let hsnArray = [];
   let hsnDetailsArray = [];
   let hsnDetailsArray1 = [];
   
   let sellerStateCode = "27";
   let buyerStateCode = "00";
   buyerStateCode = custDetails.custGST.substring(0,2);
   
   if(buyerStateCode === sellerStateCode) {
      supplierAndBuyerStateCodeMatching = true;
   } else {
      //console.log("asdasdjkhasjdkahkjda")
   }
   
   /** variable for GST calculations - END */
   let newDRNDetails1 = [];
   let index = 0;
   for (const drn of newDRNDetails) {
      let srs = {}
      srs = {...drn}
      //console.log("Befoew Retrinign DRN Detailsa re ", srs)
      //console.log("-------------- JC ID IN DRN DETAILS  ----------- ", drn.jcNo)
      const hsnDetails = await getHSNDetailsForJCId(drn.jcNo);
      //console.log("HSN Details are ==== ", hsnDetails)
      srs.drnLineNumber = (index+1);
      srs.drnLineValue = drn.dispatchQty * drn.drnUnitRate;
      totalDRNValue += parseFloat(drn.dispatchQty * drn.drnUnitRate)
      if(!supplierAndBuyerStateCodeMatching) {
         srs.igstAmt = parseFloat((drn.dispatchQty * drn.drnUnitRate)*(hsnDetails.igstRate/100))
         srs.cgstAmt = 0
         srs.sgstAmt = 0
         srs.ugstAmt = 0
         outputIGST += parseFloat(((drn.dispatchQty * drn.drnUnitRate)*(hsnDetails.igstRate/100)))
         outputCGST += 0
         outputSGST += 0
         outputUGST += 0
      } else {
         srs.igstAmt = 0
         //console.log("??? CGST AMT ", parseFloat(((drn.dispatchQty * drn.drnUnitRate)*(hsnDetails.cgstRate/100))))
         //console.log("??? SGST AMT ", parseFloat(((drn.dispatchQty * drn.drnUnitRate)*(hsnDetails.sgstRate/100))))
         srs.cgstAmt = parseFloat(((drn.dispatchQty * drn.drnUnitRate)*(hsnDetails.cgstRate/100)))
         srs.sgstAmt = parseFloat(((drn.dispatchQty * drn.drnUnitRate)*(hsnDetails.sgstRate/100)))
         srs.ugstAmt = 0

         outputIGST += 0
         //console.log("outputCGST >>>>>>>>>>> ", Number(((drn.dispatchQty * drn.drnUnitRate)*(hsnDetails.cgstRate/100))).toFixed(2))
         //console.log("<<<<<<<<<< outputSGST >>>>>>>>>>> ", Number(((drn.dispatchQty * drn.drnUnitRate)*(hsnDetails.sgstRate/100))).toFixed(2))
         outputCGST += parseFloat(((drn.dispatchQty * drn.drnUnitRate)*(hsnDetails.cgstRate/100)))
         outputSGST += parseFloat(((drn.dispatchQty * drn.drnUnitRate)*(hsnDetails.sgstRate/100)))
         //outputCGST += Number(((drn.dispatchQty * drn.drnUnitRate)*(hsnDetails.cgstRate/100))).toFixed(2)
         //outputSGST += Number(((drn.dispatchQty * drn.drnUnitRate)*(hsnDetails.sgstRate/100))).toFixed(2)
         outputUGST += 0
      }
      newDRNDetails1.push(srs);
      index++;
      //console.log("AFTER Retrinign DRN Detailsa re ", srs)
   }
   //console.log("1. Preparing the DRN record INsert and detais are ", newDRNDetails1)
   //console.log("outputIGST === ", outputIGST)
   //console.log("outputSGST === ", outputCGST)
   //console.log("outputSGST === ", outputSGST)
   //console.log("outputUGST === ", outputUGST)
   
   totalTax = parseFloat(outputIGST)+parseFloat(outputCGST)+parseFloat(outputSGST)+parseFloat(outputUGST);
   
   //console.log("1. Total Tax is ", totalTax)
   
   const drn = new DRN({
		company: req.user.company,
		createdBy: req.user._id,
		updatedBy: req.user._id,
      drnNumber,
      drnDate,
      customer,
      paymentTerms,
      supplierAddressIndex,
      supplierAddress,
      customerBillingAddressIndex,
      customerBillingAddress,
      customerShipingAddressIndex,
      customerShipingAddress,
      qaRemark,
      billState,
      billPinCode,
      shipState,
      shipPinCode,
      drnTotalAmount: totalDRNValue,
      drnTotalCGSTAmount: outputCGST,
      drnTotalSGSTAmount: outputSGST,
      drnTotalIGSTAmount: outputIGST,
      drnTotalUGSTAmount: outputUGST,
      drnTotalTaxAmount: totalTax,
      drnDetails:newDRNDetails1
	});
   //console.log("2. Now printing DRN record to be inserted")
   //console.log(drn)
   //console.log("----------------------------------------------------")
   try {
		const createDRN = await drn.save();
		////console.log("Created REcord is >>>>>> ", createDRN);
		if (createDRN) {
         const aiv = await AutoIncrement.setNextId(DRN_MODULE_PREFIX)
         //update FGMI master
         for (const drndet  of drn.drnDetails) {
            //console.log("Updating FGMI for Batch for FGMI ID ==== ", drndet.batchId)
            //console.log("Updating FGMI for Batch for FGMI ID and QUANTITY ==== ", drndet.dispatchQty)
            const updateFGMI = await updateFGMIThruDRNUpdate(req.user._id, drndet.batchId, "CREATE", drndet.dispatchQty)
            //update Sales Order Balance Qty
            //updatedBy, soId, updateJCId, soLineNumber, action, dispatchQty
            const updatedSalesOrder = updateSOBalanceQty(
               req.user._id, 
               drndet.soNo, 
               drndet.soLineNumber, 
               drndet.jcNo, 
               "CREATE", 
               drndet.dispatchQty
            )
         }
         res.status(201).json(createDRN)
      } else {
         res.status(400)
         throw new Error('Invalid DRN data')
      }
		//res.status(201).json(createDRN);
    } catch (error) {
		//console.log("Inside create DRN while creating error ==== ", error)
		res.status(400)
		throw new Error('Error in creating Sales Order Record')
    }

   //2. update FGMI
   //3. update Sales Order (?)

})

// @desc    Get DRN Record by ID
// @route   GET /api/drn/:id
// @access  Private

const getDRNById = asyncHandler(async (req, res) => {
   //console.log("+++++++++++++++ Inside get DRN By Id and ID is ", req.params.id)
   
   const drnDetails = await DRN.findById(req.params.id)
                                       .populate('customer', 'custName custCode custBillingAddress custShipingAddress custGST customerAddress')
                                       .populate('drnDetails.soNo', 'soNumber soDate poNumber soTargetDate soDetails')
                                       .populate('drnDetails.jcNo', 'jcDescription jcProdCode hsn unit customerPartNumber jcCustomerDetails')
                                       .populate('drnDetails.batchId', 'fgmiNo batchQuantity')
                                       .exec()
    if (drnDetails) {
      //console.log("2.......DRN Record is .... ", drnDetails['drnDetails'])
      //   let hsnsac = await getHSNByCode(drn.drnDetails[0].jcNo.hsn)
      //   let drnDetailsNo = drn.drnDetails.length;
      let index = 0;
      let drn =  JSON.parse(JSON.stringify(drnDetails));
      for (const drd of drn.drnDetails) {
         ////console.log("Index is ", index)
         ////console.log("1....... HSN Details .... ", drd.jcNo.hsn)
         drd.hsnDetails = {}
         ////console.log("2.......DRN Record is .... ", drd.hsnDetails)
         let srs = await getHSNByCode(drd.jcNo.hsn)
         drd.hsnDetails = srs;
         ////console.log("3.......DRN Record  HSN Details is .... ", drd.hsnDetails)
         
         if(drn.customer.custCode === "C0022") {
            for (const sd of drd.soNo.soDetails) {
               //console.log(`Customer Code is ${drn.customer.custCode} and SO is ${drd.soNo.soNumber} and line Number is ${sd.lineNumber} and JC No is ${sd.jcNo}`)
               if(drd.jcNo._id.trim() === sd.jcNo.trim()) {
                  //console.log(`^^^^^^^^ Found the Matching JC NO ~~~~~~~ ${sd.jcNo}`)
                  if(sd.customerPONumber !== undefined && sd.customerPONumber !== "-") {
                     drd.soNo.poNumber = sd.customerPONumber 
                  } else if(drd.jcNo.jcCustomerDetails[0].customerPONumber !== undefined && drd.jcNo.jcCustomerDetails[0].customerPONumber !== "-") {
                     drd.soNo.poNumber = drd.jcNo.jcCustomerDetails[0].customerPONumber;      
                  }
               }
            }
         }

         index++;
      }
     // //console.log("3.......CLONE DRN Record is .... ", drn.drnDetails[0].hsnDetails)
      res.json(drn)
    } else {
        res.status(404)
        throw new Error('Record Not Found')
    }
})

// @desc    Find DRN Record by ID
// @route   None
// @access  Private

export const findDRNById = asyncHandler(async (id) => {
   //console.log("inside findDRNById ", id)
   const drnDetails = await DRN.findById(id)
                                       .populate('customer', 'custName custCode custBillingAddress custShipingAddress custGST')
                                       .populate('drnDetails.soNo', 'soNumber soDate poNumber soTargetDate soDetails')
                                       .populate('drnDetails.jcNo', 'jcDescription jcProdCode hsn unit customerPartNumber jcCustomerDetails')
                                       .populate('drnDetails.batchId', 'fgmiNo batchQuantity')
                                       .exec()
   return drnDetails;
})

// @desc    Update DRN Record
// @route   PUT /api/drn/:id
// @access  Private
const updateDRN = asyncHandler(async (req, res) => {
   //console.log("Inside UPDATE DRN and ID is ", req.params.id)
	const drn = await DRN.findById(req.params.id)
	if (drn) {
      let totalDRNValue = 0;

		try {
			const {
            supplierAddress,
            supplierAddressIndex,
            customerBillingAddressIndex,
            customerBillingAddress,
            customerShipingAddressIndex,
            customerShipingAddress,
            drnDetails,
            deletedDRNDetails
         } = req.body;

         ////console.log("Inside UPDATE DRN and SRN Details are ", drnDetails)
         const newDRNDetails = [...drnDetails]
         const newDRNDetails1 = newDRNDetails.map((drn,index) => {
            drn.drnLineNumber = (index+1);
            drn.drnLineValue = drn.dispatchQty * drn.drnUnitRate;
            totalDRNValue += parseFloat(drn.dispatchQty * drn.drnUnitRate)
            return drn;
         })
			
         drn.updatedBy = req.user._id;
         drn.drnNumber = req.body.drnNumber || drn.drnNumber;
         drn.drnStatus = req.body.drnStatus || drn.drnStatus;
         drn.drnDate = req.body.drnDate || drn.drnDate;
         drn.paymentTerms = req.body.paymentTerms || drn.paymentTerms;
         drn.customer = drn.customer;
         drn.supplierAddressIndex = req.body.supplierAddressIndex;
         drn.supplierAddress = req.body.supplierAddress || drn.supplierAddress;
         drn.customerBillingAddressIndex = req.body.customerBillingAddressIndex;
         //console.log("drn.customerBillingAddressIndex =========== ", req.body.customerBillingAddressIndex)
        
         drn.customerBillingAddress = req.body.customerBillingAddress || drn.customerBillingAddress;
         drn.customerShipingAddressIndex = req.body.customerShipingAddressIndex;
         drn.customerShipingAddress = req.body.customerShipingAddress || drn.customerShipingAddress;
         drn.qaRemark = req.body.qaRemark || drn.qaRemark;
         drn.billState = req.body.billState || drn.billState;
         drn.billPinCode = req.body.billPinCode || drn.billPinCode;
         drn.shipState = req.body.shipState || drn.shipState;
         drn.shipPinCode = req.body.shipPinCode || drn.shipPinCode;
         drn.drnTotalAmount = totalDRNValue
         drn.company = req.body.company || drn.company;
			
         drn.drnDetails = newDRNDetails1
         for (const drndet  of newDRNDetails1) {
            //console.log("____________+++++++++ START ==== ");
            if(drndet.differenceQty !== undefined) {
               const updateFGMI = await updateFGMIThruDRNUpdate(req.user._id, drndet.batchId, "REJECT", drndet.differenceQty)
               //update Sales Order Balance Qty
               //updatedBy, soId, soLineNumber, updateJCId, action, dispatchQty
               const updatedSalesOrder = updateSOBalanceQty(
                  req.user._id, 
                  drndet.soNo, 
                  drndet.soLineNumber,
                  drndet.jcNo, 
                  "CREATE", 
                  drndet.differenceQty
               )
            }
         }
         //return;
			const updatedDRN = await drn.save()
         if(req.body.drnStatus === "R") {
            for (const drndet  of drn.drnDetails) {
               const updateFGMI = await updateFGMIThruDRNUpdate(req.user._id, drndet.batchId, "REJECT", drndet.dispatchQty)
               //update Sales Order Balance Qty
               //updatedBy, soId, soLineNumber, updateJCId, action, dispatchQty
               const updatedSalesOrder = updateSOBalanceQty(
                  req.user._id, 
                  drndet.soNo, 
                  drndet.soLineNumber,
                  drndet.jcNo, 
                  "REJECT", 
                  drndet.dispatchQty
               )
            }
         }

         let idx = 0;
         for (const drndet  of deletedDRNDetails) {
            //console.log(idx)
            if(idx>0) {
               const updateFGMI = await updateFGMIThruDRNUpdate(req.user._id, drndet.batchId._id, "REJECT", drndet.dispatchQty)
               //update Sales Order Balance Qty
               //updatedBy, soId, soLineNumber, updateJCId, action, dispatchQty
               const updatedSalesOrder = updateSOBalanceQty(
                                          req.user._id, 
                                          drndet.soNo._id, 
                                          drndet.soNo.soLineNumber,
                                          drndet.jcNo,
                                          "REJECT", 
                                          drndet.dispatchQty
                                       )
            }
            idx++;
         }
         
         if(req.body.drnStatus === "R") {
            const message = await createMessageRecord(
               req.user.company, 
               req.user._id, 
               req.user._id,
               "DRNREJECT",
               updatedDRN._id,
               updatedDRN.drnNumber,
               "N",
               "MAIL"
            );
            // try {
            //    let drndet = await findDRNById(drn._id)
            //    const email = sendMailForDRNApproval(drndet, "R")
            // } catch (error) {
            //    //console.log("Error in sending mail when DRN is Rejected ", error.code)
            // }
         }

         if(req.body.drnStatus === "P") {
            const message = await createMessageRecord(
               req.user.company, 
               req.user._id, 
               req.user._id,
               "DRNCREATE",
               updatedDRN._id,
               updatedDRN.drnNumber,
               "N",
               "MAIL"
            );
            // try {
            //    //let drndet = await findDRNById(drn._id)
            //    //const email = await sendMailForDRNApproval(drndet, "P")
            // } catch (error) {
            //    //console.log("Error in sending mail when DRN is Sent For Approval ", error.code)
            // }
         }
			res.status(201).json(updatedDRN)
		} catch (error) {
			console.error(`Error: ${error}`.white.underline.bold)
			////console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating DRN Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid DRN data')
	}
})

// @desc    Delete a DRN Record
// @route   DELETE /api/drn/:id
// @access  Private
const deleteDRN = asyncHandler(async (req, res) => {
   //console.log("Inside DELETE DRN and ID is ", req.params.id)
   const drn = await DRN.findById(req.params.id)

   if (drn) {
      await drn.remove()
      res.json({ message: 'DRN removed' })
   } else {
      res.status(404)
      throw new Error('DRN not found')
   }
})

// @desc    Get all DRN Records
// @route   GET /api/drn/all
// @access  Private
const getAllUnApprovedDRNs = asyncHandler(async (req, res) => {
   const pageSize = 10000
   const page = Number(req.query.pageNumber) || 1

   const count = await DRN.countDocuments()
   ////console.log("Total records count are ==== ", count)

   const drns = await DRN.find({ "drnStatus": { $nin:["R","A", "I"] } })
                     .sort({ _id:-1 })
                     .populate('customer', 'custName custCode')
                     .populate('soDetails.jcNo', 'jcDescription jcCustomerDetails')
                     .limit(pageSize)
                     .skip(pageSize * (page - 1))


  // //console.log("Total DRN are ==== ", drns)
   ////console.log("Page Number is ==== ", page)
   ////console.log("Total pages are ==== ", Math.ceil(count / pageSize))
	////console.log(drns)
	
   res.json({ drns, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get all Required Master Data for DRN Screen
// @route   GET /api/drn/masterdata
// @access  Private
const getAllMasterDataForDRN = asyncHandler(async (req, res) => {
	let autoIncrementedDRNNo = "";
	const customers = await getAllCustomers();
	const autoIncrementedNo = await AutoIncrement.getNextId(DRN_MODULE_PREFIX)

	if(autoIncrementedNo < 10) {
      autoIncrementedDRNNo = "DRN/000"+autoIncrementedNo;
   } else if(autoIncrementedNo < 100) {
      autoIncrementedDRNNo = "DRN/00"+autoIncrementedNo;
   } else if(autoIncrementedNo < 1000) {
      autoIncrementedDRNNo = "DRN/0"+autoIncrementedNo;
   } else {
      autoIncrementedDRNNo = "DRN/"+autoIncrementedNo;
   }

	res.json({ customers, autoIncrementedDRNNo })
})

/** All the below functions are for DRN Approval */
// @desc    Get all open DRN Records for approval
// @route   GET /api/drn/open
// @access  Private
const getAllOpenDRNs = asyncHandler(async (req, res) => {
   //console.log("Get all open DRN Records for approval ==== ")
   const pageSize = 10000
   const page = Number(req.query.pageNumber) || 1

   const count = await DRN.countDocuments()
   //console.log("Total records count are ==== ", count)

   const drns = await DRN.find({"drnStatus":"P"})
                     .sort({ _id:-1 })
                     .populate('customer', 'custName custCode')
                     .populate('soDetails.jcNo', 'jcDescription jcCustomerDetails')
                     .limit(pageSize)
                     .skip(pageSize * (page - 1))


   //console.log("Total OPEN DRN are ==== ", drns)
   ////console.log("Page Number is ==== ", page)
   ////console.log("Total pages are ==== ", Math.ceil(count / pageSize))
	////console.log(drns)
	
   res.json({ drns, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get all approve DRN Records for Invoice Generation
// @route   GET /api/drn/approved
// @access  Private
const getAllApprovedDRNs = asyncHandler(async (req, res) => {
   //console.log("Get all open DRN Records for approval ==== ")
   const pageSize = 10000
   const page = Number(req.query.pageNumber) || 1

   const count = await DRN.countDocuments()
   //console.log("Total records count are ==== ", count)

   const drns = await DRN.find({"drnStatus":"A"})
                     .sort({ _id:-1 })
                     .populate('customer', 'custName custCode')
                     .populate('soDetails.jcNo', 'jcDescription jcCustomerDetails')
                     .limit(pageSize)
                     .skip(pageSize * (page - 1))


   //console.log("Total Approved DRN are ==== ", drns)
   ////console.log("Page Number is ==== ", page)
   ////console.log("Total pages are ==== ", Math.ceil(count / pageSize))
	////console.log(drns)
	
   res.json({ drns, page, pages: Math.ceil(count / pageSize) })
})

const updateDRNOnInvoiceCreation = asyncHandler(async (drnId, userId) => {
   //console.log("Inside updateDRNOnInvoiceCreation and ID is ", drnId)
	const drn = await DRN.findById(drnId)
	if (drn) {

		try {
         drn.updatedBy = userId;
         drn.drnNumber = drn.drnNumber;
         drn.drnDate = drn.drnDate;
         drn.drnStatus = "I";
         drn.customer = drn.customer;
         drn.billState = drn.billState;
         drn.billPinCode = drn.billPinCode;
         drn.shipState = drn.shipState;
         drn.shipPinCode = drn.shipPinCode;
         drn.drnTotalAmount = drn.drnTotalAmount
			
         drn.drnDetails = drn.drnDetails
			
			const updatedDRN = await drn.save()
         return updatedDRN;
		} catch (error) {
			//console.log("Inside error while creating error ==== ", error)
			throw new Error('Error in Updating DRN Record')
		}
	} else {
		throw new Error('Invalid DRN data')
	}
})

/** Dashboard Functions Start */
const getDRNBalanceValue = asyncHandler(async () => {
   let drnBalanceValue = 0;

   const drns = await DRN.find({ "drnStatus": { $nin:["R", "I"] } })

   if(drns.length > 0) {
      drns.forEach(drn => {
         drn.drnDetails.forEach(drd => {
            drnBalanceValue += drd.drnUnitRate * drd.dispatchQty;
         })
      })
   }

   return drnBalanceValue.toFixed(2)
})

const getPendingDRNWithQA = asyncHandler(async()=>{
   const count = await DRN.countDocuments({"drnStatus":"P"})
   //console.log("Total records count are ==== ", count)
   return count;
})

const getMonthlyRejectedCountByQA = asyncHandler(async()=>{
   const count = await DRN.countDocuments({"drnStatus":"R"})
   //console.log("Total records count are ==== ", count)
   return count;
})

const getMonthlyRejectedDRNData = asyncHandler(async () => {
   const monthsArray = [ 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March' ]
   const rejectedCount = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 , 0 ]
   
   let firstDateOfFiscalYear = getFirstDayOfFiscalYear();
   let lastDateOfFiscalYear = getLastDayOfFiscalYear();

   let year = new Date(firstDateOfFiscalYear).getFullYear();
   let month = new Date(firstDateOfFiscalYear).getMonth();
   let date = new Date(firstDateOfFiscalYear).getDate();

   let year1 = new Date(lastDateOfFiscalYear).getFullYear();
   let month1 = new Date(lastDateOfFiscalYear).getMonth();
   let date1 = new Date(lastDateOfFiscalYear).getDate();

   let findQuery = {
      "drnDate": { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) },
      "drnStatus":"R"
   };

   const result = await DRN.aggregate([
      { 
         $match: { 
            drnDate: { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) },
            drnStatus:"R"
         } 
      },
      {
         $group: {
            _id: { "year_month": { $substrCP: [ "$drnDate", 0, 7 ] } }, 
               count: { $sum: 1 }
            //count: { $count: "$drnDate" }
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

   if(result.length > 0) {
      const propertyNames = Object.keys(result[0].data);

      const propertyValues = Object.values(result[0].data);
      let n = 0;
      propertyNames.forEach(elem => {
         let index = monthsArray.indexOf(elem)
         rejectedCount[index] = propertyValues[n]
         n++; 
      });
   
      let monthlyRejectedDRNCountData = {"Months":monthsArray, "RejectedDRN" : rejectedCount}
      //console.log(">>>>> ",monthlyRejectedDRNCountData)
      return monthlyRejectedDRNCountData;
   } else {
      let monthlyRejectedDRNCountData = {"Months":monthsArray, "RejectedDRN" : []}
      return monthlyRejectedDRNCountData;
   }

   //console.log("getMonthlyRejectedDRNData>>>> Result ", result)
})
/** Dashboard Functions End */

const getRejectedDRNs = asyncHandler(async (req, res) => {
   let findQuery = {
      "drnStatus":"R"
   };
   //console.log("req.query.startDate ======== ", req.query.startDate)
   //console.log("req.query.endDate ======== ", req.query.endDate)
   if(req.query.startDate !== "undefined") {
      if(req.query.startDate.trim().length > 0) {
         let year = new Date(req.query.startDate).getFullYear();
         let month = new Date(req.query.startDate).getMonth();
         let date = new Date(req.query.startDate).getDate();

         //findQuery["createdAt"] = { $gte: new Date(year, month, date) }
         if(req.query.endDate !== "undefined") {
            let year1 = new Date(req.query.endDate).getFullYear();
            let month1 = new Date(req.query.endDate).getMonth();
            let date1 = new Date(req.query.endDate).getDate();
   
            findQuery["createdAt"] = { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }

         } else {
            let year1 = new Date().getFullYear();
            let month1 = new Date().getMonth();
            let date1 = new Date().getDate();
            findQuery["createdAt"] = { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }

         }
      }
   }
   //let endDate = req.query.endDate;
   if(req.query.endDate !== undefined) {
      if(req.query.endDate.trim().length > 0) {
         let year = new Date(req.query.endDate).getFullYear();
         let month = new Date(req.query.endDate).getMonth();
         let date = new Date(req.query.endDate).getDate();

         if(req.query.startDate != "undefined") {
            if(req.query.startDate.trim().length === 0) {
               findQuery["createdAt"] = { $lte: new Date(year, month, date) }
            }
            
         } 

        // findQuery["createdAt"] = { $lt: new Date(year, month, date) }
      }
   }
   //console.log("FInal Rejcted DRN query is ", findQuery)
   const drns = await DRN.find(findQuery)
                     .sort({ _id:-1 })
                     .populate('customer', 'custName custCode')
                     .populate('soDetails.jcNo', 'jcDescription jcCustomerDetails')

   res.json({ drns });
})

export {
   createDRN,
   getDRNById,
   updateDRN,
   deleteDRN,
   getAllUnApprovedDRNs,
   getAllMasterDataForDRN,
   getAllOpenDRNs,
   getAllApprovedDRNs,
   updateDRNOnInvoiceCreation,
   getDRNBalanceValue,
   getMonthlyRejectedCountByQA,
   getPendingDRNWithQA,
   getMonthlyRejectedDRNData,
   getRejectedDRNs
}