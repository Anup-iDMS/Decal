import asyncHandler from 'express-async-handler';
import AutoIncrement from './../../models/autoincrement/autoIncrementModel.js';
import PDIRTemplate from './../../models/qa/PDIRTemplateModel.js';
import { findAllInspectionMethods } from './InspectionMethodController.js';
import { findAllInspectionParameters } from './InspectionParamertsController.js';
import { 
   getAllProductCategories,
   getAllProductCodes,
} from './../master/appControllers.js';

// @desc    Create new PDIRTemplate Record
// @route   POST /api/qa/pdirtemplates
// @access  Private

const createPDIRTemplate = asyncHandler(async (req, res) => {
	//console.log("Inside create PDIRTemplate function.....", )
	const {
		pdirTemplateCode,
      pdirTemplateName,
		productCode,
      pdirDetails
	} = req.body;

	let pdirDetails1 = pdirDetails.slice(1);

	const newpdirDetails = [...pdirDetails1]
   const newpdirDetails1 = newpdirDetails.map((pd,index) => {
      //console.log("??????????? sod.id ========= ", sod.id)
      if(pd.id) {
         pd.lineNumber = (index+1);
         return pd;
      }
   })
	
	const pdirTemplate = new PDIRTemplate({
		pdirTemplateCode,
		pdirTemplateName,
		productCode,
      pdirDetails: newpdirDetails1,
		company: req.user.company,
		createdBy: req.user._id,
		updatedBy: req.user._id,
	});
	console.log(":::::::: BEFORE creating PDIRTemplate REcord is >>>>>> ", pdirTemplate);
	try {
		const createPDIRTemplate = await pdirTemplate.save();
		console.log("Created REcord is >>>>>> ", createPDIRTemplate);
		if (createPDIRTemplate) {
			const aiv = await AutoIncrement.setNextId("PDIRTEMPLATE")
         res.status(201).json(createPDIRTemplate)
      } else {
         res.status(400)
         throw new Error('Invalid Inspection Method data')
      }
		//res.status(201).json(createPDIRTemplate);
    } catch (error) {
		console.log("Inside error while creating error ==== ", error)
		res.status(400)
		throw new Error('Invalid PDIRTemplate data')
    }
});

// @desc    Get PDIRTemplate Record by ID
// @route   GET /api/qa/pdirtemplates/:id
// @access  Private

const getPDIRTemplateById = asyncHandler(async (req, res) => {
    console.log(">>>>> Inside get PDIRTemplate By Id")
    const pdirTemplate = await PDIRTemplate.findById(req.params.id).populate('user','name email').populate('company').exec()
    if (pdirTemplate) {
        console.log("PDIRTemplate Record is .... ", pdirTemplate)
        res.json(pdirTemplate)
    } else {
        res.status(404)
        throw new Error('Record Not Found')
    }
})

// @desc    Update PDIRTemplate Record
// @route   PUT /api/qa/pdirtemplates/:id
// @access  Private
const updatePDIRTemplate = asyncHandler(async (req, res) => {
	console.log("Inside UPDATE PDIRTemplate and ID is ", req.params.id)
	const pdirTemplate = await PDIRTemplate.findById(req.params.id)
	if (pdirTemplate) {
		try {
			
			pdirTemplate.updatedBy = req.user._id;
			pdirTemplate.pdirTemplateCode = pdirTemplate.pdirTemplateCode
			pdirTemplate.isActive = req.body.isActive || pdirTemplate.isActive
			pdirTemplate.pdirTemplateName = req.body.pdirTemplateName || pdirTemplate.pdirTemplateName
			pdirTemplate.pdirDetails = req.body.pdirDetails || pdirTemplate.pdirDetails
			
			const updatedPDIRTemplate = await pdirTemplate.save()
			console.log("Updated MODULE RECORD IS ", updatedPDIRTemplate)
			res.status(201).json(updatedPDIRTemplate)
		} catch (error) {
			console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating PDIRTemplate Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid PDIRTemplate data')
	}
});

// @desc    Delete a PDIRTemplate Record
// @route   DELETE /api/qa/pdirtemplates/:id
// @access  Private
const deletePDIRTemplate = asyncHandler(async (req, res) => {
  console.log("Inside DELETE PDIRTemplate and ID is ", req.params.id)
  const pdirTemplate = await PDIRTemplate.findById(req.params.id)

  if (pdirTemplate) {
    await pdirTemplate.remove()
    res.json({ message: 'PDIRTemplate removed' })
  } else {
    res.status(404)
    throw new Error('PDIRTemplate not found')
  }
})

// @desc    Get all PDIRTemplate Records
// @route   GET /api/qa/pdirtemplates/all
// @access  Private
const getAllPDIRTemplates = asyncHandler(async (req, res) => {
    console.log(">>>>> Inside getAllPDIRTemplates WITH PAGINATION--- === ")
    const pageSize = Number(req.query.pageSize) || 1000
    const page = Number(req.query.pageNumber) || 1

    const count = await PDIRTemplate.countDocuments()
    console.log("Total records count are ==== ", count)

    const pdirTemplates = await PDIRTemplate.find().limit(pageSize)
    .skip(pageSize * (page - 1))
    res.json({ pdirTemplates, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get all PDIRTemplate Records
// @route   none
// @access  Private
const findAllPDIRTemplates = asyncHandler(async () => {
	//console.log(">>>>> Inside getAllPDIRTemplates WITH PAGINATION--- === ", req.user._id)
	const pdirTemplates = await PDIRTemplate.find({isActive:"Yes"})
	return pdirTemplates;
})

// @desc    Get all Required Master Data for PDIRTemplate Screen
// @route   GET /api/qa/pdirtemplates/masterdata
// @access  Private
const getAllMasterDataForPDIRTemplate = asyncHandler(async (req, res) => {
	let autoIncrementedPDIRTemplateNo = "";
	const autoIncrementedNo = await AutoIncrement.getNextId("PDIRTEMPLATE")

	if(autoIncrementedNo < 10) {
      autoIncrementedPDIRTemplateNo = "PT/000"+autoIncrementedNo;
   } else if(autoIncrementedNo < 100) {
      autoIncrementedPDIRTemplateNo = "PT/00"+autoIncrementedNo;
   } else if(autoIncrementedNo < 1000) {
      autoIncrementedPDIRTemplateNo = "PT/0"+autoIncrementedNo;
   } else {
      autoIncrementedPDIRTemplateNo = "PT/"+autoIncrementedNo;
   }

	const prodCategories = await getAllProductCategories();
   const prodCodes = await getAllProductCodes();
	const inspectionparams = await findAllInspectionParameters();
	const inspectionmethods = await  findAllInspectionMethods();

	res.json({ prodCategories, prodCodes, inspectionparams, inspectionmethods, autoIncrementedPDIRTemplateNo })
})


export {
	createPDIRTemplate,
	getPDIRTemplateById,
	updatePDIRTemplate,
	deletePDIRTemplate,
	getAllPDIRTemplates,
	getAllMasterDataForPDIRTemplate,
	findAllPDIRTemplates
}