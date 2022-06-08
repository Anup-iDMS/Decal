import asyncHandler from 'express-async-handler';
import groupArray  from 'group-by-with-sum';
// Load the full build.
import _ from 'lodash';

import SalesOrder from '../../models/sales/salesOrderModel.js';
import { SALES_ORDER_MODULE_PREFIX } from '../../config/moduleConstants.js';
import AutoIncrement from '../../models/autoincrement/autoIncrementModel.js';
import { getAllCustomers } from '../master/customerControllers.js';
import { getAllJCMasters } from '../master/jcMasterController.js';
import { FGMI } from './../../models/production/FGMIModel.js';
import { 
   getFirstDayOfFiscalYear,
   getFirstDayOfMonth,
   getLastDayOfMonth,
   getLastDayOfFiscalYear
} from '../../utils/utility.js';
import { getDRNBalanceValue } from '../drn/drnController.js';
import { sendWAMessageOnOderCreation } from './../../config/wamessages.js';
import { createMessageRecord } from '../message/messageController.js';
//send email on SO creation
//import { sendMailOnSOCreation } from './../../mails/salesOrderMails.js';



// @desc    Create new SalesOrder Record
// @route   POST /api/salesorders
// @access  Private

const createSalesOrder = asyncHandler(async (req, res) => {
	////console.log("Inside create SalesOrder function.....", )
   let totalSOValue = 0;
	const {
		soId,
      soNumber,
      soDate,
      customer,
      billState,
      billPinCode,
      shipState,
      shipPinCode,
      soTotalAmount,
      poNumber,
      poFileName,
      poDate,
      soTargetDate,
      soDetails
	} = req.body;

   //console.log("1. Before >>>>> soDetails before Updated SO details are ========= ", soDetails)
   let soDetails1 = soDetails.slice(1);
   //console.log("2. After ++++ soDetails before Updated SO details are ========= ", soDetails1)
   const newSoDetails = [...soDetails1]
   const newSoDetails1 = newSoDetails.map((sod,index) => {
      ////console.log("??????????? sod.id ========= ", sod.id)
      if(sod.id) {
         sod.lineNumber = (index+1);
         sod.balancedQty = sod.orderedQty;
         totalSOValue += parseFloat(sod.lineValue)
         
         sod.customerPONumber = sod.customerPONumber;
         sod.customerPODate = sod.customerPODate;

         return sod;
      }
   })
   //console.log("Aale re aale ========= ", newSoDetails1)
   ////console.log("Aale re aale total so value gheun aale ========= ", totalSOValue)
	const salesOrder = new SalesOrder({
		company: req.user.company,
		createdBy: req.user._id,
		updatedBy: req.user._id,
      soId,
      soNumber,
      soDate,
      customer,
      billState,
      billPinCode,
      shipState,
      shipPinCode,
      soTotalAmount:totalSOValue,
      poNumber,
      poFileName,
      poDate,
      soTargetDate,
      soDetails:newSoDetails1
	});
	////console.log(":::::::: BEFORE creating SalesOrder REcord is >>>>>> ", salesOrder);
	try {
		const createSalesOrder = await salesOrder.save();
		////console.log("Created REcord is >>>>>> ", createSalesOrder);
		if (createSalesOrder) {
         const aiv = await AutoIncrement.setNextId(SALES_ORDER_MODULE_PREFIX)
         //uncomment this code on WhatsApp integration
         //const messageSent = sendWAMessageOnOderCreation(createSalesOrder);
         ////console.log("On Order Creation Message Sent = ", messageSent)
         
         //console.log("Now creating a message queue >>>>>> ");
         const message = await createMessageRecord(
            req.user.company, 
            req.user._id, 
            req.user._id,
            "ORDERCREATE",
            createSalesOrder._id,
            createSalesOrder.soNumber,
            "N",
            "MAIL"
         );
		   //const email = await sendMailOnIssueReport(issueDetails);
         //console.log("After Creating a Message Record >>>>>> ", message.messageCode);

         // try {
         //    let sodet = await findSalesOrderById(createSalesOrder._id)
         //    const email = sendMailOnSOCreation(sodet)
         // } catch (error) {
         //    //console.log(">>> Error in sending mail when SO is Generated....")
         // }
         res.status(201).json(createSalesOrder)
      } else {
         res.status(400)
         throw new Error('Invalid JC data')
      }
		//res.status(201).json(createSalesOrder);
    } catch (error) {
		//console.log("Inside error while creating error ==== ", error)
		res.status(400)
		throw new Error('Error in creating Sales Order Record')
    }
});

// @desc    Get SalesOrder Record by ID
// @route   GET /api/salesorders/:id
// @access  Private

const getSalesOrderById = asyncHandler(async (req, res) => {
    //console.lo("+++++++++++++++ Inside get SalesOrder By Id and ID is ", req.params.id)
    const salesOrder = await SalesOrder.findById(req.params.id)
                                       .populate('customer', 'custName custCode')
                                       .populate('soDetails.jcNo', 'jcDescription customerPartNumber jcCustomerDetails').exec()
    if (salesOrder) {
      //console.lo("SalesOrder Record is .... ", salesOrder)
      let sodet = []
      for (const sod of salesOrder.soDetails) {
         if(sod.canceledQty !== undefined && sod.canceledQty === 0){
            sodet.push(sod)
         } else if(sod.canceledQty !== undefined && (sod.invoicedQty === sod.orderedQty)){
            sodet.push(sod)
         } 
      }
      //console.log("Final sodetails1 ==== ".blue, sodet)
      salesOrder.soDetails = sodet;
      // const sodetails = [...salesOrder.soDetails]
      // const sodetails1 = sodetails.map((sod,index)=> {
      //    //console.log("---- SOD canceledQty ", sod.canceledQty);
      //    if(sod.canceledQty !== undefined && sod.canceledQty === 0){
      //       return sod;
      //    }
      // })
      // //console.log("Final sodetails1 ==== ".blue, sodetails1)
      // salesOrder.soDetails = sodetails1;
      res.json(salesOrder)
    } else {
        res.status(404)
        throw new Error('Record Not Found')
    }
})

// @desc    Get SalesOrder Record by ID
// @route   none
// @access  Private

export const findSalesOrderById = asyncHandler(async (soId) => {
   //console.lo("+++++++++++++++ Inside get SalesOrder By Id and ID is ", req.params.id)
   const salesOrder = await SalesOrder.findById(soId)
                                      .populate('customer', 'custName')
                                      .populate('soDetails.jcNo', 'jcDescription customerPartNumber jcCustomerDetails').exec()
   if (salesOrder) {
       return salesOrder;
   } else {
       res.status(404)
       throw new Error('Record Not Found')
   }
})


// @desc    Update SalesOrder Record
// @route   PUT /api/salesorders/:id
// @access  Private
const updateSalesOrder = asyncHandler(async (req, res) => {
	//console.log("Inside UPDATE SalesOrder and ID is ", req.params.id)
	const salesOrder = await SalesOrder.findById(req.params.id)
	if (salesOrder) {
      let totalSOValue = 0;

		try {
			
         const {
            soDetails,
            soCancellationReason,
            soStatus
         } = req.body;

         const newSoDetails = [...soDetails]
         const newSoDetails1 = newSoDetails.map((sod,index) => {
            sod.lineNumber = (index+1);
            sod.balancedQty = sod.orderedQty;
            totalSOValue += parseFloat(sod.lineValue)
            return sod;
         })
			
         salesOrder.updatedBy = req.user._id;
         salesOrder.soNumber = req.body.soNumber || salesOrder.soNumber;
         salesOrder.soDate = req.body.soDate || salesOrder.soDate;
         salesOrder.customer = req.body.customer || salesOrder.customer;
         salesOrder.billState = req.body.billState || salesOrder.billState;
         salesOrder.billPinCode = req.body.billPinCode || salesOrder.billPinCode;
         salesOrder.shipState = req.body.shipState || salesOrder.shipState;
         salesOrder.shipPinCode = req.body.shipPinCode || salesOrder.shipPinCode;
         salesOrder.soTotalAmount = totalSOValue
			salesOrder.poNumber = req.body.poNumber || salesOrder.poNumber
			salesOrder.poFileName = req.body.poFileName || salesOrder.poFileName
			salesOrder.poDate = req.body.poDate || salesOrder.poDate
			salesOrder.soTargetDate = req.body.soTargetDate || salesOrder.soTargetDate
			salesOrder.soStatus = req.body.soStatus
			salesOrder.soCancellationReason = req.body.soCancellationReason || salesOrder.soCancellationReason
			salesOrder.soDetails = newSoDetails1
			
			const updatedSalesOrder = await salesOrder.save()
			//console.log("Updated MODULE RECORD IS ", updatedSalesOrder)
			res.status(201).json(updatedSalesOrder)
		} catch (error) {
			//console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating SalesOrder Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid SalesOrder data')
	}
});

// @desc    Delete a SalesOrder Record
// @route   DELETE /api/salesorders/:id
// @access  Private
const deleteSalesOrder = asyncHandler(async (req, res) => {
   //console.log("Inside DELETE SalesOrder and ID is ", req.params.id)
   const salesOrder = await SalesOrder.findById(req.params.id)
   const salesOrderNumber = salesOrder.soNumber
   //console.log("The Sales Order Number Found ===== ", salesOrderNumber)
   var id = "ctl03_Tabs1";
   let soNo = salesOrderNumber.substr(salesOrderNumber.length - 4); // => "Tabs1"
   //console.log("soNo ==== ", soNo)
   //console.log("soNo in INtegert ==== ", parseInt(soNo))
   if (salesOrder) {
       await salesOrder.remove()
       const aiv = await AutoIncrement.resetNextId(parseInt(soNo), SALES_ORDER_MODULE_PREFIX)
       res.json({ message: 'SalesOrder removed' })
   } else {
      res.status(404)
      throw new Error('SalesOrder not found')
   }
})

// @desc    Get all SalesOrder Records
// @route   GET /api/salesorders/all
// @access  Private
const getAllSalesOrders = asyncHandler(async (req, res) => {
   ////console.log(">>>>> Inside getAllSalesOrders WITH PAGINATION--- === ", req.user._id)
   const pageSize = 10000
   const page = Number(req.query.pageNumber) || 1

   const count = await SalesOrder.countDocuments()
   ////console.log("Total records count are ==== ", count)

   const salesOrders = await SalesOrder.find({ "soStatus": { $nin:[-1, 0] } })
                                    .sort({ _id:-1 })
                                    .populate('customer', 'custName')
                                    .populate('soDetails.jcNo', 'jcDescription')
                                    .limit(pageSize)
                                    .skip(pageSize * (page - 1))


   //console.log("Total Sales Orders are ==== ", salesOrders)
   res.json({ salesOrders, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get all Required Master Data for SalesOrder Screen
// @route   GET /api/salesorders/masterdata
// @access  Private
const getAllMasterDataForSalesOrder = asyncHandler(async (req, res) => {
	let autoIncrementedSalesOrderNo = "";
	const customers = await getAllCustomers();
	const autoIncrementedNo = await AutoIncrement.getNextId(SALES_ORDER_MODULE_PREFIX)

	if(autoIncrementedNo < 10) {
      autoIncrementedSalesOrderNo = SALES_ORDER_MODULE_PREFIX+"/000"+autoIncrementedNo;
   } else if(autoIncrementedNo < 100) {
      autoIncrementedSalesOrderNo = SALES_ORDER_MODULE_PREFIX+"/00"+autoIncrementedNo;
   } else if(autoIncrementedNo < 1000) {
      autoIncrementedSalesOrderNo = SALES_ORDER_MODULE_PREFIX+"/0"+autoIncrementedNo;
   } else {
      autoIncrementedSalesOrderNo = SALES_ORDER_MODULE_PREFIX+"/"+autoIncrementedNo;
   }

	res.json({ customers, autoIncrementedSalesOrderNo })
})

// @desc    Get all Required Master Data for SalesOrder Screen
// @route   GET /api/salesorders/jcmasterdata
// @access  Private
const getAllJCMastersForReports = asyncHandler(async (req, res) => {
   ////console.log("------------ here to get all customers -------------- ")
	const jcMasters = await getAllJCMasters();
	////console.log(">>>>>>>>>>jc master ", jcMasters)
	////console.log("----------------------end-------------")
	res.json({jcMasters})
})


// @desc    Get all Back Orders by SO
// @route   GET /api/salesorders/backorderbyso
// @access  Private
const getBackOrdersBySO = asyncHandler(async (req, res) => {

   let jcId = req.query.jcId;
   
   let findQuery = {
      "soDetails.balancedQty":{ $gt : 0},
      "soStatus": { $nin:[-1, 0] },
   };

   if(req.query.jcId !== "undefined" ) {
      if(req.query.jcId.trim().length > 0) {
         findQuery["soDetails.jcNo"] = jcId;
      }
   }

   //let startDate = req.query.startDate;
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
   if(req.query.endDate !== "undefined") {
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
   //Date dt = new Date(req.query.startDate);
   

   //console.log("********* final FIND query is *********** ", findQuery)
   let totalBackOrderValue = 0;

   const soDetailsRecords = 
      await SalesOrder.find(findQuery)
                     .sort({ _id:-1 })
                     .populate('customer', 'custName')
                     .populate('soDetails.jcNo', 'jcno jcDescription')

   if(soDetailsRecords.length > 0) {
      ////console.log("Sales Orders Length ", soDetailsRecords.length)
      let salesOrders = [];
      soDetailsRecords.forEach(so => {
         //totalBackOrderValue += so.soTotalAmount
         so.soDetails.forEach(sodet => {
            let srs = {}
            //console.log(`For Sales Order ${so.soNumber} line details are ${sodet.jcNo.jcDescription}`)
            if(sodet.balancedQty > 0) {
               //console.log(`For Sales Order ${so.soNumber} line details are ${sodet.balancedQty}`)
               srs.soNumber = so.soNumber
               srs.soDate = so.soDate
               srs.soTargetDate = sodet.soLineTargetDate===undefined?so.soTargetDate:sodet.soLineTargetDate
               srs.lineNumber = sodet.lineNumber;
               srs.jcId = sodet.jcNo._id;
               srs.jcno = sodet.jcNo.jcno;
               srs.jcDescription = sodet.jcNo.jcDescription;
               srs.orderedQty = sodet.orderedQty;
               srs.invoicedQty = sodet.invoicedQty;
               srs.balancedQty = sodet.balancedQty;
               srs.balanceValue = sodet.soUnitRate * sodet.balancedQty;
               srs.soUnitRate = sodet.soUnitRate;
               srs.lineValue = sodet.lineValue;
               srs.customer = so.customer;
               if(req.query.jcId !== "undefined" && req.query.jcId.length>0) { 
                  //console.log("Inside IF JC ID ", req.query.jcId)
                  if(req.query.jcId === sodet.jcNo._id.toString()) {
                     totalBackOrderValue += sodet.balancedQty*sodet.soUnitRate
                     salesOrders.push(srs);
                  }  
               } else {
                  //console.log("Inside ELSE JC ID ")
                  totalBackOrderValue += sodet.balancedQty*sodet.soUnitRate
                  salesOrders.push(srs);
               }
            }
         })
      });
      //console.log(salesOrders)
      res.json({ salesOrders, totalBackOrderValue });
   } else {
      res.json({ salesOrders:[], totalBackOrderValue });
   }
})

// @desc    Get Sales Order by SO Line Level Details
// @route   GET /api/salesorders/details
// @access  Private
const getSODetailsByLine = asyncHandler(async (req, res) => {

   let findQuery = {};
   let customerId = req.params.customerId;
   //let jcId = req.params.jcNo
   if(customerId !== undefined) {
      findQuery.customer = customerId
   } 

   const soDetailsRecords = 
      await SalesOrder.find({ "soStatus": { $nin:[-1, 0] } })
                     .sort({ _id:-1 })
                     .populate('customer', 'custName')
                     .populate('soDetails.jcNo', '_id jcno jcDescription')
   
   if(soDetailsRecords.length > 0) {
      ////console.log("Sales Orders Length ", soDetailsRecords.length)
      let salesOrders = [];
      soDetailsRecords.forEach(so => {
         so.soDetails.forEach(sodet => {
            let srs = {}
            
            ////console.log(`For Sales Order ${so.soNumber} line details are ${sodet.jcNo.jcDescription}`)
            srs.soNumber = so.soNumber
            srs.soDate = so.soDate
            srs.soTargetDate = sodet.soLineTargetDate===undefined?so.soTargetDate:sodet.soLineTargetDate
            srs.lineNumber = sodet.lineNumber;
            srs.jcId = sodet.jcNo._id;
            srs.jcNo = sodet.jcNo.jcno;
            srs.jcDescription = sodet.jcNo.jcDescription;
            srs.orderedQty = sodet.orderedQty;
            srs.invoicedQty = sodet.invoicedQty;
            srs.balancedQty = sodet.balancedQty;
            srs.balanceValue = sodet.soUnitRate * sodet.balancedQty;
            srs.soUnitRate = sodet.soUnitRate;
            srs.lineValue = sodet.lineValue;
            srs.customer = so.customer;
            salesOrders.push(srs);
            //console.log(srs)
            //console.log()
         })
      });
      
      res.json({ salesOrders });
   } else {
      res.json({ salesOrders:[] });
   }
   
})

// @desc    Get Cancel Sales Order by SO Line Level Details
// @route   GET /api/salesorders/cancelso
// @access  Private
const getCancelSODetailsByLine = asyncHandler(async (req, res) => {

   let findQuery = {};
   let customerId = req.params.customerId;
   //let jcId = req.params.jcNo
   if(customerId !== undefined) {
      findQuery.customer = customerId
   } 

   const soDetailsRecords = 
      await SalesOrder.find({})
                     .sort({ _id:-1 })
                     .populate('customer', 'custName')
                     .populate('soDetails.jcNo', '_id jcno jcDescription')
   
   if(soDetailsRecords.length > 0) {
      ////console.log("Sales Orders Length ", soDetailsRecords.length)
      let salesOrders = [];
      soDetailsRecords.forEach(so => {
         so.soDetails.forEach(sodet => {
            let srs = {}
            //{ "soStatus": { $in:[-1] } }
            if(so.soStatus ===  -1 || (sodet.canceledQty !== undefined && sodet.canceledQty > 0)){
               ////console.log(`For Sales Order ${so.soNumber} line details are ${sodet.jcNo.jcDescription}`)
               srs.soNumber = so.soNumber
               srs.soDate = so.soDate
               srs.soTargetDate = sodet.soLineTargetDate===undefined?so.soTargetDate:sodet.soLineTargetDate
               srs.lineNumber = sodet.lineNumber;
               srs.jcId = sodet.jcNo._id;
               srs.jcNo = sodet.jcNo.jcno;
               srs.jcDescription = sodet.jcNo.jcDescription;
               srs.orderedQty = sodet.orderedQty;
               srs.invoicedQty = sodet.invoicedQty;
               srs.balancedQty = sodet.balancedQty;
               srs.balanceValue = sodet.soUnitRate * sodet.balancedQty;
               srs.soUnitRate = sodet.soUnitRate;
               srs.lineValue = sodet.lineValue;
               srs.customer = so.customer;
               salesOrders.push(srs);
            } 
            ////console.log(srs)
            ////console.log()
         })
      });
      
      res.json({ salesOrders });
   } else {
      res.json({ salesOrders:[] });
   }
   
})

// @desc    Get all Back Orders by JC
// @route   GET /api/salesorders/backorderbyjc/:id
// @access  Private
const getBackOrdersByJC = asyncHandler(async (req, res) => {
   
   let jcId = req.query.jcId;
   ////console.log(">>>>> Inside getBackOrdersByJC and JC ID is ", req.query.jcId)
   
   let findQuery = {
      "soDetails.balancedQty":{ $gt : 0},
      "soStatus": { $nin:[-1, 0] },
   };

   if(jcId !== undefined && jcId.trim().length > 0) {
      ////console.log("When JC ID is not null")
      findQuery["soDetails.jcNo"] = jcId;
   } else {
      ////console.log("JC ID IS NULL.........")
   }
   
   ////console.log(">>>>> Find Query is ", findQuery)
   
   let totalBackOrderValue = 0;
   
   
   
   const soDetailsRecords = 
      await SalesOrder.find(findQuery)
                     .sort({ _id:-1 })
                     .populate('customer', 'custName')
                     .populate('soDetails.jcNo', 'jcno jcDescription')

   if(soDetailsRecords.length > 0) {
      ////console.log("Sales Orders Length ", soDetailsRecords.length)
      let salesOrders = [];
      for (const so of soDetailsRecords) {
         for (const sodet  of so.soDetails) {
            let srs = {}
            if(sodet.balancedQty > 0){
               //let fgmiDetails = [];
               ////console.log(`For Sales Order ${so.soNumber} line details are ${sodet.jcNo.jcDescription}`)
               srs._id = so._id
               srs.soNumber = so.soNumber
               srs.soDate = so.soDate
               srs.soTargetDate = sodet.soLineTargetDate===undefined?so.soTargetDate:sodet.soLineTargetDate
               srs.lineNumber = sodet.lineNumber;
               srs.jcId = sodet.jcNo._id;
               srs.jcNo = sodet.jcNo.jcno;
               srs.jcDescription = sodet.jcNo.jcDescription;
               srs.orderedQty = sodet.orderedQty;
               srs.invoicedQty = sodet.invoicedQty;
               srs.balancedQty = sodet.balancedQty;
               srs.balanceValue = sodet.soUnitRate * sodet.balancedQty;
               srs.soUnitRate = sodet.soUnitRate;
               srs.lineValue = sodet.lineValue;
               srs.customer = so.customer;

               //totalBackOrderValue += so.soTotalAmount
               totalBackOrderValue += sodet.balancedQty*sodet.soUnitRate

               salesOrders.push(srs);
            }
         }
      }
      ////console.log("Sales Orders Length ", salesOrders)
      //console.log("Sales Orders Length ", salesOrders.length)
      //check what all HSN are present in the SI Details
      let n = 0;
      let jcArray = [];
      let nama = [];
      for (const sod of salesOrders) {
         ////console.log("**** inside for loop ********* ", sod)
         let kama = {
            jcNo: "",
            jcDescription: "",
            balancedQty: 0,
            balanceValue: 0
         }
         if(!jcArray.includes(sod.jcNo)) {
            jcArray.push(sod.jcNo)
            ////console.log("%%%%%%%%%% Inside IF and Uniquye JC no is and record is ", sod.jcDescription)
            kama.jcNo = sod.jcNo
            kama.jcDescription = sod.jcDescription
            kama.balancedQty = sod.balancedQty
            kama.balanceValue = sod.balanceValue
            //totalBackOrderValue += sod.balanceValue;
            nama.push(kama)
         } else {
            let cama = nama[jcArray.indexOf(sod.jcNo)]
            ////console.log("%%%%%%%%%% Inside ELSE and record is ", cama)
            cama.balancedQty += sod.balancedQty
            cama.balanceValue += sod.balanceValue
            //totalBackOrderValue += sod.balanceValue;
         }
         n++;
      }
      //let data = [...salesOrders];

      // const ans = _(data)
      //    .groupBy('jcDescription')
      //    .map((so, id) => ({
      //       jcDescription: id,
      //       balancedQty: _.sumBy(so, 'balancedQty'),
      //       balanceValue: _.sumBy(so, 'balanceValue')
      //    }))
      //    .value()

      
      //let sdk = groupArray(salesOrders, 'jcDescription', 'balancedQty')
      ////console.log(sdk)
      res.json({ salesOrders:nama, totalBackOrderValue });
   } else {
      res.json({ salesOrders:[], totalBackOrderValue });
   }
})

// @desc    Get Sales Order by SO Line Level Details
// @route   GET /api/salesorders/opensos/?customerId=${customerId}
// @access  Private
const getCustomerOpenSalesOrders = asyncHandler(async (req, res) => {

   try {
      let findQuery = {
         "soDetails.balancedQty":{ $gt : 0}
      };
   
      let jcMasterId = req.query.customerId;
      //let jcId = req.params.jcNo
      //console.log("JC Master Id ========== ", jcMasterId)
      
      // if(customerId !== undefined) {
      //    //findQuery.customer = customerId;
      //    findQuery.soDetails.jcNo = customerId;
         
      // } 
      //console.log("Inside getCustomerOpenSalesOrders and find query is ", findQuery)
      const soDetailsRecords = 
         await SalesOrder.find({ "soDetails.jcNo" :jcMasterId, "soDetails.balancedQty":{ $gt : 0}, "soStatus": { $nin:[-1, 0] } })
                        .sort({ _id: 1 })
                        .populate('customer', 'custName')
                        .populate('soDetails.jcNo', '_id jcno customerPartNumber jcDescription')
      //console.log("SO DETAILS ARE ", soDetailsRecords)
      if(soDetailsRecords.length > 0) {
         //console.log("Sales Orders Length ", soDetailsRecords.length)
         let salesOrders = [];
         ////console.log(salesOrders)
         //console.log("----------------------------START---------------------------")
         for (const so of soDetailsRecords) {
            for (const sodet  of so.soDetails) {
               let srs = {}
               //let fgmiDetails = [];
              //console.log(`For Sales Order ${so.soNumber} line details are ${sodet.jcNo._id} and supplied ID is ${jcMasterId}`)
               if(sodet.jcNo._id.toString() === jcMasterId) {
                  //console.log("----------------------------ID MATCHED---------------------------", sodet.jcNo.customerPartNumber)
                  //console.log("----------------------------sodet.balancedQty---------------------------", sodet.balancedQty)
                  if(sodet.balancedQty > 0) {
                     srs._id = so._id
                     srs.soNumber = so.soNumber
                     srs.soDate = so.soDate
                     srs.soTargetDate = sodet.soLineTargetDate===undefined?so.soTargetDate:sodet.soLineTargetDate
                     srs.lineNumber = sodet.lineNumber;
                     srs.jcId = sodet.jcNo._id;
                     srs.jcNo = sodet.jcNo.jcno;
                     srs.customerPartNumber = sodet.jcNo.customerPartNumber;
                     srs.jcDescription = sodet.jcNo.jcDescription;
                     srs.orderedQty = sodet.orderedQty;
                     srs.invoicedQty = sodet.invoicedQty;
                     srs.dispatchQty = 0;
                     srs.availableQty = 0;
                     srs.batchDate = new Date();
                     srs.balancedQty = sodet.balancedQty;
                     srs.balanceValue = sodet.soUnitRate * sodet.balancedQty;
                     srs.soUnitRate = sodet.soUnitRate;
                     srs.lineValue = sodet.lineValue;
                     srs.customer = so.customer;
                     let shriram = await FGMI.find({"jcNo": sodet.jcNo._id, "batchQuantity":{ $gt : 0} }).sort({ _id:-1 }).exec()
                     //console.log("----------------------------1.2---------------------------", shriram.length)
                     if(shriram.length === 0) {
                        
                     } else {
                        srs.fgmiDetails = shriram;
                     //console.log("----------------------------1.3---------------------------")
                        salesOrders.push(srs);
                     }
                  }
               } else {
                 //console.log("ID NOT MATCHED")
               }
            }
         }
         
         ////console.log("----------------------------SOs are ---------------------------", salesOrders)
         ////console.log("----------------------------END---------------------------")
         res.json({ salesOrders });
      } else {
         res.json({ salesOrders:[] });
      }
   } catch (error) {
      //console.log("Error Occured ", error)
   }
   
})

const updateSOBalanceQty = asyncHandler(async (updatedBy, soId, soLineNumber, updateJCId, action, dispatchQty, canceledReason="") => {
   //console.log("0. salesOrderController --> updateSOBalanceQty --> SO ", soId);
   //console.log("0. salesOrderController --> updateSOBalanceQty --> soLineNumber ", soLineNumber);
   //console.log("0. salesOrderController --> updateSOBalanceQty --> action ", action);
   //console.log("0. salesOrderController --> updateSOBalanceQty --> dispatchQty ", dispatchQty);
   //console.log("0. salesOrderController --> updateSOBalanceQty --> canceledReason ", canceledReason);
   const salesOrder = await SalesOrder.findById(soId)
	if (salesOrder) {

      try {
         ////console.log("Found Slaes Order is ", salesOrder)
         ////console.log("Found Slaes Order DETAILS is ", salesOrder.soDetails)
         //const newSoDetails = [salesOrder.soDetails]
         const newSoDetails1 = salesOrder.soDetails.map((sod,index) => {
            //sod.lineNumber = sod.lineNumber;
            //console.log("SO Number in SO Details is ", sod.lineNumber)
            //console.log("Passed SO Number is  ", soLineNumber)
            //console.log("Passed JC Number is  ", updateJCId)
            //console.log("JC NUmber is JC Number is  ", sod.jcNo)
            if(sod.lineNumber === soLineNumber && sod.jcNo.toString() === updateJCId.toString()) {
               //console.log("Matching JC NO is   ".blue, sod.jcNo)
               if(action === "CREATE") {
                  let balqty = sod.balancedQty-dispatchQty;
                  sod.balancedQty = balqty;
               } else  if(action === "REJECT") {
                  let balqty = sod.balancedQty+dispatchQty;
                  sod.balancedQty = (balqty);
               } else  if(action === "CANCEL") {
                  let cancelqty = sod.balancedQty;
                  //console.log("???? Cancel Qty = ".blue, cancelqty)
                  sod.balancedQty = 0;
                  sod.canceledQty = cancelqty;
                  sod.canceledReason = canceledReason;
               }
            } else {
               sod.balancedQty = sod.balancedQty;
            }
            sod.invoicedQty = sod.invoicedQty;
            sod.jcNo = sod.jcNo;
            sod.orderedQty = sod.orderedQty;
            sod.soUnitRate = sod.soUnitRate;
            sod.lineValue = sod.lineValue;
            return sod;
         })
			
         salesOrder.updatedBy = updatedBy;
         salesOrder.soNumber = salesOrder.soNumber;
         salesOrder.soDate = salesOrder.soDate;
         salesOrder.customer = salesOrder.customer;
         salesOrder.billState = salesOrder.billState;
         salesOrder.billPinCode = salesOrder.billPinCode;
         salesOrder.shipState = salesOrder.shipState;
         salesOrder.shipPinCode = salesOrder.shipPinCode;
         salesOrder.soTotalAmount = salesOrder.soTotalAmount
			salesOrder.poNumber = salesOrder.poNumber
			salesOrder.poFileName = salesOrder.poFileName
			salesOrder.poDate = salesOrder.poDate
			salesOrder.soTargetDate = salesOrder.soTargetDate
			salesOrder.soDetails = newSoDetails1
			
			////console.log("Before UPDATE salesOrder is ", salesOrder)
			const updatedSalesOrder = await salesOrder.save()
			//console.log("Updated MODULE RECORD IS ", updatedSalesOrder)
			return updatedSalesOrder
		} catch (error) {
			//console.log("Inside error while creating error ==== ", error)
			throw new Error('Error in Updating SalesOrder Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid SalesOrder data')
	}
   // const soDetailsRecords = 
      // await SalesOrder.find({ "_id" :soId, "soDetails.lineNumber":soLineNumber })
      //                .sort({ _id:-1 })
      // //console.log("SAles Order Found = ", soDetailsRecords)
      // let soBalQty = soDetailsRecords[0].soDetails[0].balancedQty;
      // //console.log("SAles Order Balance Qty Found = ", soBalQty)
      // let newBalQty = 0;
      // if(action === "CREATE") {
      //    newBalQty = soBalQty -  dispatchQty
      // } else if(action === "REJECT") {
      //    newBalQty = soBalQty +  dispatchQty
      // } 
      // const updatedSalesOrder = await SalesOrder.findOneAndUpdate(
      //    { _id: soId }, 
      //    { "soDetails.balancedQty": newBalQty, updatedBy: updatedBy }
      // );
      // //console.log("2. After updating Sales Order Status ===== ", updatedSalesOrder)
      //return updatedSalesOrder
})

const updateSOInvoicedQty = asyncHandler(async (updatedBy, soId, soLineNumber, updateJCId, action, dispatchQty) => {
   //console.log("0. salesOrderController --> updateSOInvoicedQty --> SO ", soId);
   //console.log("0. salesOrderController --> updateSOInvoicedQty --> soLineNumber ", soLineNumber);
   //console.log("0. salesOrderController --> updateSOInvoicedQty --> action ", action);
   //console.log("0. salesOrderController --> updateSOInvoicedQty --> dispatchQty ", dispatchQty);
   const salesOrder = await SalesOrder.findById(soId)
	if (salesOrder) {

      try {
         //console.log("Found Slaes Order is ", salesOrder)
         ////console.log("Found Slaes Order DETAILS is ", salesOrder.soDetails)
         //const newSoDetails = [salesOrder.soDetails]
         const newSoDetails1 = salesOrder.soDetails.map((sod,index) => {
            //sod.lineNumber = sod.lineNumber;
            //console.log("SO Number in SO Details is ", sod.lineNumber)
            //console.log("Passed SO Number is  ", soLineNumber)
            //console.log("Passed JC Number is  ", updateJCId)
            //console.log("JC NUmber is JC Number is  ", sod.jcNo)
            if(sod.lineNumber === soLineNumber && sod.jcNo.toString() === updateJCId.toString()) {
               if(action === "CREATE") {
                  let invoicedQty = sod.invoicedQty+dispatchQty;
                  //console.log("Updated Bal Qty = ", invoicedQty)
                  sod.invoicedQty = invoicedQty;
               } 
            } else {
               sod.invoicedQty = sod.invoicedQty;
            }
            sod.balancedQty = sod.balancedQty;
            sod.jcNo = sod.jcNo;
            sod.orderedQty = sod.orderedQty;
            sod.soUnitRate = sod.soUnitRate;
            sod.lineValue = sod.lineValue;
            return sod;
         })
			
         salesOrder.updatedBy = updatedBy;
         salesOrder.soNumber = salesOrder.soNumber;
         salesOrder.soDate = salesOrder.soDate;
         salesOrder.customer = salesOrder.customer;
         salesOrder.billState = salesOrder.billState;
         salesOrder.billPinCode = salesOrder.billPinCode;
         salesOrder.shipState = salesOrder.shipState;
         salesOrder.shipPinCode = salesOrder.shipPinCode;
         salesOrder.soTotalAmount = salesOrder.soTotalAmount
			salesOrder.poNumber = salesOrder.poNumber
			salesOrder.poFileName = salesOrder.poFileName
			salesOrder.poDate = salesOrder.poDate
			salesOrder.soTargetDate = salesOrder.soTargetDate
			salesOrder.soDetails = newSoDetails1
			
			//console.log("Before UPDATE salesOrder is ", salesOrder)
			const updatedSalesOrder = await salesOrder.save()
			//console.log("Updated MODULE RECORD IS ", updatedSalesOrder)
			return updatedSalesOrder
		} catch (error) {
			//console.log("Inside error while creating error ==== ", error)
			throw new Error('Error in Updating SalesOrder Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid SalesOrder data')
	}
})

/** Dashboard Functions Start */
const getSalesOrdersBalanceValue = asyncHandler(async () => {
   let soBalanceValue = 0;

   let findQuery = {
      "soDetails.balancedQty":{ $gt : 0},
      "soStatus": { $nin:[-1, 0] },
   };

   const soDetailsRecords = await SalesOrder.find(findQuery).sort({ _id:-1 })

   if(soDetailsRecords.length > 0) {
      soDetailsRecords.forEach(so => {
         so.soDetails.forEach(sodet => {
            soBalanceValue += sodet.soUnitRate * sodet.balancedQty;
         })
      })
   }
   const drnValue = await getDRNBalanceValue();
   //console.log("D R N V A LU E ", drnValue)
   return ( Number(soBalanceValue) + Number(drnValue) ).toFixed(2)
})

const getCurrentMonthSalesOrdersValue = asyncHandler(async () => {
   let soValue = 0;

   let firstDateOfMonth = getFirstDayOfMonth();
   let lastDateOfMonth = getLastDayOfMonth();

   let year = new Date(firstDateOfMonth).getFullYear();
   let month = new Date(firstDateOfMonth).getMonth();
   let date = new Date(firstDateOfMonth).getDate();

   let year1 = new Date(lastDateOfMonth).getFullYear();
   let month1 = new Date(lastDateOfMonth).getMonth();
   let date1 = new Date(lastDateOfMonth).getDate();

   let findQuery = {
      //"soDetails.balancedQty":{ $gt : 0},
      "soStatus": { $nin:[-1, 0] },
      "soDate": { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
   };

   const soDetailsRecords = await SalesOrder.find(findQuery).sort({ _id:-1 })

   if(soDetailsRecords.length > 0) {
      soDetailsRecords.forEach(so => {
         soValue += so.soTotalAmount
      })
   }
   //console.log("SO VALUE IS ", soValue)
   return soValue.toFixed(2);
})

const getCurrentMonthSalesOrdersDispatchValue = asyncHandler(async () => {
   let dispatchValue = 0;
   
   let firstDateOfMonth = getFirstDayOfMonth();
   let lastDateOfMonth = getLastDayOfMonth();

   let year = new Date(firstDateOfMonth).getFullYear();
   let month = new Date(firstDateOfMonth).getMonth();
   let date = new Date(firstDateOfMonth).getDate();

   let year1 = new Date(lastDateOfMonth).getFullYear();
   let month1 = new Date(lastDateOfMonth).getMonth();
   let date1 = new Date(lastDateOfMonth).getDate();

   let findQuery = {
      //"soDetails.balancedQty":{ $gt : 0},
      "soStatus": { $nin:[-1, 0] },
      "soDate": { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
   };

   const soDetailsRecords = await SalesOrder.find(findQuery).sort({ _id:-1 })
   if(soDetailsRecords.length > 0) {
      soDetailsRecords.forEach(so => {
         so.soDetails.forEach(sodet => {
            //dispatchValue += so.invoicedQty * so.soUnitRate
            dispatchValue += (isNaN(sodet.invoicedQty * sodet.soUnitRate)?0.00:sodet.invoicedQty * sodet.soUnitRate)
         })
      })
   }
   return dispatchValue.toFixed(2);
})

const getMonthlySalesOrderData = asyncHandler(async () => {
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
      "soDate": { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
   };

   const result = await SalesOrder.aggregate([
      { $match: {
            soDate: { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) },
            "soStatus": { $nin:[-1, 0] }
         } 
      },
      {
         $group: {
            _id: { "year_month": { $substrCP: [ "$soDate", 0, 7 ] } }, 
            //count: { $sum: 1 }
            count: { $sum: "$soTotalAmount" }
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
      //console.lo(propertyNames)
      //console.lo(propertyValues);

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
   
      let monthlySalesOrdersData = {"Months":monthsArray, "Orders" : salesData}
      //console.lo(">>>>> ",monthlySalesOrdersData)
      return monthlySalesOrdersData;
   } else {
      let monthlySalesOrdersData = {"Months":monthsArray, "Orders" : []}
      return monthlySalesOrdersData;
   }

})

const getCustomerSalesOrderData = asyncHandler(async () => {
   let firstDateOfFiscalYear = getFirstDayOfFiscalYear();
   let lastDateOfFiscalYear = getLastDayOfFiscalYear();

   let customerSalesOrdersData = [];

   let year = new Date(firstDateOfFiscalYear).getFullYear();
   let month = new Date(firstDateOfFiscalYear).getMonth();
   let date = new Date(firstDateOfFiscalYear).getDate();

   let year1 = new Date(lastDateOfFiscalYear).getFullYear();
   let month1 = new Date(lastDateOfFiscalYear).getMonth();
   let date1 = new Date(lastDateOfFiscalYear).getDate();

   const result = await SalesOrder.aggregate([
      {
         $match: { 
            soDate: { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
            
         }
      },
      { $project : { _id : 1, soNumber: 1, customer: 1, soTotalAmount : 1 } },
      {
         $group: {
            _id: "$customer",
            soTotalAmount: { $sum: "$soTotalAmount" }
         },
      }
      ,
      { 
         $lookup : {
            from : 'customers', //"from collection"
            localField : '_id', //any field from "input collection"
            foreignField : '_id', //any field from "from collection"
            as : 'deva' //attached array field
         } 
      },
      {$unwind:'$deva'},
      {$project:{
         custName:'$deva.custName',
         soTotalAmount: 1, 
      }},
      { $sort : { 'soTotalAmount' : -1 } },
      { $limit : 5 }
   ]);
   if(result.length > 0) {
      let custArray = [];
      let custSOAmount = [];
      for (const sod of result) {
         custArray.push(sod.custName)
         //custSOAmount.push(sod.soTotalAmount)
         custSOAmount.push((Number(sod.soTotalAmount)/100000).toFixed(2))
      }
      customerSalesOrdersData = {"Customers":custArray, "Sales" : custSOAmount}
      // //console.log(">>>>> ",customerSalesOrdersData)
      // //console.log("@@@@@@@@@@@@@@@@@@ Result is   getCustomerSalesOrderData   ==== ", result)
      // //console.log("@@@@@@@@@@@@@@@@@@ Result is   getCustomerSalesOrderData   ==== ", custArray)
      // //console.log("@@@@@@@@@@@@@@@@@@ Result is   getCustomerSalesOrderData   ==== ", custSOAmount)
      return customerSalesOrdersData;
   } else {
      customerSalesOrdersData = {"Customers":[], "Sales" : []}
      return monthlySalesOrdersData;
   }
})

const getTopFiveOrderedJCs = asyncHandler(async () => {
   let firstDateOfFiscalYear = getFirstDayOfFiscalYear();
   let lastDateOfFiscalYear = getLastDayOfFiscalYear();

   let jcSalesOrdersData = {};

   let year = new Date(firstDateOfFiscalYear).getFullYear();
   let month = new Date(firstDateOfFiscalYear).getMonth();
   let date = new Date(firstDateOfFiscalYear).getDate();

   let year1 = new Date(lastDateOfFiscalYear).getFullYear();
   let month1 = new Date(lastDateOfFiscalYear).getMonth();
   let date1 = new Date(lastDateOfFiscalYear).getDate();

   const result = await SalesOrder.aggregate([
      {
         $match: { 
            soDate: { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
            
         }
      },
      { $unwind: "$soDetails" },
      {
         $group: {
            _id: "$soDetails.jcNo",
            soTotalAmount: { $sum: "$soDetails.lineValue" }
         },
      },
      { 
         $lookup : {
            from : 'jcmasters', //"from collection"
            localField : '_id', //any field from "input collection"
            foreignField : '_id', //any field from "from collection"
            as : 'deva' //attached array field
         } 
      },
      { $unwind: "$deva" },
      {$project:{
         custName:'$deva.jcDescription',
         soTotalAmount: 1, 
      }},
      { $sort : { 'soTotalAmount' : -1 } },
      { $limit : 5 }
      
   ]);
   ////console.log("@@@@@@@@@@@@@@@@@@ Result is   getTopFiveOrderedJCs   ==== ", result)
   if(result.length > 0) {
      let jcArray = [];
      let jcSOAmount = [];
      for (const sod of result) {
         jcArray.push(sod.custName)
         jcSOAmount.push((Number(sod.soTotalAmount)/100000).toFixed(2))
      }
      jcSalesOrdersData = {"JC":jcArray, "Sales" : jcSOAmount}
      //console.lo(">>>>> ",jcSalesOrdersData)
      // //console.log("@@@@@@@@@@@@@@@@@@ Result is   getCustomerSalesOrderData   ==== ", jcArray)
      // //console.log("@@@@@@@@@@@@@@@@@@ Result is   getCustomerSalesOrderData   ==== ", custSOAmount)
      return jcSalesOrdersData;
   } else {
      jcSalesOrdersData = {"JC":[], "Sales" : []}
      return jcSalesOrdersData;
   }
})

/** Dashboard Functions End */

// @desc    Get all Back Orders by SO
// @route   GET /api/salesorders/balancedqtybyso
// @access  Private
const getBalancedQtyBySO = asyncHandler(async (req, res) => {

   
   let findQuery = {
      "soDetails.balancedQty":{ $gt : 0},
      "soStatus": { $nin:[-1, 0] },
   };

   const soDetailsRecords = 
      await SalesOrder.find(findQuery)
                     .sort({ _id:1 })
                     .populate('customer', 'custName')
                     .populate('soDetails.jcNo', 'jcno jcDescription')

   if(soDetailsRecords.length > 0) {
      //console.log("Sales Orders Length ", soDetailsRecords.length)
      let salesOrders = [];
      soDetailsRecords.forEach(so => {
         so.soDetails.forEach(sodet => {
            let srs = {}

            if(sodet.balancedQty > 0) {
               srs._id = so._id
               srs.soNumber = so.soNumber
               srs.soDate = so.soDate
               srs.soTargetDate = sodet.soLineTargetDate===undefined?so.soTargetDate:sodet.soLineTargetDate
               srs.lineNumber = sodet.lineNumber;
               srs.jcId = sodet.jcNo._id;
               srs.jcno = sodet.jcNo.jcno;
               srs.jcDescription = sodet.jcNo.jcDescription;
               srs.orderedQty = sodet.orderedQty;
               srs.invoicedQty = sodet.invoicedQty;
               srs.balancedQty = sodet.balancedQty;
               srs.canceledQty = sodet.canceledQty===undefined?0:sodet.canceledQty;
               srs.canceledReason = sodet.canceledReason===undefined?"":sodet.canceledReason;
               srs.balanceValue = sodet.soUnitRate * sodet.balancedQty;
               srs.soUnitRate = sodet.soUnitRate;
               srs.lineValue = sodet.lineValue;
               srs.name = so.customer.custName;

               salesOrders.push(srs)
            }
         })
      });
      //console.log("??????? sales order by line items where balance qty greater than zero === ", salesOrders)
      res.json({ salesOrders });
   } else {
      res.json({ salesOrders:[]});
   }
})


// @desc    Get all Back Orders by SO
// @route   GET /api/salesorders/cancelsolineqty
// @access  Private
const updateCancelSOLineQty = asyncHandler(async (req, res) => {
   //console.log("Inside updateCancelSOLineQty............ ".red);
   let id = req.query.id;
   let lineNumber = req.query.lineNumber;
   let jcId = req.query.jcId;
   let balancedQty = req.query.balancedQty;
   let canceledReason = req.query.canceledReason;
   //console.log("Inside updateCancelSOLineQty and balancedQty............ ".red, balancedQty);
   //console.log("Inside updateCancelSOLineQty and lineNumber............ ".red, lineNumber);
   //console.log("Inside updateCancelSOLineQty and canceledReason............ ".green, canceledReason);
   const updatedSalesOrder = updateSOBalanceQty(
         req.user._id,
         id,
         parseInt(lineNumber),
         jcId,
         "CANCEL",
         0,
         canceledReason
      );
   //console.log("All DOne............ ".blue, lineNumber);
   res.json({ updatedSalesOrder })
})

// @desc    Get all SalesOrder Records
// @route   None
// @access  Private
const findAllOrdersForADay = asyncHandler(async () => {
   console.log("----> have reached heer in findAllOrdersForADay >>>>>>>>>>>>")
   let findQuery = {}
   let startDate = new Date();

   let ordersCount = 0;
   let totalSOAmount = 0;

   let response = {};
   
   findQuery["soDate"] = { $gte: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()), 
      $lte: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()+1) }

   console.log("----> have reached heer in before firing query >>>>>>>>>>>>".yellow)
   const salesOrders = await SalesOrder.find(findQuery)
                     console.log("----> have reached heer in AFTER firing query >>>>>>>>>>>>".white)
   if(salesOrders.length > 0) {
      ordersCount = salesOrders.length;
         for (const so of salesOrders) {
         totalSOAmount += so.soTotalAmount
      }
   }
   console.log("----> all well leaving >>>>>>>>>>>>".pink)
   response['ordersCount'] = ordersCount;
   response['totalSOAmount'] = totalSOAmount;

   return response;
})

// @desc    Get all Sales Orders Approaching Target Date
// @route   None
// @access  Private
const getSOWithTargetDateApproaching = asyncHandler(async (req, res) => {
	
	let findQuery = {
      "soDetails.balancedQty":{ $gt : 0},
      "soStatus": { $nin:[-1, 0] },
	};
	let startDate = new Date();

	findQuery["soTargetDate"] = { $gte: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()+1), 
      $lte: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()+3) }

	
	const salesOrders = await SalesOrder.find(findQuery)
                                       .sort({ "soTargetDate":1 })
                                       .populate('customer', 'custName')
                                       .populate('soDetails.jcNo', 'jcDescription customerPartNumber jcCustomerDetails').exec()
   let salesOrdersData = [];
   for (const so of salesOrders) {
      for (const sod of so.soDetails) {
         let srs = {};
         srs.soNumber = so.soNumber;
         srs.soDate = so.soDate;
         srs.customer = so.customer.custName;
         srs.jcDescription = sod.jcNo.jcDescription;
         srs.soTargetDate = so.soTargetDate;

         salesOrdersData.push(srs);
      }
   }
   console.log("----> have reached heer in before firing query >>>>>>>>>>>>", salesOrdersData)
   return salesOrdersData; 
})

// @desc    Get all Sales Orders Approaching Target Date
// @route   None
// @access  Private
const getSOPassedTargetDate = asyncHandler(async (req, res) => {
	
	let findQuery = {
      "soDetails.balancedQty":{ $gt : 0},
      "soStatus": { $nin:[-1, 0] },
	};
	let startDate = new Date();

	findQuery["soTargetDate"] = {$lte: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) }

	
	const salesOrders = await SalesOrder.find(findQuery)
                                       .sort({ "soTargetDate":1 })
                                       .populate('customer', 'custName')
                                       .populate('soDetails.jcNo', 'jcDescription customerPartNumber jcCustomerDetails').exec()
   let salesOrdersData = [];
   for (const so of salesOrders) {
      for (const sod of so.soDetails) {
         let srs = {};
         
         const diffDays = Math.round((new Date()-new Date(so.soTargetDate)) / (1000 * 60 * 60 * 24)); 
         srs.soNumber = so.soNumber;
         srs.soDate = so.soDate;
         srs.customer = so.customer.custName;
         srs.jcDescription = sod.jcNo.jcDescription;
         srs.soTargetDate = so.soTargetDate;
         srs.balancedQty = sod.balancedQty;
         srs.daysPassed = diffDays

         salesOrdersData.push(srs);
      }
   }
   console.log("----> have reached heer in before firing query >>>>>>>>>>>>", salesOrdersData)
   return salesOrdersData; 
})


export {
	createSalesOrder,
	getSalesOrderById,
	updateSalesOrder,
	deleteSalesOrder,
	getAllSalesOrders,
   getAllMasterDataForSalesOrder,
   getAllJCMastersForReports,
   getBackOrdersBySO,
   getSODetailsByLine,
   getCancelSODetailsByLine,
   getBackOrdersByJC,
   getCustomerOpenSalesOrders,
   getSalesOrdersBalanceValue,
   getCurrentMonthSalesOrdersValue,
   getCurrentMonthSalesOrdersDispatchValue,
   updateSOBalanceQty,
   updateSOInvoicedQty,
   getMonthlySalesOrderData,
   getCustomerSalesOrderData,
   getTopFiveOrderedJCs,
   getBalancedQtyBySO,
   updateCancelSOLineQty,
   findAllOrdersForADay,
   getSOWithTargetDateApproaching,
   getSOPassedTargetDate
}