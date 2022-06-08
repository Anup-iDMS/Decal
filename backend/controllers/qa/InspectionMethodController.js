import asyncHandler from 'express-async-handler';
import InspectionMethod from './../../models/qa/InspectionMethodModel.js';
import AutoIncrement from './../../models/autoincrement/autoIncrementModel.js';



// @desc    Create new InspectionMethod Record
// @route   POST /api/qa/inspectionmethods
// @access  Private

const createInspectionMethod = asyncHandler(async (req, res) => {
	//console.log("Inside create InspectionMethod function.....", )
	const {
		inspectionMethodCode,
      inspectionMethodName
	} = req.body;
	
	const inspectionMethod = new InspectionMethod({
		inspectionMethodCode,
		inspectionMethodName,
		company: req.user.company,
		createdBy: req.user._id,
		updatedBy: req.user._id,
	});
	console.log(":::::::: BEFORE creating InspectionMethod REcord is >>>>>> ", inspectionMethod);
	try {
		const createInspectionMethod = await inspectionMethod.save();
		console.log("Created REcord is >>>>>> ", createInspectionMethod);
		if (createInspectionMethod) {
			const aiv = await AutoIncrement.setNextId("INSPECTIONMETHOD")
         res.status(201).json(createInspectionMethod)
      } else {
         res.status(400)
         throw new Error('Invalid Inspection Method data')
      }
		//res.status(201).json(createInspectionMethod);
    } catch (error) {
		console.log("Inside error while creating error ==== ", error)
		res.status(400)
		throw new Error('Invalid InspectionMethod data')
    }
});

// @desc    Get InspectionMethod Record by ID
// @route   GET /api/qa/inspectionmethods/:id
// @access  Private

const getInspectionMethodById = asyncHandler(async (req, res) => {
    console.log(">>>>> Inside get InspectionMethod By Id")
    const inspectionMethod = await InspectionMethod.findById(req.params.id).populate('user','name email').populate('company').exec()
    if (inspectionMethod) {
        console.log("InspectionMethod Record is .... ", inspectionMethod)
        res.json(inspectionMethod)
    } else {
        res.status(404)
        throw new Error('Record Not Found')
    }
})

// @desc    Update InspectionMethod Record
// @route   PUT /api/qa/inspectionmethods/:id
// @access  Private
const updateInspectionMethod = asyncHandler(async (req, res) => {
	console.log("Inside UPDATE InspectionMethod and ID is ", req.params.id)
	const inspectionMethod = await InspectionMethod.findById(req.params.id)
	if (inspectionMethod) {
		try {
			
			inspectionMethod.updatedBy = req.user._id;
			inspectionMethod.inspectionMethodCode = inspectionMethod.inspectionMethodCode
			inspectionMethod.isActive = req.body.isActive || inspectionMethod.isActive
			inspectionMethod.inspectionMethodName = req.body.inspectionMethodName || inspectionMethod.inspectionMethodName
			
			const updatedInspectionMethod = await inspectionMethod.save()
			console.log("Updated MODULE RECORD IS ", updatedInspectionMethod)
			res.status(201).json(updatedInspectionMethod)
		} catch (error) {
			console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating InspectionMethod Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid InspectionMethod data')
	}
});

// @desc    Delete a InspectionMethod Record
// @route   DELETE /api/qa/inspectionmethods/:id
// @access  Private
const deleteInspectionMethod = asyncHandler(async (req, res) => {
  console.log("Inside DELETE InspectionMethod and ID is ", req.params.id)
  const inspectionMethod = await InspectionMethod.findById(req.params.id)

  if (inspectionMethod) {
    await inspectionMethod.remove()
    res.json({ message: 'InspectionMethod removed' })
  } else {
    res.status(404)
    throw new Error('InspectionMethod not found')
  }
})

// @desc    Get all InspectionMethod Records
// @route   GET /api/qa/inspectionmethods/all
// @access  Private
const getAllInspectionMethods = asyncHandler(async (req, res) => {
    console.log(">>>>> Inside getAllInspectionMethods WITH PAGINATION--- === ")
    const pageSize = Number(req.query.pageSize) || 1000
    const page = Number(req.query.pageNumber) || 1

    const count = await InspectionMethod.countDocuments()
    console.log("Total records count are ==== ", count)

    const inspectionmethods = await InspectionMethod.find().limit(pageSize)
    .skip(pageSize * (page - 1))
    res.json({ inspectionmethods, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get all InspectionMethod Records
// @route   none
// @access  Private
const findAllInspectionMethods = asyncHandler(async () => {
	//console.log(">>>>> Inside getAllInspectionMethods WITH PAGINATION--- === ", req.user._id)
	const inspectionmethods = await InspectionMethod.find({isActive:"Yes"})
	return inspectionmethods;
})

// @desc    Get all Required Master Data for InspectionMethod Screen
// @route   GET /api/qa/inspectionmethods/masterdata
// @access  Private
const getAllMasterDataForInspectionMethod = asyncHandler(async (req, res) => {
	let autoIncrementedInspectionMethodNo = "";
	const autoIncrementedNo = await AutoIncrement.getNextId("INSPECTIONMETHOD")

	if(autoIncrementedNo < 10) {
      autoIncrementedInspectionMethodNo = "IM/000"+autoIncrementedNo;
   } else if(autoIncrementedNo < 100) {
      autoIncrementedInspectionMethodNo = "IM/00"+autoIncrementedNo;
   } else if(autoIncrementedNo < 1000) {
      autoIncrementedInspectionMethodNo = "IM/0"+autoIncrementedNo;
   } else {
      autoIncrementedInspectionMethodNo = "IM/"+autoIncrementedNo;
   }

	res.json({ autoIncrementedInspectionMethodNo })
})


export {
	createInspectionMethod,
	getInspectionMethodById,
	updateInspectionMethod,
	deleteInspectionMethod,
	getAllInspectionMethods,
	getAllMasterDataForInspectionMethod,
	findAllInspectionMethods
}