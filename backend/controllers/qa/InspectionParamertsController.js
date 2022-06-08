import asyncHandler from 'express-async-handler';
import InspectionParameter from './../../models/qa/InspectionParemeterModel.js';
import AutoIncrement from './../../models/autoincrement/autoIncrementModel.js';



// @desc    Create new InspectionParameter Record
// @route   POST /api/qa/inspectionparams
// @access  Private

const createInspectionParameter = asyncHandler(async (req, res) => {
	//console.log("Inside create InspectionParameter function.....", )
	const {
		inspectionParameterCode,
      inspectionParameterName
	} = req.body;
	
	const inspectionParameter = new InspectionParameter({
		inspectionParameterCode,
		inspectionParameterName,
		company: req.user.company,
		createdBy: req.user._id,
		updatedBy: req.user._id,
	});
	console.log(":::::::: BEFORE creating InspectionParameter REcord is >>>>>> ", inspectionParameter);
	try {
		const createInspectionParameter = await inspectionParameter.save();
		console.log("Created REcord is >>>>>> ", createInspectionParameter);
		if (createInspectionParameter) {
			const aiv = await AutoIncrement.setNextId("INSPECTIONPARAM")
         res.status(201).json(createInspectionParameter)
      } else {
         res.status(400)
         throw new Error('Invalid Inspection Parameter data')
      }
		//res.status(201).json(createInspectionParameter);
    } catch (error) {
		console.log("Inside error while creating error ==== ", error)
		res.status(400)
		throw new Error('Invalid InspectionParameter data')
    }
});

// @desc    Get InspectionParameter Record by ID
// @route   GET /api/qa/inspectionparams/:id
// @access  Private

const getInspectionParameterById = asyncHandler(async (req, res) => {
    console.log(">>>>> Inside get InspectionParameter By Id")
    const inspectionParameter = await InspectionParameter.findById(req.params.id).populate('user','name email').populate('company').exec()
    if (inspectionParameter) {
        console.log("InspectionParameter Record is .... ", inspectionParameter)
        res.json(inspectionParameter)
    } else {
        res.status(404)
        throw new Error('Record Not Found')
    }
})

// @desc    Update InspectionParameter Record
// @route   PUT /api/qa/inspectionparams/:id
// @access  Private
const updateInspectionParameter = asyncHandler(async (req, res) => {
	console.log("Inside UPDATE InspectionParameter and ID is ", req.params.id)
	const inspectionParameter = await InspectionParameter.findById(req.params.id)
	if (inspectionParameter) {
		try {
			
			inspectionParameter.updatedBy = req.user._id;
			inspectionParameter.inspectionParameterCode = inspectionParameter.inspectionParameterCode
			inspectionParameter.isActive = req.body.isActive || inspectionParameter.isActive
			inspectionParameter.inspectionParameterName = req.body.inspectionParameterName || inspectionParameter.inspectionParameterName
			
			const updatedInspectionParameter = await inspectionParameter.save()
			console.log("Updated MODULE RECORD IS ", updatedInspectionParameter)
			res.status(201).json(updatedInspectionParameter)
		} catch (error) {
			console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating InspectionParameter Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid InspectionParameter data')
	}
});

// @desc    Delete a InspectionParameter Record
// @route   DELETE /api/qa/inspectionparams/:id
// @access  Private
const deleteInspectionParameter = asyncHandler(async (req, res) => {
  console.log("Inside DELETE InspectionParameter and ID is ", req.params.id)
  const inspectionParameter = await InspectionParameter.findById(req.params.id)

  if (inspectionParameter) {
    await inspectionParameter.remove()
    res.json({ message: 'InspectionParameter removed' })
  } else {
    res.status(404)
    throw new Error('InspectionParameter not found')
  }
})

// @desc    Get all InspectionParameter Records
// @route   GET /api/qa/inspectionparams/all
// @access  Private
const getAllInspectionParameters = asyncHandler(async (req, res) => {
    console.log(">>>>> Inside getAllInspectionParameters WITH PAGINATION--- === ")
    const pageSize = Number(req.query.pageSize) || 1000
    const page = Number(req.query.pageNumber) || 1

    const count = await InspectionParameter.countDocuments()
    console.log("Total records count are ==== ", count)

    const inspectionparams = await InspectionParameter.find().limit(pageSize)
    .skip(pageSize * (page - 1))
    res.json({ inspectionparams, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get all InspectionParameter Records
// @route   none
// @access  Private
const findAllInspectionParameters = asyncHandler(async () => {
	//console.log(">>>>> Inside getAllInspectionParameters WITH PAGINATION--- === ", req.user._id)
	const inspectionparams = await InspectionParameter.find({isActive:"Yes"})
	return inspectionparams;
})

// @desc    Get all Required Master Data for InspectionParameter Screen
// @route   GET /api/qa/inspectionparams/masterdata
// @access  Private
const getAllMasterDataForInspectionParameter = asyncHandler(async (req, res) => {
	let autoIncrementedInspectionParameterNo = "";
	const autoIncrementedNo = await AutoIncrement.getNextId("INSPECTIONPARAM")

	if(autoIncrementedNo < 10) {
      autoIncrementedInspectionParameterNo = "IP/000"+autoIncrementedNo;
   } else if(autoIncrementedNo < 100) {
      autoIncrementedInspectionParameterNo = "IP/00"+autoIncrementedNo;
   } else if(autoIncrementedNo < 1000) {
      autoIncrementedInspectionParameterNo = "IP/0"+autoIncrementedNo;
   } else {
      autoIncrementedInspectionParameterNo = "IP/"+autoIncrementedNo;
   }

	res.json({ autoIncrementedInspectionParameterNo })
})


export {
	createInspectionParameter,
	getInspectionParameterById,
	updateInspectionParameter,
	deleteInspectionParameter,
	getAllInspectionParameters,
	getAllMasterDataForInspectionParameter,
	findAllInspectionParameters
}