import asyncHandler from 'express-async-handler';

import { FGMCorrectionHistory, FGMI } from './../../models/production/FGMIModel.js';

import AutoIncrement from '../../models/autoincrement/autoIncrementModel.js';

import { getAllJCMasters } from '../master/jcMasterController.js';

import { FGMI_MODULE_PREFIX } from '../../config/moduleConstants.js';



// @desc    Create new FGMI Record
// @route   POST /api/fgmi
// @access  Private

const createFGMI = asyncHandler(async (req, res) => {
	console.log("Inside create FGMI function.....", )
	const {
		fgmiNo,
      jcNo,
      source,
      batchDate,
      batchStatus,
      entryDate,
      batchQuantity,
      totalBatchQuantity,
	} = req.body;
	
	const fgmi = new FGMI({
		company: req.user.company,
		createdBy: req.user._id,
		updatedBy: req.user._id,
      fgmiNo,
      jcNo,
      source,
      batchDate,
      batchStatus,
      entryDate,
      batchQuantity,
      totalBatchQuantity,
	});
	console.log(":::::::: BEFORE creating FGMI REcord is >>>>>> ", fgmi);
	try {
		const createFGMI = await fgmi.save();
		console.log("Created REcord is >>>>>> ", createFGMI);
		if (createFGMI) {
         const aiv = await AutoIncrement.setNextId(FGMI_MODULE_PREFIX)
         res.status(201).json(createFGMI)
      } else {
         res.status(400)
         throw new Error('Invalid FGMI data')
      }
		//res.status(201).json(createFGMI);
    } catch (error) {
		console.log("Inside error while creating FGMI error ==== ", error)
		res.status(400)
		throw new Error('Invalid FGMI data')
    }
});

// @desc    Create new FGMI Record from Job Card Output
// @route   none
// @access  Private
const updateFGMIFromJobCardOutput = asyncHandler(async (fgmiDetails) => {
   let autoIncrementedFGMINo = "";
	const autoIncrementedNo = await AutoIncrement.getNextId(FGMI_MODULE_PREFIX)
   //console.log("Number got is ", autoIncrementedNo)
	if(autoIncrementedNo < 10) {
      autoIncrementedFGMINo = FGMI_MODULE_PREFIX+"/000"+autoIncrementedNo;
   } else if(autoIncrementedNo < 100) {
      autoIncrementedFGMINo = FGMI_MODULE_PREFIX+"/00"+autoIncrementedNo;
   } else if(autoIncrementedNo < 1000) {
      autoIncrementedFGMINo = FGMI_MODULE_PREFIX+"/0"+autoIncrementedNo;
   } else {
      autoIncrementedFGMINo = FGMI_MODULE_PREFIX+"/"+autoIncrementedNo;
   }
   console.log("4.1 Number got is ", autoIncrementedFGMINo);

   const {
      company,
		createdBy,
		updatedBy,
      jcNo,
      source,
      batchDate,
      batchStatus,
      entryDate,
      batchQuantity   
   } = fgmiDetails;

   const fgmi = new FGMI({
		company,
		createdBy,
		updatedBy,
      fgmiNo: autoIncrementedFGMINo,
      jcNo,
      source,
      batchDate,
      batchStatus,
      entryDate,
      batchQuantity
	});
   try {
      console.log("4.2 Check whether FGMI exists in database for JOB CARD........... ", source)
      const fgmiExists = await FGMI.find({"source":source})
      console.log("4.2.2 Job Card Details found are ============ ", fgmiExists.length)
      if(fgmiExists.length > 0 && fgmiExists[0].source === source) {
         console.log("4.3 Job Card Details exists in FGMI table ============ ", fgmiExists[0].source)
         fgmi._id = fgmiExists[0]._id
         fgmi.fgmiNo = fgmiExists[0].fgmiNo;
         fgmi.jcNo =  fgmiExists[0].jcNo;
         fgmi.source = fgmiExists[0].source;
         fgmi.batchDate =  fgmiExists[0].batchDate;

         fgmi.batchStatus =  fgmiExists[0].batchStatus;
         fgmi.batchQuantity =  batchQuantity;
         fgmi.entryDate =  new Date();

         const updatedFGMI = await FGMI.updateOne({"_id":fgmiExists[0]._id}, fgmi)
         if (updatedFGMI) {
            const aiv = await AutoIncrement.setNextId(FGMI_MODULE_PREFIX)
            return updatedFGMI;
         } else {
            throw new Error('Invalid FGMI data !')
         }

      } else {
         const createFGMI = await fgmi.save();
         console.log("4.5 Created FGMI REcord upon JOB CARD Output >>>>>> ", createFGMI);
         if (createFGMI) {
            const aiv = await AutoIncrement.setNextId(FGMI_MODULE_PREFIX)
            return createFGMI;
         } else {
            throw new Error('Invalid FGMI data !')
         }
      }

   } catch (error) {
		console.log("Inside error while creating FGMI error ==== ", error)
		throw new Error('Error in creating FGMI Record !')
   }
})

// @desc    Get FGMI Record by ID
// @route   GET /api/fgmi/:id
// @access  Private

const getFGMIById = asyncHandler(async (req, res) => {
   console.log(">>>>> Inside get FGMI By Id")
   const fgmi = await FGMI.findById(req.params.id)
                                 .populate('jcNo','jcno jcDescription jcProdCode')
                                 
   if (fgmi) {
       console.log("FGMI Record is .... ", fgmi)
       res.json(fgmi)
   } else {
       res.status(404)
       throw new Error('Record Not Found')
   }
})

// @desc    Update FGMI Record
// @route   PUT /api/fgmi/:id
// @access  Private
const updateFGMI = asyncHandler(async (req, res) => {
	console.log("Inside UPDATE FGMI and ID is ", req.params.id)
	const fgmi = await FGMI.findById(req.params.id)
	if (fgmi) {
		try {
			
			fgmi.updatedBy = req.user._id;
         fgmi.fgmiNo = req.body.fgmiNo || fgmi.fgmiNo;
         fgmi.jcNo = req.body.jcNo || fgmi.jcNo;
         fgmi.source = req.body.source || fgmi.source;
         fgmi.batchDate = req.body.batchDate || fgmi.batchDate;

         fgmi.batchStatus = req.body.batchStatus || fgmi.batchStatus;
         fgmi.batchQuantity = req.body.batchQuantity || fgmi.batchQuantity;
         fgmi.entryDate = req.body.entryDate || fgmi.entryDate;
         fgmi.totalBatchQuantity = req.body.totalBatchQuantity || fgmi.totalBatchQuantity;
			
			const updatedFGMI = await fgmi.save()
			console.log("Updated FGMI RECORD IS ", updatedFGMI)
			res.status(201).json(updatedFGMI)
		} catch (error) {
			console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating FGMI Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid FGMI data')
	}
});

// @desc    Delete a FGMI Record
// @route   DELETE /api/fgmi/:id
// @access  Private
const deleteFGMI = asyncHandler(async (req, res) => {
   console.log("Inside DELETE FGMI and ID is ", req.params.id)
   const fgmi = await FGMI.findById(req.params.id)
 
   if (fgmi) {
     await fgmi.remove()
     res.json({ message: 'FGMI removed' })
   } else {
     res.status(404)
     throw new Error('FGMI not found')
   }
})

// @desc    Get all FGMI Records
// @route   GET /api/fgmi/all
// @access  Private
const getAllFGMIs = asyncHandler(async (req, res) => {
   
   const pageSize = Number(req.query.pageSize) || 10
   
   const page = Number(req.query.pageNumber) || 1

   let findQuery = {"batchQuantity":{ $gt : 0}};

   const count = await FGMI.countDocuments()
   console.log("Total records count are ==== ", count)

   const fgmis = await FGMI
                     .find(findQuery)
                     .sort({ _id:-1 })
                     .populate('jcNo', 'jcno jcDescription')
   
   console.log(fgmis.length)
   
   res.json({ fgmis, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get all Required Master Data for FGMI Input Screen
// @route   GET /api/fgmi/masterdata
// @access  Private
const getAllMasterDataForFGMI = asyncHandler(async (req, res) => {
	let autoIncrementedFGMINo = "";
	const jcMasters = await getAllJCMasters();
	const autoIncrementedNo = await AutoIncrement.getNextId(FGMI_MODULE_PREFIX)
   //console.log("Number got is ", autoIncrementedNo)
	if(autoIncrementedNo < 10) {
      autoIncrementedFGMINo = FGMI_MODULE_PREFIX+"/000"+autoIncrementedNo;
   } else if(autoIncrementedNo < 100) {
      autoIncrementedFGMINo = FGMI_MODULE_PREFIX+"/00"+autoIncrementedNo;
   } else if(autoIncrementedNo < 1000) {
      autoIncrementedFGMINo = FGMI_MODULE_PREFIX+"/0"+autoIncrementedNo;
   } else {
      autoIncrementedFGMINo = FGMI_MODULE_PREFIX+"/"+autoIncrementedNo;
   }
   //console.log("autoIncrementedFGMINo ==== ", autoIncrementedFGMINo)
   //console.log("jcMasters ==== ", jcMasters)
	res.json({ jcMasters, autoIncrementedFGMINo })
})

// @desc    Get all Back Orders by JC
// @route   GET /api/fgmi/jc?jcId=jcId
// @access  Private
const getFGMIBatchedByJCId = asyncHandler(async (req, res) => {
   let jcId = req.query.jcId;
   console.log("Inside FGMI to get aall available batches======== ", jcId)
   
   let findQuery = {"jcNo" : jcId};

   const fgmis = await FGMI
                     .find(findQuery)
                     .sort({ _id:-1 })
                     .populate('jcNo', 'jcno jcDescription')
   console.log("Return FGMISSSSSSSSSSSSSSSS batches >>>>>>> ", fgmis)
   return res.json({fgmis});
});

// @desc    Update FGMI thru FGM Correction
// @route   POST /api/fgmi/fgcorrection
// @access  Private

const updateFGMIThruCorrection = asyncHandler(async (req, res) => {
   
   //1. Get FGMI details by Id
   let fgmiId = req.params.fgmiId;
   console.log("0. fgmiController --> updateFGMIThruCorrection --> fgmi ", fgmiId);
   const fgmi = await FGMI.findById(fgmiId)
   console.log("1. fgmiController --> updateFGMIThruCorrection --> Found FGMI Details ", fgmi)
   //2. Set the update fields
   if (fgmi) {
		try {
			
			fgmi.updatedBy = req.user._id;
         fgmi.fgmiNo = req.body.fgmiNo || fgmi.fgmiNo;
         fgmi.jcNo = req.body.jcNo || fgmi.jcNo;
         fgmi.source = req.body.source || fgmi.source;
         if(req.body.correctionCategory === "R") {
            fgmi.batchStatus = "R";
            fgmi.batchQuantity = req.body.batchQuantity || fgmi.batchQuantity;
            fgmi.batchDate = req.body.destinationBatch || fgmi.batchDate;
         } else if(req.body.correctionCategory === "T") {
            fgmi.batchStatus = "R";
            fgmi.batchQuantity = fgmi.batchQuantity + parseFloat(req.body.transferQty);
            fgmi.batchDate = req.body.destinationBatch || fgmi.batchDate;
         }  
         fgmi.entryDate = req.body.entryDate || fgmi.entryDate;
         fgmi.totalBatchQuantity = req.body.totalBatchQuantity || fgmi.totalBatchQuantity;
			
         //3. Update the record
         const updatedFGMI = await fgmi.save()
			console.log("2. fgmiController --> updateFGMIThruCorrection --> Updated FGMI RECORD IS ", updatedFGMI)
			//4. Update FGMI History FGMCorrectionHistory
         const fgmCorrectionHistory = new FGMCorrectionHistory({
            createdBy: req.user._id,
            company: req.user.company,
            updatedBy: req.user._id,
            fgmiId,
            correctionType: "R",
            sourceBatch: sourceBatch,
            destinationBatch: destinationBatch, 
            transferQty: transferQty
         });
         const createFGMIHistory = await fgmCorrectionHistory.save();
         res.status(201).json(updatedFGMI)
		} catch (error) {
			console.log("3. fgmiController --> updateFGMIThruCorrection --> Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('4. fgmiController --> updateFGMIThruCorrection --> Error in Updating FGMI Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid FGMI data')
	}

})

const updateFGMIThruDRNUpdate = asyncHandler(async (updatedBy, fgmiId, action, dispatchQty) => {
   console.log("0. fgmiController --> updateFGMIThruDRNUpdate --> fgmi ", fgmiId);
   const fgmi = await FGMI.findById(fgmiId)
   console.log("1. fgmiController --> updateFGMIThruDRNUpdate --> Found FGMI Details ", fgmi)
   //2. Set the update fields
   if (fgmi) {
		try {
			fgmi.updatedBy = updatedBy;
         fgmi.fgmiNo = fgmi.fgmiNo;
         fgmi.jcNo = fgmi.jcNo;
         fgmi.source = fgmi.source;
         fgmi.batchStatus = fgmi.batchStatus;
         if(action === "CREATE") {
            fgmi.batchQuantity = fgmi.batchQuantity - dispatchQty;
         } else if(action === "REJECT") {
            fgmi.batchQuantity = fgmi.batchQuantity + dispatchQty;
         }  
         fgmi.batchDate = fgmi.batchDate;
         fgmi.entryDate = fgmi.entryDate;
         fgmi.totalBatchQuantity = fgmi.totalBatchQuantity;

         const updatedFGMI = await fgmi.save();

         return updatedFGMI;
      }
      catch (error) {
         console.log("3. fgmiController --> updateFGMIThruDRNUpdate --> Inside error while creating error ==== ", error)
         res.status(400)
         throw new Error('4. fgmiController --> updateFGMIThruDRNUpdate --> Error in Updating FGMI Record')
      }
   } else {
		res.status(400)
		throw new Error('Invalid FGMI data')
	}
});

/** Dashboard Functions Start */
const getFGMIData = asyncHandler(async () => {
   const result = await FGMI.aggregate([
      {
         $group: {
            _id: "$jcNo",
            availableQty: { $sum: "$batchQuantity" }
         },
      },
      { 
         $lookup : {
            from : 'jcmasters', //"from collection"
            localField : '_id', //any field from "input collection"
            foreignField : '_id', //any field from "from collection"
            as : 'deva' //attached array field
         } 
      },
      { $unwind: "$deva" },
      {$project:{
         custName:'$deva.jcDescription',
         availableQty: 1, 
      }},
      { $sort : { 'availableQty' : -1 } },
      //{ $limit : 5 }
      
   ]);
  
   if(result.length > 0) {
      let jcArray = [];
      let jcAvailableQty = [];
      for (const sod of result) {
         jcArray.push(sod.custName)
         jcAvailableQty.push((Number(sod.availableQty)))
      }
      let jcAvailableQtyData = {"JC":jcArray, "Qty" : jcAvailableQty}
  //    console.log(">>>>> ",jcAvailableQtyData)
      // console.log("@@@@@@@@@@@@@@@@@@ Result is   getCustomerSalesOrderData   ==== ", jcArray)
      // console.log("@@@@@@@@@@@@@@@@@@ Result is   getCustomerSalesOrderData   ==== ", custSOAmount)
      return jcAvailableQtyData;
   } else {
      let jcAvailableQtyData = {"JC":[], "Qty" : []}
      return jcAvailableQtyData;
   }
})
/** Dashboard Functions End */

export {
   createFGMI,
   getFGMIById,
   updateFGMI,
   deleteFGMI,
   getAllFGMIs,
   getAllMasterDataForFGMI,
   getFGMIBatchedByJCId,
   updateFGMIFromJobCardOutput,
   updateFGMIThruCorrection,
   updateFGMIThruDRNUpdate,
   getFGMIData
}