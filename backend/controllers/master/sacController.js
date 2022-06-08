import asyncHandler from 'express-async-handler';
import SAC from './../../models/master/sacModel.js';
//import AutoIncrement from '../../models/autoincrement/autoIncrementModel.js';

// @desc    Create new SAC Record
// @route   POST /api/sac
// @access  Private

const createSAC = asyncHandler(async (req, res) => {
	console.log("Inside create SAC function.....", )
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
	
	const sac = new SAC({
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
	console.log(":::::::: BEFORE creating SAC REcord is >>>>>> ", sac);
	try {
		const createSAC = await sac.save();
		console.log("Created REcord is >>>>>> ", createSAC);
		if (createSAC) {
         res.status(201).json(createSAC)
      } else {
         res.status(400)
         throw new Error('Invalid SAC data')
      }
		//res.status(201).json(createSAC);
    } catch (error) {
		console.log("Inside error while creating error ==== ", error)
		res.status(400)
		throw new Error('Invalid SAC data')
    }
});

// @desc    Get SAC Record by ID
// @route   GET /api/sac/:id
// @access  Private

const getSACById = asyncHandler(async (req, res) => {
   console.log(">>>>> Inside get SAC By Id")
   const sac = await SAC.findById(req.params.id)
                                 
   if (sac) {
       console.log("SAC Record is .... ", sac)
       res.json(sac)
   } else {
       res.status(404)
       throw new Error('Record Not Found')
   }
})

// @desc    Update SAC Record
// @route   PUT /api/sac/:id
// @access  Private
const updateSAC = asyncHandler(async (req, res) => {
	console.log("Inside UPDATE SAC and ID is ", req.params.id)
	const sac = await SAC.findById(req.params.id)
	if (sac) {
		try {
			
			sac.updatedBy = req.user._id;
         sac.hsnCode = req.body.hsnCode || sac.hsnCode;
         sac.provisionType = req.body.provisionType || sac.provisionType;
         sac.isActive = req.body.isActive;
         sac.goodsDescription = req.body.goodsDescription || sac.goodsDescription;
         sac.sacCode = req.body.sacCode || sac.sacCode;
         sac.serviceDescription = req.body.serviceDescription || sac.serviceDescription;
         sac.gstRate = req.body.gstRate || sac.gstRate;
         sac.igstRate = req.body.igstRate || sac.igstRate;
         sac.sgstRate = req.body.sgstRate || sac.sgstRate;
         sac.cgstRate = req.body.cgstRate || sac.cgstRate;
         sac.ugstRate = req.body.ugstRate || sac.ugstRate;
        
			
			const updatedSAC = await sac.save()
			console.log("????????????????? Updated JOBCARD RECORD IS ", updatedSAC)
			res.status(201).json(updatedSAC)
		} catch (error) {
			console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating SAC Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid SAC data')
	}
});

// @desc    Delete a SAC Record
// @route   DELETE /api/sac/:id
// @access  Private
const deleteSAC = asyncHandler(async (req, res) => {
   console.log("Inside DELETE SAC and ID is ", req.params.id)
   const sac = await SAC.findById(req.params.id)
 
   if (sac) {
     await sac.remove()
     res.json({ message: 'SAC removed' })
   } else {
     res.status(404)
     throw new Error('SAC not found')
   }
})

// @desc    Get all SAC Records
// @route   GET /api/sac/all
// @access  Private
const getAllSACs = asyncHandler(async (req, res) => {
   
   const pageSize = Number(req.query.pageSize) || 10000
   
   const page = Number(req.query.pageNumber) || 1

   let findQuery = {"isActive":"Y"};


   const count = await SAC.countDocuments()

   const sacCodes = await SAC
                     .find(findQuery)
                     .sort({ _id:-1 })
                     .populate('jcNo', 'jcno jcDescription')
                     .populate('jcProdCode', 'name')
   
   console.log(sacCodes)
   
   res.json({ sacCodes, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get SAC Record by ID
// @route   internal
// @access  Private

const getSACByCode = asyncHandler(async (saccode) => {
  // console.log(">>>>> Inside get SAC By Id")
   const sac = await SAC.findOne({ hsnCode: saccode})
                                 
   if (sac) {
       //console.log("SAC Record is .... ", typeof(sac));
       //console.log("SAC Record is .... ", sac);
       return (sac);
   } else {
       res.status(404)
       throw new Error('Record Not Found')
   }
})

// @desc    Get all SAC Records
// @route   none: Used in Product Code Screen
// @access  Private
const getSACs = asyncHandler(async (req, res) => {
   
   let findQuery = {"isActive":"Y"};

   const sacCodes = await SAC
                     .find(findQuery)
                     .sort({ _id:-1 })
   
   return sacCodes;
})

// @desc    Get all SAC Records
// @route   none: Used in Product Code Screen
// @access  Private
const getSACCodes = asyncHandler(async (req, res) => {
   
   let findQuery = {"isActive":"Y", sacCode:{ $nin: ["NA","-"] }};

   const sacCodes = await SAC
                     .find(findQuery)
                     .sort({ _id:-1 })
   
   return sacCodes;
})

export {
   createSAC,
   getSACById,
   updateSAC,
   deleteSAC,
   getAllSACs,
   getSACByCode,
   getSACs,
   getSACCodes
}