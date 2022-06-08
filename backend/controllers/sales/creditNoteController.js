import asyncHandler from 'express-async-handler';
import AutoIncrement from '../../models/autoincrement/autoIncrementModel.js';
import { CREDIT_NOTE_MODULE_PREFIX } from '../../config/moduleConstants.js';
import CreditNote from '../../models/sales/creditNoteModel.js';
import { getAllCustomers } from '../master/customerControllers.js';
import { getHSNByCode } from '../master/hsnController.js';
import { 
   getCurrentFinancialYear, 
   getFirstDayOfFiscalYear, 
   getFirstDayOfMonth, 
   getLastDayOfFiscalYear, 
   getLastDayOfMonth 
} from './../../utils/utility.js';

// @desc    Create new CreditNote Record
// @route   POST /api/creditnote
// @access  Private
const createCreditNote = asyncHandler(async (req, res) => {
   console.log("Inside createCreditNote >>>>>> ");
   const {
      creditNoteNumber,
      creditNoteDate,
      salesInvoiceNumber,
      customer,
      billState,
      billPinCode,
      shipState,
      shipPinCode,
      creditNoteAmount,
      creditNoteReason,
      supplierAddress,
      customerBillingAddress,
      customerShipingAddress,
      creditNoteTotalAmount,
      creditNoteTotalCGSTAmount,
      creditNoteTotalSGSTAmount,
      creditNoteTotalIGSTAmount,
      creditNoteTotalUGSTAmount,
      creditNoteTotalTaxAmount,
      creditNoteTotalAmountWithTax,
      creditNoteDetails
	} = req.body;

   let creditNoteDetails1 = creditNoteDetails.slice(1);

   const newCreditNoteDetails = [...creditNoteDetails1]
   const newCreditNoteDetails1 = newCreditNoteDetails.map((sod,index) => {
      if(sod.id) {
         sod.creditNoteLineNumber = (index+1);
         sod.jcNo = sod.jcId;
         return sod;
      }
   })
   
   console.log("??????????? newCreditNoteDetails1 ========= ", newCreditNoteDetails1)
   const creditNote = new CreditNote({
		company: req.user.company,
		createdBy: req.user._id,
		updatedBy: req.user._id,
      creditNoteNumber,
      creditNoteDate,
      customer,
      billState,
      billPinCode,
      shipState,
      shipPinCode,
      creditNoteAmount,
      creditNoteReason,
      supplierAddress,
      customerBillingAddress,
      customerShipingAddress,
      creditNoteTotalAmount,
      creditNoteTotalCGSTAmount,
      creditNoteTotalSGSTAmount,
      creditNoteTotalIGSTAmount,
      creditNoteTotalUGSTAmount,
      creditNoteTotalTaxAmount,
      creditNoteTotalAmountWithTax,
      creditNoteDetails: newCreditNoteDetails1
	});

   try {
		const createCreditNote = await creditNote.save();
		console.log("Created REcord is >>>>>> ", createCreditNote);
		if (createCreditNote) {
         const aiv = await AutoIncrement.setNextId(CREDIT_NOTE_MODULE_PREFIX)
         res.status(201).json(createCreditNote)
      } else {
         res.status(400)
         throw new Error('Invalid CreditNote data')
      }
		//res.status(201).json(createCreditNote);
    } catch (error) {
		console.log("Inside create CreditNote while creating error ==== ", error)
		res.status(400)
		throw new Error('Error in creating Sales Order Record')
    }
})

// @desc    Get CreditNote Record by ID
// @route   GET /api/creditnote/:id
// @access  Private
const getCreditNoteById = asyncHandler(async (req, res) => {
   console.log("2. Inside getCreditNoteById function ------------>")
   const creditNoteDetailss = await CreditNote.findById(req.params.id)
                              .populate('customer', 'custName custBillingAddress custShipingAddress custGST custContactPersonName custContactPersonNumber')
                              .populate('creditNoteDetails.jcNo', 'jcDescription jcProdCode hsn unit customerPartNumber jcCustomerDetails')
                              .exec()

   if (creditNoteDetailss) {
      let index = 0;
      let creditNoteDetails =  JSON.parse(JSON.stringify(creditNoteDetailss));
      for (const sid of creditNoteDetails.creditNoteDetails) {
         sid.hsnDetails = {}
         let srs = await getHSNByCode(sid.jcNo.hsn)
         sid.hsnDetails = srs;
         index++;
      }
      res.json(creditNoteDetails)
   } else {
      res.status(404)
      throw new Error('Record Not Found')
   }
})

// @desc    Update CreditNote Record
// @route   PUT /api/creditnote/:id
// @access  Private
const updateCreditNote = asyncHandler(async (req, res) => { 
   console.log("3. Inside updateCreditNote function ------------>")
   const creditNote = await CreditNote.findById(req.params.id)
	if (creditNote) {
      const {
         creditNoteDate,
         creditNoteAmount,
         creditNoteReason
      } = req.body;
      try {
         creditNote.updatedBy = req.user._id;
         creditNote.creditNoteNumber = creditNote.creditNoteNumber;
         creditNote.creditNoteDate = req.body.creditNoteDate || creditNote.creditNoteDate;
         creditNote.salesInvoiceNumber = creditNote.salesInvoiceNumber;
         creditNote.customer = creditNote.customer;
         creditNote.billState = creditNote.billState;
         creditNote.billPinCode = creditNote.billPinCode;
         creditNote.shipState = creditNote.shipState;
         creditNote.shipPinCode = creditNote.shipPinCode;
         creditNote.creditNoteAmount = req.body.creditNoteAmount || creditNote.creditNoteAmount;
         creditNote.creditNoteReason = req.body.creditNoteReason || creditNote.creditNoteReason;
         
         const updatedCreditNote = await creditNote.save()
			console.log("Updated MODULE RECORD IS ", updatedCreditNote)
			res.status(201).json(updatedCreditNote)

      } catch (error) {
			console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating CreditNote Record')
		}
   } else {
		res.status(400)
		throw new Error('Invalid CreditNote data')
	}
})

// @desc    Get all CreditNote Records
// @route   GET /api/creditnote/all
// @access  Private
const getAllCreditNotes = asyncHandler(async (req, res) => {
   //console.log("5. Inside getAllCreditNotes function ------------>")
   const pageSize = 10000
   const page = Number(req.query.pageNumber) || 1

   const count = await CreditNote.countDocuments()
   //console.log("Total records count are ==== ", count)

   const creditNotes = await CreditNote.find({})
                     .sort({ _id:-1 })
                     .populate('customer', 'custName')
                     .populate('salesInvoiceNumber', 'salesInvoiceNumber salesInvoiceDate salesInvoiceTotalAmount salesInvoiceDetails shipState shipPinCode shipPinCode billPinCode')
                     .limit(pageSize)
                     .skip(pageSize * (page - 1))


   //console.log("Total CreditNote are ==== ", creditNotes)
   //console.log("Page Number is ==== ", page)
   //console.log("Total pages are ==== ", Math.ceil(count / pageSize))
	//console.log(creditNotes)
	
   res.json({ creditNotes, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get all Required Master Data for CreditNote Screen
// @route   GET /api/creditnote/masterdata
// @access  Private
const getAllMasterDataForCreditNote = asyncHandler(async (req, res) => {
   //console.log("6. Inside getAllMasterDataForCreditNote function ------------>")
   let autoIncrementedCreditNo = "";
	const autoIncrementedNo = await AutoIncrement.getNextId(CREDIT_NOTE_MODULE_PREFIX)
   const customers = await getAllCustomers();
   //console.log("autoIncrementedNo === ", autoIncrementedNo)
   let currentFinancialYear = getCurrentFinancialYear();
   //console.log("1. Inside getAllMasterDataForCreditNote and current fiscal year is ",currentFinancialYear)

	if(autoIncrementedNo < 10) {
      autoIncrementedCreditNo = `CN/${currentFinancialYear}/000${autoIncrementedNo}`
   } else if(autoIncrementedNo < 100) {
      autoIncrementedCreditNo = `CN/${currentFinancialYear}/00${autoIncrementedNo}`
   } else if(autoIncrementedNo < 1000) {
      autoIncrementedCreditNo = `CN/${currentFinancialYear}/0${autoIncrementedNo}`
   } else {
      autoIncrementedCreditNo = `CN/${currentFinancialYear}/${autoIncrementedNo}`
   }
   //console.log("2. Inside getAllMasterDataForCreditNote and autoIncrementedCreditNo is ",autoIncrementedCreditNo)
	res.json({ autoIncrementedCreditNo, customers })
})

// @desc    Get all CreditNote Records With Tax
// @route   GET /api/creditnote/withtax
// @access  Private
const getAllCreditNotesWithTax = asyncHandler(async (req, res) => {
   //console.log("5. Inside getAllCreditNotesWithTax function ------------>")
   const pageSize = 10000
   const page = Number(req.query.pageNumber) || 1

   const count = await CreditNote.countDocuments()
   //console.log("Total records count are ==== ", count)
   let findQuery = {}
   let creditNotes = []
   
   if(req.query.jcId !== "undefined" ) {
      console.log("When JC IS IS NOT undefined :::::::: ", req.query.jcId)
      if(req.query.jcId.trim().length > 0) {
         findQuery["creditNoteDetails.jcNo"] = jcId;
      }
   }

   if(req.query.customerId !== "undefined" ) {
      console.log("When customerId IS IS NOT undefined :::::::: ", req.query.customerId)
      if(req.query.customerId.trim().length > 0) {
         findQuery["customer"] = customerId;
      }
   }
   /*
   if(req.query.startDate === undefined && req.query.endDate === undefined) {
      let firstDay = getFirstDayOfMonth();
      let lastDay = getLastDayOfMonth();

      let year = firstDay.getFullYear();
      let month = firstDay.getMonth();
      let date = firstDay.getDate();

      let year1 = lastDay.getFullYear();
      let month1 = lastDay.getMonth();
      let date1 = lastDay.getDate();

      findQuery["creditNoteDate"] = { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
   }
   */
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
   
            findQuery["creditNoteDate"] = { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
         } else {
            let year1 = new Date().getFullYear();
            let month1 = new Date().getMonth();
            let date1 = new Date().getDate();
            findQuery["creditNoteDate"] = { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
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
               findQuery["creditNoteDate"] = { $lte: new Date(year, month, date) }
            }
            
         } 
      }
   }

   const creditNotesRecords = await CreditNote.find(findQuery)
                     .sort({ creditNoteNumber: 1 })
                     .populate('customer', 'custName custGST custPAN')
                     .populate('creditNoteDetails.jcNo', 'jcDescription')
                     .limit(pageSize)
                     .skip(pageSize * (page - 1))
   
   if(creditNotesRecords.length > 0) {
      for (const cnr of creditNotesRecords) {
         for (const cnrd of cnr.creditNoteDetails) {
            let srs = {};
            srs.creditNoteNumber = cnr.creditNoteNumber;
            srs.creditNoteDate = cnr.creditNoteDate;
            srs.name = cnr.customer.custName;
            srs.custGST = cnr.customer.custGST;
            srs.creditNoteTotalAmount = cnr.creditNoteTotalAmount;
            srs.creditNoteTotalAmount = cnr.creditNoteTotalAmount;
            srs.creditNoteTotalAmount = cnr.creditNoteTotalAmount;
            srs.creditNoteTotalTaxAmount = cnr.creditNoteTotalTaxAmount;
            srs.creditNoteTotalIGSTAmount = cnr.creditNoteTotalIGSTAmount;
            srs.creditNoteTotalCGSTAmount = cnr.creditNoteTotalCGSTAmount;
            srs.creditNoteTotalSGSTAmount = cnr.creditNoteTotalSGSTAmount;
            srs.creditNoteTotalAmountWithTax = cnr.creditNoteTotalAmountWithTax;
            srs.debitNoteRef = cnr.debitNoteRef;
            srs.taxInvoiceRef = cnr.taxInvoiceRef;
   
            creditNotes.push(srs)
         }
      }
   }

   res.json({ creditNotes, page, pages: Math.ceil(count / pageSize) })
})

/** Dashboard Functions Start */
const getYTDNetCreditNote = asyncHandler(async () => {
   let ytdNetCreditNote = 0;
  
   let firstDateOfFiscalYear = getFirstDayOfFiscalYear();
   let lastDateOfFiscalYear = getLastDayOfFiscalYear();

   let year = new Date(firstDateOfFiscalYear).getFullYear();
   let month = new Date(firstDateOfFiscalYear).getMonth();
   let date = new Date(firstDateOfFiscalYear).getDate();

   let year1 = new Date(lastDateOfFiscalYear).getFullYear();
   let month1 = new Date(lastDateOfFiscalYear).getMonth();
   let date1 = new Date(lastDateOfFiscalYear).getDate();

   let findQuery = {
      "creditNoteDate": { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
   };

   const cnDetailsRecords = await CreditNote.find(findQuery).sort({ _id:-1 })
   if(cnDetailsRecords.length > 0) {
      cnDetailsRecords.forEach(cn => {
         ytdNetCreditNote += cn.creditNoteTotalAmount
      })
   }
   return ytdNetCreditNote.toFixed(2);

})

const getMTDCreditNote = asyncHandler(async () => {
   console.log("Inside getMTDCreditNote".red.bold)
   let mtdCreditNote = 0;

   let firstDateOfMonth = getFirstDayOfMonth();
   let lastDateOfMonth = getLastDayOfMonth();

   let year = new Date(firstDateOfMonth).getFullYear();
   let month = new Date(firstDateOfMonth).getMonth();
   let date = new Date(firstDateOfMonth).getDate();

   let year1 = new Date(lastDateOfMonth).getFullYear();
   let month1 = new Date(lastDateOfMonth).getMonth();
   let date1 = new Date(lastDateOfMonth).getDate();

   let findQuery = {
      "creditNoteDate": { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
   };

   const dbRecords = await CreditNote.find(findQuery).sort({ _id:-1 })

   if(dbRecords.length > 0) {
      dbRecords.forEach(dn => {
         mtdCreditNote += dn.creditNoteTotalAmount
      })
   }
   return mtdCreditNote.toFixed(2);
})

const getMonthlyPPMCreditData = asyncHandler(async () => {
   console.log("1. Inside getMonthlyPPMCreditData ------------>")
   let ytdNetSale = 0;

   const monthsArray = [ 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March' ]
   const creditDate = [ 770, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 , 0 ]
   
   let firstDateOfFiscalYear = getFirstDayOfFiscalYear();
   let lastDateOfFiscalYear = getLastDayOfFiscalYear();

   let year = new Date(firstDateOfFiscalYear).getFullYear();
   let month = new Date(firstDateOfFiscalYear).getMonth();
   let date = new Date(firstDateOfFiscalYear).getDate();

   let year1 = new Date(lastDateOfFiscalYear).getFullYear();
   let month1 = new Date(lastDateOfFiscalYear).getMonth();
   let date1 = new Date(lastDateOfFiscalYear).getDate();

   let findQuery = {
      "creditNoteDate": { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
   };

   const result = await CreditNote.aggregate([
      { $unwind: "$creditNoteDetails" },
      { $match: { 
            creditNoteDate: { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
         } 
      },
      {
         $group: {
            
            _id: { "year_month": { $substrCP: [ "$creditNoteDate", 0, 7 ] } }, 
            //total: { $sum: 1 }
            total: { $sum: "$creditNoteDetails.returnedQty" }
            // _id: '$creditNoteDate',
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
   console.log("@@@@@@@@@@@@@@@@@@ Result is      ==== ", result)

   if(result.length > 0) {
      const propertyNames = Object.keys(result[0].data);

      const propertyValues = Object.values(result[0].data);
      console.log(propertyNames)
      console.log(propertyValues);

      let n = 0;
      propertyNames.forEach(elem => {
         let index = monthsArray.indexOf(elem)
         // console.log("Month is ", elem)
         // console.log("Found Index is ", index)
         // console.log("Matching Value ", propertyValues[n])
         creditDate[index] = (propertyValues[n])
         n++; 
         // console.log("Month is ", elem)
         // monthsArray.forEach(m => {
         //    //console.log(monthsArray.indexOf(elem))
         //    
         // });
      });
   
      let monthlyCreditData = {"Months":monthsArray, "Credit" : creditDate}
      console.log(">>>>> getMonthlyPPMCreditData ",monthlyCreditData)
      return monthlyCreditData;
   } else {
      let monthlyCreditData = {"Months":monthsArray, "Credit" : []}
      return monthlyCreditData;
   }

})

/** Dashboard Functions End */

// @desc    Get all Credit Note Records With Tax
// @route   None
// @access  Private
const findAllCreditNotesForADay = asyncHandler(async () => {
   console.log("----> have reached heer in findAllInvoicesForADay >>>>>>>>>>>>")
   let findQuery = {}
   let startDate = new Date();

   let creditNotesCount = 0;
   let totalCNAmountWithoutTax = 0;
   let totalCNAmountWithTax = 0;

   let response = {};
   
   findQuery["creditNoteDate"] = { $gte: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()), 
      $lte: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()+1) }

   console.log("----> have reached heer in before firing query >>>>>>>>>>>>".yellow)
   const creditNotes = await CreditNote.find(findQuery)
                     console.log("----> have reached heer in AFTER firing query >>>>>>>>>>>>".white)
   if(creditNotes.length > 0) {
      creditNotesCount = creditNotes.length;
      for (const cn of creditNotes) {
         totalCNAmountWithoutTax += cn.creditNoteTotalAmount
         totalCNAmountWithTax += cn.creditNoteTotalAmountWithTax
      }
   }
   console.log("----> all well leaving >>>>>>>>>>>>".pink)
   response['creditNotesCount'] = creditNotesCount;
   response['totalCNAmountWithoutTax'] = totalCNAmountWithoutTax;
   response['totalCNAmountWithTax'] = totalCNAmountWithTax;

   return response;
})

export {
	createCreditNote,
	getCreditNoteById,
	updateCreditNote,
	getAllCreditNotes,
	getAllMasterDataForCreditNote,
   getMTDCreditNote,
   getYTDNetCreditNote,
   getAllCreditNotesWithTax,
   getMonthlyPPMCreditData,
   findAllCreditNotesForADay
}