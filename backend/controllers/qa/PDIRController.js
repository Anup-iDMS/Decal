import asyncHandler from 'express-async-handler';
import AutoIncrement from './../../models/autoincrement/autoIncrementModel.js';
import PDIR from './../../models/qa/PDIRModel.js';
import { findAllInspectionMethods } from './InspectionMethodController.js';
import { findAllInspectionParameters } from './InspectionParamertsController.js';
import { 
   getAllProductCategories,
   getAllProductCodes,
} from './../master/appControllers.js';
import { getAllCustomers } from '../master/customerControllers.js';
import { findAllPDIRTemplates } from './PDIRTemplateController.js';


// @desc    Create new PDIR Record
// @route   POST /api/qa/pdir
// @access  Private

const createPDIR = asyncHandler(async (req, res) => {
	console.log("------------>>>> Inside create PDIR function.....", )
	const {
		pdirCode,
		productCode,
		salesInvoiceNumber,
		customer,
		pdirDate,
		disposition,
		approvedBy,
		invoiceLineDetails
	} = req.body;

	//let pdirDetails1 = pdirDetails.slice(1);
	console.log("??????????? sod.id ========= ", invoiceLineDetails)
	const newpInvDetails = [...invoiceLineDetails]
   const newpInvDetails1 = newpInvDetails.map((id,index) => {
      //
      if(id.id) {
         id.lineNumber = (index+1);
			const newpdirDetails = [...id.pdirDetails]
			const newpdirDetails1 = newpdirDetails.map((pd,index1) => {
				pd.lineNumber = (index1+1);

				return pd;
			})
         return id;
      }
   })
	
	const pdirTemplate = new PDIR({
		company: req.user.company,
		createdBy: req.user._id,
		updatedBy: req.user._id,
		pdirCode,
		productCode,
		salesInvoiceNumber,
		customer,
		pdirDate,
		disposition,
		approvedBy,
		invoiceLineDetails: newpInvDetails1
	});
	console.log(":::::::: BEFORE creating PDIR REcord is >>>>>> ", pdirTemplate.invoiceLineDetails[0].pdirDetails);
	//return;
	try {
		const createPDIR = await pdirTemplate.save();
		console.log("Created REcord is >>>>>> ", createPDIR);
		if (createPDIR) {
			const aiv = await AutoIncrement.setNextId("PDIR")
         res.status(201).json(createPDIR)
      } else {
         res.status(400)
         throw new Error('Invalid Inspection Method data')
      }
		//res.status(201).json(createPDIR);
    } catch (error) {
		console.log("Inside error while creating error ==== ", error)
		res.status(400)
		throw new Error('Invalid PDIR data')
    }
});

// @desc    Get PDIR Record by ID
// @route   GET /api/qa/pdir/:id
// @access  Private

const getPDIRById = asyncHandler(async (req, res) => {
	console.log(">>>>> Inside get PDIR By Id")

	const pdir = await PDIR.findById(req.params.id)
										.populate('customer', 'custName custCode')
										.populate('salesInvoiceNumber', 'salesInvoiceNumber salesInvoiceDate salesInvoiceDetails')
										.exec()
	
	if (pdir) {
        console.log("PDIR Record is .... ", pdir)
        res.json(pdir)
	} else {
		res.status(404)
		throw new Error('Record Not Found')
	}
})

// @desc    Update PDIR Record
// @route   PUT /api/qa/pdir/:id
// @access  Private
const updatePDIR = asyncHandler(async (req, res) => {
	console.log("Inside UPDATE PDIR and ID is ", req.params.id)
	const pdirTemplate = await PDIR.findById(req.params.id)
	if (pdirTemplate) {
		try {
			
			pdirTemplate.updatedBy = req.user._id;
			pdirTemplate.pdirTemplateCode = pdirTemplate.pdirTemplateCode
			pdirTemplate.isActive = req.body.isActive || pdirTemplate.isActive
			pdirTemplate.pdirTemplateName = req.body.pdirTemplateName || pdirTemplate.pdirTemplateName
			pdirTemplate.disposition = req.body.disposition
			pdirTemplate.invoiceLineDetails = req.body.invoiceLineDetails
			
			const updatedPDIR = await pdirTemplate.save()
			console.log("Updated MODULE RECORD IS ", updatedPDIR.invoiceLineDetails[0].pdirDetails)
			res.status(201).json(updatedPDIR)
		} catch (error) {
			console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating PDIR Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid PDIR data')
	}
});

// @desc    Delete a PDIR Record
// @route   DELETE /api/qa/pdir/:id
// @access  Private
const deletePDIR = asyncHandler(async (req, res) => {
  console.log("Inside DELETE PDIR and ID is ", req.params.id)
  const pdirTemplate = await PDIR.findById(req.params.id)

  if (pdirTemplate) {
    await pdirTemplate.remove()
    res.json({ message: 'PDIR removed' })
  } else {
    res.status(404)
    throw new Error('PDIR not found')
  }
})

// @desc    Get all PDIR Records
// @route   GET /api/qa/pdir/all
// @access  Private
const getAllPDIRs = asyncHandler(async (req, res) => {
	console.log(">>>>> Inside getAllPDIRs WITH PAGINATION--- === ")
	const pageSize = Number(req.query.pageSize) || 1000
	const page = Number(req.query.pageNumber) || 1

	const count = await PDIR.countDocuments()
	console.log("Total records count are ==== ", count)
	
	const pdirs = await PDIR.find({})
	.sort({ pdirCode:-1 })
	.populate('customer', 'custName custCode')
	.populate('salesInvoiceNumber ', 'salesInvoiceNumber')
	.limit(pageSize)
	.skip(pageSize * (page - 1))

	console.log("Total records count are ==== ", pdirs)
	res.json({ pdirs, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get all PDIR Records
// @route   none
// @access  Private
const findAllPDIRs = asyncHandler(async () => {
	//console.log(">>>>> Inside getAllPDIRs WITH PAGINATION--- === ", req.user._id)
	const pdirs = await PDIR.find({isActive:"Yes"})
	return pdirs;
})

// @desc    Get all Required Master Data for PDIR Screen
// @route   GET /api/qa/pdir/masterdata
// @access  Private
const getAllMasterDataForPDIR = asyncHandler(async (req, res) => {
	let autoIncrementePDIRNo = "";
	const autoIncrementedNo = await AutoIncrement.getNextId("PDIR")
	const customers = await getAllCustomers();
	const pdirTemplates = await findAllPDIRTemplates();

	if(autoIncrementedNo < 10) {
      autoIncrementePDIRNo = "PDIR/000"+autoIncrementedNo;
   } else if(autoIncrementedNo < 100) {
      autoIncrementePDIRNo = "PDIR/00"+autoIncrementedNo;
   } else if(autoIncrementedNo < 1000) {
      autoIncrementePDIRNo = "PDIR/0"+autoIncrementedNo;
   } else {
      autoIncrementePDIRNo = "PDIR/"+autoIncrementedNo;
   }

	const prodCategories = await getAllProductCategories();
   const prodCodes = await getAllProductCodes();
	const inspectionparams = await findAllInspectionParameters();
	const inspectionmethods = await  findAllInspectionMethods();

	res.json({ prodCategories, prodCodes, inspectionparams, customers, pdirTemplates, inspectionmethods, autoIncrementePDIRNo })
})


export {
	createPDIR,
	getPDIRById,
	updatePDIR,
	deletePDIR,
	getAllPDIRs,
	getAllMasterDataForPDIR,
	findAllPDIRs
}