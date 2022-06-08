import asyncHandler from 'express-async-handler';
import HSNSAC from './../../models/master/hsnModel.js';
//import AutoIncrement from '../../models/autoincrement/autoIncrementModel.js';

// @desc    Create new HSNSAC Record
// @route   POST /api/hsnsac
// @access  Private

const createHSN = asyncHandler(async (req, res) => {
	console.log("Inside create HSNSAC function.....", )
	const {
		provisionType,
      hsnCode,
      goodsDescription,
      sacCode,
      serviceDescription,
      gstRate,
      igstRate,
      sgstRate,
      cgstRate,
      ugstRate,
	} = req.body;
	
	const hsnsac = new HSNSAC({
		company: req.user.company,
		createdBy: req.user._id,
		updatedBy: req.user._id,
      provisionType,
      hsnCode,
      goodsDescription,
      sacCode,
      serviceDescription,
      gstRate,
      igstRate,
      sgstRate,
      cgstRate,
      ugstRate
	});
	console.log(":::::::: BEFORE creating HSNSAC REcord is >>>>>> ", hsnsac);
	try {
		const createHSN = await hsnsac.save();
		console.log("Created REcord is >>>>>> ", createHSN);
		if (createHSN) {
         res.status(201).json(createHSN)
      } else {
         res.status(400)
         throw new Error('Invalid HSN/SAC data')
      }
		//res.status(201).json(createHSN);
    } catch (error) {
		console.log("Inside error while creating error ==== ", error)
		res.status(400)
		throw new Error('Invalid HSNSAC data')
    }
});

// @desc    Get HSNSAC Record by ID
// @route   GET /api/hsnsac/:id
// @access  Private

const getHSNById = asyncHandler(async (req, res) => {
   console.log(">>>>> Inside get HSNSAC By Id")
   const hsnsac = await HSNSAC.findById(req.params.id)
                                 
   if (hsnsac) {
       console.log("HSNSAC Record is .... ", hsnsac)
       res.json(hsnsac)
   } else {
       res.status(404)
       throw new Error('Record Not Found')
   }
})

// @desc    Update HSNSAC Record
// @route   PUT /api/hsnsac/:id
// @access  Private
const updateHSN = asyncHandler(async (req, res) => {
	console.log("Inside UPDATE HSNSAC and ID is ", req.params.id)
	const hsnsac = await HSNSAC.findById(req.params.id)
	if (hsnsac) {
		try {
			
			hsnsac.updatedBy = req.user._id;
         hsnsac.hsnCode = req.body.hsnCode || hsnsac.hsnCode;
         hsnsac.provisionType = req.body.provisionType || hsnsac.provisionType;
         hsnsac.isActive = req.body.isActive;
         hsnsac.goodsDescription = req.body.goodsDescription || hsnsac.goodsDescription;
         hsnsac.sacCode = req.body.sacCode || hsnsac.sacCode;
         hsnsac.serviceDescription = req.body.serviceDescription || hsnsac.serviceDescription;
         hsnsac.gstRate = req.body.gstRate || hsnsac.gstRate;
         hsnsac.igstRate = req.body.igstRate || hsnsac.igstRate;
         hsnsac.sgstRate = req.body.sgstRate || hsnsac.sgstRate;
         hsnsac.cgstRate = req.body.cgstRate || hsnsac.cgstRate;
         hsnsac.ugstRate = req.body.ugstRate || hsnsac.ugstRate;
        
			
			const updatedHSNSAC = await hsnsac.save()
			console.log("Updated JOBCARD RECORD IS ", updatedHSNSAC)
			res.status(201).json(updatedHSNSAC)
		} catch (error) {
			console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating HSNSAC Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid HSNSAC data')
	}
});

// @desc    Delete a HSNSAC Record
// @route   DELETE /api/hsnsac/:id
// @access  Private
const deleteHSN = asyncHandler(async (req, res) => {
   console.log("Inside DELETE HSNSAC and ID is ", req.params.id)
   const hsnsac = await HSNSAC.findById(req.params.id)
 
   if (hsnsac) {
     await hsnsac.remove()
     res.json({ message: 'HSNSAC removed' })
   } else {
     res.status(404)
     throw new Error('HSNSAC not found')
   }
})

// @desc    Get all HSNSAC Records
// @route   GET /api/hsnsac/all
// @access  Private
const getAllHSNs = asyncHandler(async (req, res) => {
   
   const pageSize = Number(req.query.pageSize) || 10
   
   const page = Number(req.query.pageNumber) || 1

   let findQuery = {"isActive":"Y"};


   const count = await HSNSAC.countDocuments()

   const hsnsacCodes = await HSNSAC
                     .find(findQuery)
                     .sort({ _id:-1 })
                     .populate('jcNo', 'jcno jcDescription')
                     .populate('jcProdCode', 'name')
   
   console.log(hsnsacCodes)
   
   res.json({ hsnsacCodes, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get HSNSAC Record by ID
// @route   internal
// @access  Private

const getHSNByCode = asyncHandler(async (hsncode) => {
  // console.log(">>>>> Inside get HSNSAC By Id")
   const hsnsac = await HSNSAC.findOne({ hsnCode: hsncode})
                                 
   if (hsnsac) {
       //console.log("HSNSAC Record is .... ", typeof(hsnsac));
       //console.log("HSNSAC Record is .... ", hsnsac);
       return (hsnsac);
   } else {
       res.status(404)
       throw new Error('Record Not Found')
   }
})

// @desc    Get all HSNSAC Records
// @route   none: Used in Product Code Screen
// @access  Private
const getHSNs = asyncHandler(async (req, res) => {
   
   let findQuery = {"isActive":"Y"};

   const hsnsacCodes = await HSNSAC
                     .find(findQuery)
                     .sort({ _id:-1 })
   
   return hsnsacCodes;
})

// @desc    Get all HSNSAC Records
// @route   none: Used in Product Code Screen
// @access  Private
const getSACCodes = asyncHandler(async (req, res) => {
   
   let findQuery = {"isActive":"Y", sacCode:{ $nin: ["NA","-"] }};

   const sacCodes = await HSNSAC
                     .find(findQuery)
                     .sort({ _id:-1 })
   
   return sacCodes;
})

export {
   createHSN,
   getHSNById,
   updateHSN,
   deleteHSN,
   getAllHSNs,
   getHSNByCode,
   getHSNs,
   getSACCodes
}