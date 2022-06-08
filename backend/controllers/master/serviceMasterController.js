import asyncHandler from 'express-async-handler';
import AutoIncrement from './../../models/autoincrement/autoIncrementModel.js';
import ServiceMaster from './../../models/master/serviceMasterModel.js';
import { getSACCodes } from './sacController.js';
import { findAllServiceCodes } from './serviceCodeController.js';
//import { getHSNs, getSACCodes } from './hsnController.js';

// @desc    Create new ServiceMaster Record
// @route   POST /api/servicemaster
// @access  Private

const createServiceMaster = asyncHandler(async (req, res) => {
	console.log("------------>>>> Inside create ServiceMaster function.....", )
	const {
		serviceCode,
      serviceDescription,
      unit,
      sac,
      servicePrice
	} = req.body;

	const createServiceMaster = new ServiceMaster({
		company: req.user.company,
		createdBy: req.user._id,
		updatedBy: req.user._id,
		serviceCode,
      serviceDescription,
      unit,
      sac,
      servicePrice
	});
	//return;
	try {
		const serviceMaster = await createServiceMaster.save();
		console.log("Created REcord is >>>>>> ", serviceMaster);
		if (serviceMaster) {
			const aiv = await AutoIncrement.setNextId("SERVICEMASTER")
         res.status(201).json(serviceMaster)
      } else {
         res.status(400)
         throw new Error('Invalid Inspection Method data')
      }
		//res.status(201).json(createServiceMaster);
    } catch (error) {
		console.log("Inside error while creating error ==== ", error)
		res.status(400)
		throw new Error('Invalid ServiceMaster data')
    }
});

// @desc    Get ServiceMaster Record by ID
// @route   GET /api/servicemaster/:id
// @access  Private

const getServiceMasterById = asyncHandler(async (req, res) => {
	console.log(">>>>> Inside get ServiceMaster By Id")

	const serviceMaster = await ServiceMaster.findById(req.params.id)
										.populate('sac', 'hsnCode goodsDescription sacCode serviceDescription gstRate igstRate sgstRate cgstRate ugstRate')
										.exec()
	
	if (serviceMaster) {
        console.log("ServiceMaster Record is .... ", serviceMaster)
        res.json(serviceMaster)
	} else {
		res.status(404)
		throw new Error('Record Not Found')
	}
})

// @desc    Update ServiceMaster Record
// @route   PUT /api/servicemaster/:id
// @access  Private
const updateServiceMaster = asyncHandler(async (req, res) => {
	console.log("Inside UPDATE ServiceMaster and ID is ", req.params.id)
	const serviceMaster = await ServiceMaster.findById(req.params.id)
	if (serviceMaster) {
		try {
			
			serviceMaster.updatedBy = req.user._id;
			serviceMaster.serviceCode = serviceMaster.serviceCode
			serviceMaster.isActive = req.body.isActive
			serviceMaster.serviceDescription = req.body.serviceDescription || serviceMaster.serviceDescription
			serviceMaster.unit = req.body.unit || serviceMaster.unit
			serviceMaster.unit = req.body.sac || serviceMaster.sac
			serviceMaster.servicePrice = req.body.servicePrice
			
			const updatedServiceMaster = await serviceMaster.save()
			res.status(201).json(updatedServiceMaster)
		} catch (error) {
			console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating ServiceMaster Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid ServiceMaster data')
	}
});

// @desc    Delete a ServiceMaster Record
// @route   DELETE /api/servicemaster/:id
// @access  Private
const deleteServiceMaster = asyncHandler(async (req, res) => {
  console.log("Inside DELETE ServiceMaster and ID is ", req.params.id)
  const serviceMaster = await ServiceMaster.findById(req.params.id)

  if (serviceMaster) {
    await serviceMaster.remove()
    res.json({ message: 'ServiceMaster removed' })
  } else {
    res.status(404)
    throw new Error('ServiceMaster not found')
  }
})

// @desc    Get all ServiceMaster Records
// @route   GET /api/servicemaster/all
// @access  Private
const getAllServiceMasters = asyncHandler(async (req, res) => {
	console.log(">>>>> Inside getAllServiceMasters WITH PAGINATION--- === ")
	const pageSize = Number(req.query.pageSize) || 1000
	const page = Number(req.query.pageNumber) || 1

	const count = await ServiceMaster.countDocuments()
	console.log("Total records count are ==== ", count)
	
	const serviceMasters = await ServiceMaster.find({})
	.sort({ serviceMasterCode:-1 })
   .populate('sac', 'hsnCode goodsDescription sacCode serviceDescription gstRate igstRate sgstRate cgstRate ugstRate')
	.limit(pageSize)
	.skip(pageSize * (page - 1))

	console.log("Total records count are ==== ", serviceMasters)
	res.json({ serviceMasters, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get all ServiceMaster Records
// @route   none
// @access  Private
const findAllServiceMasters = asyncHandler(async () => {
	//console.log(">>>>> Inside getAllServiceMasters WITH PAGINATION--- === ", req.user._id)
	const serviceMasters = await ServiceMaster.find({isActive:"Yes"})
	return serviceMasters;
})

// @desc    Get all Required Master Data for ServiceMaster Screen
// @route   GET /api/servicemaster/masterdata
// @access  Private
const getAllMasterDataForServiceMaster = asyncHandler(async (req, res) => {
	//console.log("---------- Inside getAllMasterDataForServiceMaster --------------- ")
	let autoIncrementeServiceMasterNo = "";
	const autoIncrementeServiceNo = await AutoIncrement.getNextId("SERVICEMASTER")

	if(autoIncrementeServiceNo < 10) {
      autoIncrementeServiceMasterNo = "SM/000"+autoIncrementeServiceNo;
   } else if(autoIncrementeServiceNo < 100) {
      autoIncrementeServiceMasterNo = "SM/00"+autoIncrementeServiceNo;
   } else if(autoIncrementeServiceNo < 1000) {
      autoIncrementeServiceMasterNo = "SM/0"+autoIncrementeServiceNo;
   } else {
      autoIncrementeServiceMasterNo = "SM/"+autoIncrementeServiceNo;
   }

	const hsnsacs = await findAllServiceCodes();//getHSNs();

	//console.log("---------- Service Codes List --------------- ", hsnsacs)

	res.json({ hsnsacs, autoIncrementeServiceMasterNo })
})


export {
	createServiceMaster,
	getServiceMasterById,
	updateServiceMaster,
	deleteServiceMaster,
	getAllServiceMasters,
	getAllMasterDataForServiceMaster,
	findAllServiceMasters
}