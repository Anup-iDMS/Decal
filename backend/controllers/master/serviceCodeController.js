import asyncHandler from 'express-async-handler';
import AutoIncrement from './../../models/autoincrement/autoIncrementModel.js';
import { getSACs } from './sacController.js';
//import ServiceCode from './../../models/master/ServiceCodeModel.js';
import ServiceCode from './../../models/master/serviceCodeModel.js'

// @desc    2.1 Register a new Service Code
// @route   POST /api/servicecode
// @access  Public
const createServiceCode = asyncHandler(async (req, res) => {
   const { code, name, sac, sacId } = req.body
   const serviceCodeExists = await ServiceCode.findOne({ name })
 
   if (serviceCodeExists) {
     res.status(400)
     throw new Error('ServiceCode already exists')
   }
 
   const servicecode = await ServiceCode.create({
     company: req.user.company,
     user: req.user._id,
     code,
     name,
     sac,
     sacId
   })
   if (servicecode) {
      const aiv = await AutoIncrement.setNextId("SERVICECODE")
      res.status(201).json(servicecode)
   } else {
     res.status(400)
     throw new Error('Invalid ServiceCode data')
   }
})

// @desc    Get 2.2 Service Code Record by ID
// @route   GET /api/servicecode/:id
// @access  Private

const getServiceCodeById = asyncHandler(async (req, res) => {
   const servicecode = await ServiceCode.findById(req.params.id)
										
   console.log("inside get product code by id ", servicecode)                              
   if (servicecode) {
       res.json(servicecode)
   } else {
       res.status(404)
       throw new Error('Record Not Found')
   }
 })
 
// @desc    2.3 Update Service Code Record
// @route   PUT /api/servicecode/:id
// @access  Private
const updateServiceCode = asyncHandler(async (req, res) => {
const serviceCode = await ServiceCode.findById(req.params.id)
if (serviceCode) {
   try {
      serviceCode.code = serviceCode.code;
      serviceCode.sacId = serviceCode.sacId;
      serviceCode.name = req.body.name || serviceCode.name;
      serviceCode.sac = req.body.sac || serviceCode.hsn;
      serviceCode.isActive = req.body.isActive;
      const updatedServiceCode = await serviceCode.save()
      res.status(201).json(updatedServiceCode)
   } catch (error) {
         console.log("Inside error while updating ServiceCode ==== ", error)
         res.status(400)
         throw new Error('Error in Updating ServiceCode Record')
   }
} else {
      res.status(400)
      throw new Error('Invalid ServiceCode data')
   }
});
 
 // @desc    2.4 Delete a Service Code Record
 // @route   DELETE /api/servicecode/:id
 // @access  Private
 const deleteServiceCode = asyncHandler(async (req, res) => {
   console.log("Inside DELETE ServiceCode and ID is ", req.params.id)
   const serviceCode = await ServiceCode.findById(req.params.id)
 
   if (serviceCode) {
     await serviceCode.remove()
     res.json({ message: 'ServiceCode removed' })
   } else {
     res.status(404)
     throw new Error('ServiceCode not found')
   }
 })
 
// @desc    2.5 Get all Service Code records
// @route   GET /api/servicecode/all
// @access  Private
const getAllServiceCodes = asyncHandler(async (req, res) => {
   const serviceCodes = await ServiceCode.find();
   return res.json(serviceCodes);
})
 
 // @desc    2.6 Get all Service Codes
 // @route   none: internal method used by JC Master Controller
 // @access  Private
 const findServiceCodes = asyncHandler(async (req, res) => {
    const serviceCodes = await ServiceCode.find({"isActive":true})
    return serviceCodes;
 })
 
 // @desc    2.7 Get all Master data required to create a Service Code record
 // @route   GET /api/servicecode/masterdata
 // @access  Private
 const getAllMasterDataForServiceCode = asyncHandler(async (req, res) => {
   let autoIncrementeServiceCodeNo = "";
	const autoIncrementeServiceNo = await AutoIncrement.getNextId("SERVICECODE")

	if(autoIncrementeServiceNo < 10) {
      autoIncrementeServiceCodeNo = "SC/000"+autoIncrementeServiceNo;
   } else if(autoIncrementeServiceNo < 100) {
      autoIncrementeServiceCodeNo = "SC/00"+autoIncrementeServiceNo;
   } else if(autoIncrementeServiceNo < 1000) {
      autoIncrementeServiceCodeNo = "SC/0"+autoIncrementeServiceNo;
   } else {
      autoIncrementeServiceCodeNo = "SC/"+autoIncrementeServiceNo;
   }

	const sacs = await getSACs();

	res.json({ sacs, autoIncrementeServiceCodeNo })
})

 
// @desc    2.5 Get all Service Code records
// @route   NONE
// @access  Private
const findAllServiceCodes = asyncHandler(async (req, res) => {
   const serviceCodes = await ServiceCode.find({isActive:"Yes"})
                        .populate('sacId', 'sacCode serviceDescription gstRate igstRate sgstRate cgstRate ugstRate');
   return serviceCodes;
})

export {
   createServiceCode,
   getServiceCodeById,
   updateServiceCode,
   deleteServiceCode,
   findServiceCodes,
   getAllServiceCodes,
   getAllMasterDataForServiceCode,
   findAllServiceCodes
}