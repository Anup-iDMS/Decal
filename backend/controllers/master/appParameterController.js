import asyncHandler from 'express-async-handler';
import AppParameter from './../../models/master/appParameterModel.js';
import AutoIncrement from './../../models/autoincrement/autoIncrementModel.js';



// @desc    Create new AppParameter Record
// @route   POST /api/apiappparameters
// @access  Private

const createAppParameter = asyncHandler(async (req, res) => {
	//console.log("Inside create AppParameter function.....", )
	const {
		appParameterCode,
      appParameterAppCode,
		appParameterName,
		appParameterValue
	} = req.body;
	
	const appParameter = new AppParameter({
		appParameterCode,
      appParameterAppCode,
		appParameterName,
		appParameterValue,
		company: req.user.company,
		createdBy: req.user._id,
		updatedBy: req.user._id,
	});
	console.log(":::::::: BEFORE creating AppParameter REcord is >>>>>> ", appParameter);
	try {
		const createAppParam = await appParameter.save();
		console.log("Created REcord is >>>>>> ", createAppParam);
		if (createAppParam) {
			const aiv = await AutoIncrement.setNextId("APPPARAMETER")
         res.status(201).json(createAppParam)
      } else {
         res.status(400)
         throw new Error('Invalid Inspection Method data')
      }
		//res.status(201).json(createAppParameter);
    } catch (error) {
		console.log("Inside error while creating error ==== ", error)
		res.status(400)
		throw new Error('Invalid AppParameter data')
    }
});

// @desc    Get AppParameter Record by ID
// @route   GET /api/apiappparameters/:id
// @access  Private

const getAppParameterById = asyncHandler(async (req, res) => {
    console.log(">>>>> Inside get AppParameter By Id")
    const appParameter = await AppParameter.findById(req.params.id).populate('user','name email').populate('company').exec()
    if (appParameter) {
        console.log("AppParameter Record is .... ", appParameter)
        res.json(appParameter)
    } else {
        res.status(404)
        throw new Error('Record Not Found')
    }
})

// @desc    Get AppParameter Record by ID
// @route   NA
// @access  Private

const findAppParameterValue = asyncHandler(async (appParameterAppCode) => {
	//console.log(">>>>> Inside findAppParameterValue")
	const appParameter = await AppParameter.findOne({ appParameterAppCode: appParameterAppCode})
   //console.log(">>>>> Inside findAppParameterValue >>>>>>>>>>> ", appParameter)
	                              
   if (appParameter) {
       return (appParameter.appParameterValue);
   } else {
       res.status(404)
       throw new Error('Record Not Found')
   }

})

// @desc    Update AppParameter Record
// @route   PUT /api/apiappparameters/:id
// @access  Private
const updateAppParameter = asyncHandler(async (req, res) => {
	console.log("Inside UPDATE AppParameter and ID is ", req.params.id)
	const appParameter = await AppParameter.findById(req.params.id)
	if (appParameter) {
		try {
			
			appParameter.updatedBy = req.user._id;
			appParameter.appParameterCode = appParameter.appParameterCode
			appParameter.appParameterAppCode = appParameter.appParameterAppCode
			appParameter.appParameterName = req.body.appParameterName || appParameter.appParameterName
			appParameter.appParameterValue = req.body.appParameterValue || appParameter.appParameterValue
			appParameter.isActive = req.body.isActive
			
			const updatedAppParameter = await appParameter.save()
			console.log("Updated MODULE RECORD IS ", updatedAppParameter)
			res.status(201).json(updatedAppParameter)
		} catch (error) {
			console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating AppParameter Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid AppParameter data')
	}
});

// @desc    Delete a AppParameter Record
// @route   DELETE /api/apiappparameters/:id
// @access  Private
const deleteAppParameter = asyncHandler(async (req, res) => {
  console.log("Inside DELETE AppParameter and ID is ", req.params.id)
  const appParameter = await AppParameter.findById(req.params.id)

  if (appParameter) {
    await appParameter.remove()
    res.json({ message: 'AppParameter removed' })
  } else {
    res.status(404)
    throw new Error('AppParameter not found')
  }
})

// @desc    Get all AppParameter Records
// @route   GET /api/apiappparameters/all
// @access  Private
const getAllAppParameters = asyncHandler(async (req, res) => {
    console.log(">>>>> Inside getAllAppParameters WITH PAGINATION--- === ")
    const pageSize = Number(req.query.pageSize) || 1000
    const page = Number(req.query.pageNumber) || 1

    const count = await AppParameter.countDocuments()
    console.log("Total records count are ==== ", count)

    const appParameters = await AppParameter.find().limit(pageSize)
    .skip(pageSize * (page - 1))
    res.json({ appParameters, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get all AppParameter Records
// @route   none
// @access  Private
const findAllAppParameters = asyncHandler(async () => {
	//console.log(">>>>> Inside getAllAppParameters WITH PAGINATION--- === ", req.user._id)
	const appParameters = await AppParameter.find({isActive:"Yes"})
	return appParameters;
})

// @desc    Get all Required Master Data for AppParameter Screen
// @route   GET /api/apiappparameters/masterdata
// @access  Private
const getAllMasterDataForAppParameter = asyncHandler(async (req, res) => {
	let autoIncrementedAppParameterNo = "";
	const autoIncrementedNo = await AutoIncrement.getNextId("APPPARAMETER")

	if(autoIncrementedNo < 10) {
      autoIncrementedAppParameterNo = "AP/000"+autoIncrementedNo;
   } else if(autoIncrementedNo < 100) {
      autoIncrementedAppParameterNo = "AP/00"+autoIncrementedNo;
   } else if(autoIncrementedNo < 1000) {
      autoIncrementedAppParameterNo = "AP/0"+autoIncrementedNo;
   } else {
      autoIncrementedAppParameterNo = "AP/"+autoIncrementedNo;
   }

	res.json({ autoIncrementedAppParameterNo })
})


export {
	createAppParameter,
	getAppParameterById,
	updateAppParameter,
	deleteAppParameter,
	getAllAppParameters,
	getAllMasterDataForAppParameter,
	findAllAppParameters,
	findAppParameterValue
}