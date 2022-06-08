import asyncHandler from 'express-async-handler';
import DeliveryNote from './../../models/sales/deliveryNoteModel.js';
import AutoIncrement from './../../models/autoincrement/autoIncrementModel.js';
import { DELIVERY_NOTE_MODULE_PREFIX } from '../../config/moduleConstants.js';
import { getSalesInvoicesForDelivery, getSalesInvoicesForDispatch, updateSalesInvoiceStatusAfterDelivery, updateSalesInvoiceStatusAfterDispatch } from './salesInvoiceController.js';

// @desc    Create new Delivery Note Record
// @route   POST /api/deliverynote
// @access  Private

const createDeliveryNote = asyncHandler(async (req, res) => {
   const {
      salesInvoiceNumber,
      customer,
      totalBoxes,
      totalBoxWeight,
      deliveryDetails
	} = req.body;
   
   const autoIncrementedNo = await AutoIncrement.getNextId(DELIVERY_NOTE_MODULE_PREFIX)

   const deliveryNote = new DeliveryNote({
		company: req.user.company,
		createdBy: req.user._id,
		updatedBy: req.user._id,
      deliveryNumber: autoIncrementedNo,
      salesInvoiceNumber,
      customer,
      totalBoxes,
      totalBoxWeight,
      deliveryDetails
	});

   //console.log("2. Now printing deliveryNote record to be inserted")
   //console.log(deliveryNote)

   try {
		const createdDeliveryNote = await deliveryNote.save();
		//console.log("Created REcord is >>>>>> ", createDeliveryNote);
      if(createdDeliveryNote) {
         const aiv = await AutoIncrement.setNextId(DELIVERY_NOTE_MODULE_PREFIX)
         //console.log("Before Returning Sales Invocie Data --------->")
         //update Sales Invoice
         const updatedSalesInvoice = await updateSalesInvoiceStatusAfterDelivery(salesInvoiceNumber, req.user._id);
         res.status(201).json(createdDeliveryNote)
      }
     
   } catch (error) {
		//console.log("Inside create Delivery Note while creating error ==== ", error)
		res.status(400)
		throw new Error('Error in creating Delivery Note Record')
   }

})

// @desc    Get DeliveryNote Record by ID
// @route   GET /api/deliverynote/:id
// @access  Private

const getDeliveryNoteById = asyncHandler(async (req, res) => {
   const deliveryNote = 
      await DeliveryNote.findById(req.params.id)
         .populate('customer', 'custName custBillingAddress custShipingAddress custGST')
         .populate('salesInvoiceNumber', 'salesInvoiceNumber salesInvoiceDate billState shipState salesInvoiceTotalAmount salesInvoiceTotalAmountWithTax salesInvoiceDetails')
         .exec()

   if (deliveryNote) {
      console.log("2. Inside getDeliveryNoteById function ------------>", deliveryNote)
      res.json(deliveryNote)
   } else {
      res.status(404)
      throw new Error('Record Not Found')
   }
})

// @desc    Update DeliveryNote Record
// @route   PUT /api/deliverynote/:id
// @access  Private
const updateDeliveryNote = asyncHandler(async (req, res) => { 
   //console.log("3. Inside updateDeliveryNote function ------------>")
   const deliveryNote = await DeliveryNote.findById(req.params.id)
	if (deliveryNote) {
		try {
         deliveryNote.updatedBy = req.user._id;
         deliveryNote.deliveryNumber = deliveryNote.deliveryNumber,
         deliveryNote.salesInvoiceNumber = deliveryNote.salesInvoiceNumber,
         deliveryNote.customer = deliveryNote.customer,
         deliveryNote.totalBoxes = req.body.totalBoxes || deliveryNote.totalBoxes;
         deliveryNote.totalBoxWeight = req.body.totalBoxWeight || deliveryNote.totalBoxWeight;
         deliveryNote.deliveryDetails = req.body.deliveryDetails || deliveryNote.deliveryDetails;
         const updatedDeliveryNote = await deliveryNote.save()
			//console.log("Updated DELIVERY NOTE RECORD IS ", updatedDeliveryNote)
         res.status(201).json(updatedDeliveryNote)
      } catch (error) {
			//console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating DeliveryNote Record')
		}
   } else {
		res.status(400)
		throw new Error('Invalid DeliveryNote data')
	}
})

// @desc    Delete a DeliveryNote Record
// @route   DELETE /api/deliverynote/:id
// @access  Private
const deleteDeliveryNote = asyncHandler(async (req, res) => { 
   //console.log("4. Inside deleteDeliveryNote function ------------>")
   const deliveryNote = await DeliveryNote.findById(req.params.id)
 
   if (deliveryNote) {
     await deliveryNote.remove()
     res.json({ message: 'DeliveryNote removed' })
   } else {
     res.status(404)
     throw new Error('DeliveryNote not found')
   }
})

// @desc    Get all DeliveryNote Records
// @route   GET /api/deliverynote/all
// @access  Private
const getAllDeliveryNotes = asyncHandler(async (req, res) => {
   //console.log("5. Inside getAllDeliveryNotes function ------------>")
   const pageSize = 10000
   const page = Number(req.query.pageNumber) || 1

   const count = await DeliveryNote.countDocuments()
   //console.log("Total records count are ==== ", count)

   const deliveryNotes = 
      await DeliveryNote.find({})
         .sort({ _id:-1 })
         .populate('customer', 'custName custBillingAddress custShipingAddress custGST')
         .populate('salesInvoiceNumber', 'salesInvoiceNumber billState shipState salesInvoiceDate salesInvoiceDetails')
         .limit(pageSize)
         .skip(pageSize * (page - 1))


   //console.log("Total DeliveryNote are ==== ", deliveryNotes)
   //console.log("Page Number is ==== ", page)
   //console.log("Total pages are ==== ", Math.ceil(count / pageSize))
	//console.log(deliveryNotes)
	
   res.json({ deliveryNotes, page, pages: Math.ceil(count / pageSize) })

})

// @desc    Get all Required Master Data for DeliveryNote Screen
// @route   GET /api/deliverynote/masterdata
// @access  Private
const getAllMasterDataForDeliveryNote = asyncHandler(async (req, res) => {
   const salesInvoices = await getSalesInvoicesForDelivery();
   res.json({ salesInvoices })
})

/** ______________________________________________________________________________________ */

/** The below functions are for Dispatch Details  */

// @desc    Create new Dispatch Details and update Delivery Note Record
// @route   PUT /api/dispatchdetails/updatedispatch
// @access  Private

const updateDeliveryNoteAndCreateDispatchDetails = asyncHandler(async (req, res) => {
   let salesInvoiceNo = req.params.id;
   console.log("Inside updateDeliveryNoteAndCreateDispatchDetails Method ============= ", req.params.id)
   console.log("Inside updateDeliveryNoteAndCreateDispatchDetails Method ============= ", salesInvoiceNo)
   //console.log("Inside Create Dispatch Details Method salesInvoiceNo ============= ", salesInvoiceNo)
   const deliveryNote = await DeliveryNote.findOne({ salesInvoiceNumber:salesInvoiceNo })
	
   if (deliveryNote) {
		try {
         deliveryNote.updatedBy = req.user._id;
         deliveryNote.deliveryNumber = deliveryNote.deliveryNumber,
         deliveryNote.salesInvoiceNumber = deliveryNote.salesInvoiceNumber,
         deliveryNote.customer = deliveryNote.customer,
         deliveryNote.totalBoxes = deliveryNote.totalBoxes;
         deliveryNote.totalBoxWeight = deliveryNote.totalBoxWeight;
         deliveryNote.deliveryDetails = deliveryNote.deliveryDetails;
         //update dispatch details
         deliveryNote.deliveryStatus = "DD";
         deliveryNote.dispatchDate = new Date();
         deliveryNote.invoiceValue = req.body.invoiceValue;
         deliveryNote.transporter = req.body.transporter;
         deliveryNote.modeOfTransport = req.body.modeOfTransport;
         deliveryNote.freightCharges = req.body.freightCharges;
         deliveryNote.freightType = req.body.freightType;
         deliveryNote.deliveryType = req.body.deliveryType;
         deliveryNote.docketNumber = req.body.docketNumber;
         deliveryNote.docketDate = req.body.docketDate;
         deliveryNote.freightPercent = ((100*parseFloat(req.body.freightCharges))/parseFloat(req.body.invoiceValue)).toFixed(2);

         const updatedDeliveryNote = await deliveryNote.save()
			//console.log("Updated JOBCARD RECORD IS ", updatedDeliveryNote)
         //update Sales Invoice Status
         const updatedSalesInvoice = await updateSalesInvoiceStatusAfterDispatch(salesInvoiceNo, req.user._id);

         res.status(201).json(updatedDeliveryNote)
      } catch (error) {
			console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating DeliveryNote Record')
		}
   } else {
		res.status(400)
		throw new Error('Invalid DeliveryNote data')
	}

})

// @desc    Get all DeliveryNote Records
// @route   GET /api/dispatchdetails/all
// @access  Private
const getAllDispatchDetails = asyncHandler(async (req, res) => {
   //console.log("6. Inside getAllDispatchDetails function ------------>")
   const pageSize = 10000
   const page = Number(req.query.pageNumber) || 1

   const count = await DeliveryNote.countDocuments()
   //console.log("Total records count are ==== ", count)

   const dispatchDetails = 
      await DeliveryNote.find({deliveryStatus : "DD"})
         .sort({ _id:-1 })
         .populate('customer', 'custName custBillingAddress custShipingAddress custGST')
         .populate('salesInvoiceNumber', 'salesInvoiceNumber billState shipState salesInvoiceTotalAmount salesInvoiceTotalAmountWithTax salesInvoiceDate salesInvoiceDetails')
         .limit(pageSize)
         .skip(pageSize * (page - 1))


   //console.log("Total DeliveryNote are ==== ", dispatchDetails)
   ////console.log("Page Number is ==== ", page)
   ////console.log("Total pages are ==== ", Math.ceil(count / pageSize))
	//console.log(dispatchDetails)
	
   res.json({ dispatchDetails, page, pages: Math.ceil(count / pageSize) })

})

// @desc    Update DeliveryNote Record
// @route   PUT /api/dispatchdetails/:id
// @access  Private
const updateDispatchDetails = asyncHandler(async (req, res) => { 
   console.log("3. Inside updateDispatchDetails function ------------>", req.params.id)
  
   const deliveryNote = await DeliveryNote.findById(req.params.id)
	
   if (deliveryNote) {
		try {
         deliveryNote.updatedBy = req.user._id;
         deliveryNote.deliveryNumber = deliveryNote.deliveryNumber,
         deliveryNote.salesInvoiceNumber = deliveryNote.salesInvoiceNumber,
         deliveryNote.customer = deliveryNote.customer,
         deliveryNote.totalBoxes = deliveryNote.totalBoxes;
         deliveryNote.totalBoxWeight = deliveryNote.totalBoxWeight;
         deliveryNote.deliveryDetails = deliveryNote.deliveryDetails;
         //update dispatch details
         deliveryNote.deliveryStatus = "DD"; 
         deliveryNote.dispatchDate = req.body.dispatchDate || deliveryNote.dispatchDate;
         deliveryNote.invoiceValue = req.body.invoiceValue || deliveryNote.invoiceValue;
         deliveryNote.transporter = req.body.transporter || deliveryNote.transporter;
         deliveryNote.modeOfTransport = req.body.modeOfTransport || deliveryNote.modeOfTransport;
         deliveryNote.freightCharges = req.body.freightCharges || deliveryNote.freightCharges;
         deliveryNote.freightType = req.body.freightType || deliveryNote.freightType;
         deliveryNote.deliveryType = req.body.deliveryType || deliveryNote.deliveryType;
         deliveryNote.docketNumber = req.body.docketNumber || deliveryNote.docketNumber;
         deliveryNote.docketDate = req.body.docketDate || deliveryNote.docketDate;
         deliveryNote.freightPercent = (
                                          (100*parseFloat(req.body.freightCharges))/parseFloat(req.body.invoiceValue)
                                       ).toFixed(2)
         const updatedDeliveryNote = await deliveryNote.save()
			//console.log("Updated JOBCARD RECORD IS ", updatedDeliveryNote)
         res.status(201).json(updatedDeliveryNote)
      } catch (error) {
			//console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating DeliveryNote Record')
		}
   } else {
		res.status(400)
		throw new Error('Invalid DeliveryNote data')
	}
})

// @desc    Delete DeliveryNote Record
// @route   DELETE /api/dispatchdetails/:id
// @access  Private
const deleteDispatchDetails = asyncHandler(async (req, res) => { 
   //console.log("3. Inside deleteDispatchDetails function ------------>")

})

// @desc    Get DeliveryNote Record by ID
// @route   GET /api/dispatchdetails/:id
// @access  Private

const getDispatchDetailsById = asyncHandler(async (req, res) => {
   //console.log("2. Inside getDispatchDetailsById function ------------>")

})

// @desc    Get all Required Master Data for DeliveryNote Screen
// @route   GET /api/dispatchdetails/masterdata
// @access  Private
const getAllMasterDataForDispatchDetails = asyncHandler(async (req, res) => {
   console.log("2. Inside getAllMasterDataForDispatchDetails function ------------>")
   const salesInvoices = await getSalesInvoicesForDispatch();
   res.json({ salesInvoices })
})

// @desc    Get all Dispatches for a day
// @route   None
// @access  Private
const findAllDispatchesForADay = asyncHandler(async () => {
   console.log("----> have reached heer in findAllOrdersForADay >>>>>>>>>>>>")
   let findQuery = {}
   let startDate = new Date();

   let dispatchesCount = 0;
   
   let response = {};
   
   findQuery["dispatchDate"] = { $gte: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()), 
      $lte: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()+1) }

   console.log("----> have reached heer in before firing query >>>>>>>>>>>>".yellow)
   const dispatches = await DeliveryNote.find(findQuery)
                     console.log("----> have reached heer in AFTER firing query >>>>>>>>>>>>".white)
   if(dispatches.length > 0) {
      dispatchesCount = dispatches.length;
   }
   console.log("----> all well leaving >>>>>>>>>>>>".pink)
   response['dispatchesCount'] = dispatchesCount;

   return response;
})

export {
   createDeliveryNote,
   getAllDeliveryNotes,
   deleteDeliveryNote,
   updateDeliveryNote,
   getDeliveryNoteById,
   getAllMasterDataForDeliveryNote,
   //dispatch details
   updateDeliveryNoteAndCreateDispatchDetails,
   getAllDispatchDetails,
   updateDispatchDetails,
   getDispatchDetailsById,
   deleteDispatchDetails,
   getAllMasterDataForDispatchDetails,
   findAllDispatchesForADay
}