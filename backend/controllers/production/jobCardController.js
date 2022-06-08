import asyncHandler from 'express-async-handler';
import JobCard from '../../models/production/JobCardModel.js';
import AutoIncrement from '../../models/autoincrement/autoIncrementModel.js';
import { getAllJCMasters } from '../master/jcMasterController.js';
import { JOBCARD_MODULE_PREFIX } from '../../config/moduleConstants.js';
import { updateFGMIFromJobCardOutput } from './fgmiController.js';
import { getFirstDayOfMonth, getLastDayOfMonth } from '../../utils/utility.js';

// @desc    Create new JobCard Record
// @route   POST /api/jobcards
// @access  Private

const createJobCard = asyncHandler(async (req, res) => {
	console.log("Inside create JobCard function.....", )
	const {
		jobCardNo,
      jcNo,
      jcProdCode,
      batchDate,
      inputQuantity,
	} = req.body;
	
	const jobCard = new JobCard({
		company: req.user.company,
		createdBy: req.user._id,
		updatedBy: req.user._id,
      jobCardNo,
      jcNo,
      jcProdCode,
      batchDate,
      inputQuantity,
	});
	console.log(":::::::: BEFORE creating JobCard REcord is >>>>>> ", jobCard);
	try {
		const createJobCard = await jobCard.save();
		console.log("Created REcord is >>>>>> ", createJobCard);
		if (createJobCard) {
         const aiv = await AutoIncrement.setNextId(JOBCARD_MODULE_PREFIX)
         res.status(201).json(createJobCard)
      } else {
         res.status(400)
         throw new Error('Invalid Job Card data')
      }
		//res.status(201).json(createJobCard);
    } catch (error) {
		console.log("Inside error while creating error ==== ", error)
		res.status(400)
		throw new Error('Invalid JobCard data')
    }
});

// @desc    Get JobCard Record by ID
// @route   GET /api/jobcards/:id
// @access  Private

const getJobCardById = asyncHandler(async (req, res) => {
   console.log(">>>>> Inside get JobCard By Id")
   const jobCard = await JobCard.findById(req.params.id)
                                 .populate('jcNo','jcno jcDescription jcProdCode')
                                 .populate('jcProdCode', 'name')
                                 
   if (jobCard) {
       console.log("JobCard Record is .... ", jobCard)
       res.json(jobCard)
   } else {
       res.status(404)
       throw new Error('Record Not Found')
   }
})

// @desc    Update JobCard Record
// @route   PUT /api/jobcards/:id
// @access  Private
const updateJobCard = asyncHandler(async (req, res) => {
   console.log("---------------start job card update --------------------")
	console.log("Inside UPDATE JobCard and ID is ", req.params.id)
	const jobCard = await JobCard.findById(req.params.id)
	if (jobCard) {
		try {
			
			jobCard.updatedBy = req.user._id;
         jobCard.jobCardNo = req.body.jobCardNo || jobCard.jobCardNo;
         jobCard.jcNo = req.body.jcNo || jobCard.jcNo;
         jobCard.batchDate = req.body.batchDate || jobCard.batchDate;
         jobCard.jobCardStatus = req.body.jobCardStatus || jobCard.jobCardStatus;
         jobCard.inputQuantity = req.body.inputQuantity || jobCard.inputQuantity;
         jobCard.totalOutputQuantity = req.body.totalOutputQuantity || jobCard.totalOutputQuantity;
         jobCard.markCompleted = req.body.markCompleted || jobCard.markCompleted;
         jobCard.jcProdCode = req.body.jcProdCode || jobCard.jcProdCode;
         console.log("<<<>>>> JOB CARD details are ", req.body.jobCardOutputDetails)
         jobCard.jobCardOutputDetails = req.body.jobCardOutputDetails || jobCard.jobCardOutputDetails;
			//jobCard.leadName = req.body.leadName || jobCard.leadName
         
			
			const updatedJobCard = await jobCard.save()
			console.log("Updated JOBCARD RECORD IS ", updatedJobCard)
         if(jobCard.jobCardOutputDetails !== undefined) {
            console.log("____________________________________________")
            console.log("1. JOb Card Out Put is Define and Need to update F.G.M.I -------------")
            
            let fgmi = {}
            fgmi.company = req.user.company,
            fgmi.createdBy = req.user._id,
            fgmi.updatedBy = req.user._id,
            fgmi.jcNo = jobCard.jcNo,
            fgmi.source = jobCard.jobCardNo,
            fgmi.batchDate = jobCard.batchDate,//new Date(),
            fgmi.batchStatus = "O",
            fgmi.entryDate,
            fgmi.batchQuantity = jobCard.totalOutputQuantity,
            console.log("1.1 FGMI Details before sending for batch udpates is ", fgmi)
            const createFGMI = await updateFGMIFromJobCardOutput(fgmi);
            console.log("2. After updating Create FGMI ", createFGMI)
            console.log("____________________________________________")
         }
         console.log("---------------END job card update --------------------")
			res.status(201).json(updatedJobCard)
		} catch (error) {
			console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating JobCard Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid JobCard data')
	}
});

// @desc    Delete a JobCard Record
// @route   DELETE /api/jobcards/:id
// @access  Private
const deleteJobCard = asyncHandler(async (req, res) => {
   console.log("Inside DELETE JobCard and ID is ", req.params.id)
   const jobCard = await JobCard.findById(req.params.id)
 
   if (jobCard) {
     await jobCard.remove()
     res.json({ message: 'JobCard removed' })
   } else {
     res.status(404)
     throw new Error('JobCard not found')
   }
})

// @desc    Get all JobCard Records
// @route   GET /api/jobcards/all
// @access  Private
const getAllJobCards = asyncHandler(async (req, res) => {
   
   const pageSize = Number(req.query.pageSize) || 10
   
   const page = Number(req.query.pageNumber) || 1

   const jobStatus = req.query.jobStatus || "All"
   
   console.log(">>>>> Inside getAllJobCards and jobStatus is --- === ", jobStatus)

   let findQuery = {};

   if(jobStatus.trim() === "O") {
      findQuery["markCompleted"] = "N";
      findQuery["totalOutputQuantity"] = 0;
   } else if(jobStatus.trim() === "OUTPUT") {
      console.log("when output is ZEOOOOOOOOOOOOOOoooo")
      findQuery["totalOutputQuantity"] = { $gt : 0};
   }
   

   console.log(">>>>> Inside getAllJobCards and Find QUERY is --- === ", findQuery)

   const count = await JobCard.countDocuments()
   console.log("Total records count are ==== ", count)

   const jobCards = await JobCard
                     .find(findQuery)
                     .sort({ _id:-1 })
                     .populate('jcNo', 'jcno jcDescription')
                     .populate('jcProdCode', 'name')
   
   //console.log(jobCards)
   
   res.json({ jobCards, page, pages: Math.ceil(count / pageSize) })
   //res.json(leads)
})

// @desc    Get all Required Master Data for Job Card Input Screen
// @route   GET /api/jobcards/masterdata
// @access  Private
const getAllMasterDataForJobCard = asyncHandler(async (req, res) => {
	let autoIncrementedJobCardNo = "";
	const jcMasters = await getAllJCMasters();
	const autoIncrementedNo = await AutoIncrement.getNextId(JOBCARD_MODULE_PREFIX)
   //console.log("Number got is ", autoIncrementedNo)
	if(autoIncrementedNo < 10) {
      autoIncrementedJobCardNo = "JC/000"+autoIncrementedNo;
   } else if(autoIncrementedNo < 100) {
      autoIncrementedJobCardNo = "JC/00"+autoIncrementedNo;
   } else if(autoIncrementedNo < 1000) {
      autoIncrementedJobCardNo = "JC/0"+autoIncrementedNo;
   } else {
      autoIncrementedJobCardNo = "JC/"+autoIncrementedNo;
   }
   //console.log("autoIncrementedJobCardNo ==== ", autoIncrementedJobCardNo)
   //console.log("jcMasters ==== ", jcMasters)
	res.json({ jcMasters, autoIncrementedJobCardNo })
})

// @desc    Get Yield Report
// @route   GET /api/jobcards/yieldreport
// @access  Private
const getYieldReport = asyncHandler(async (req, res) => {

   let jcId = req.query.jcId;
   
   let findQuery = {
      "markCompleted":"Y",
   };

   if(req.query.jcId !== "undefined" ) {
      if(req.query.jcId.trim().length > 0) {
         findQuery["jcNo"] = jcId;
      }
   }

   if(req.query.startDate === "undefined" && req.query.endDate === "undefined") {
      let firstDay = getFirstDayOfMonth();
      let lastDay = getLastDayOfMonth();

      let year = firstDay.getFullYear();
      let month = firstDay.getMonth();
      let date = firstDay.getDate();

      let year1 = lastDay.getFullYear();
      let month1 = lastDay.getMonth();
      let date1 = lastDay.getDate();

      findQuery["batchDate"] = { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
   }

   //let startDate = req.query.startDate;
   if(req.query.startDate !== "undefined") {
      if(req.query.startDate.trim().length > 0) {
         let year = new Date(req.query.startDate).getFullYear();
         let month = new Date(req.query.startDate).getMonth();
         let date = new Date(req.query.startDate).getDate();

         //findQuery["createdAt"] = { $gte: new Date(year, month, date) }
         if(req.query.endDate.trim().length > 0) {
            let year1 = new Date(req.query.endDate).getFullYear();
            let month1 = new Date(req.query.endDate).getMonth();
            let date1 = new Date(req.query.endDate).getDate();
   
            findQuery["batchDate"] = { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
         } else {
            let year1 = new Date().getFullYear();
            let month1 = new Date().getMonth();
            let date1 = new Date().getDate();
            findQuery["batchDate"] = { $gte: new Date(year, month, date), $lte: new Date(year1, month1, date1) }
         }
      }
   }

   //let endDate = req.query.endDate;
   if(req.query.endDate !== "undefined") {
      if(req.query.endDate.trim().length > 0) {
         let year = new Date(req.query.endDate).getFullYear();
         let month = new Date(req.query.endDate).getMonth();
         let date = new Date(req.query.endDate).getDate();

         if(req.query.startDate != "undefined") {
            if(req.query.startDate.trim().length === 0) {
               findQuery["batchDate"] = { $lte: new Date(year, month, date) }
            }
            
         } 

        // findQuery["createdAt"] = { $lt: new Date(year, month, date) }
      }
   }
   //Date dt = new Date(req.query.startDate);
   

   console.log("********* final FIND query is *********** ", findQuery)
   
   const allJobCards = 
      await JobCard.find(findQuery)
                  .sort({ _id:-1 })
                  .populate('jcNo', 'jcno jcDescription jcProdCode prodLayoutWidth prodLayoutHeight prodLayoutWidthUps prodLayoutHeightUps prodLayoutArea prodLayoutTotalUps bomWidth bomHeight bomArea ')

   let jobCards = [];
   for (const jc of allJobCards) {
      let srs = JSON.parse(JSON.stringify(jc))
      srs.jcNumber = jc.jcNo.jcno;
      srs.jcDesc = jc.jcNo.jcDescription;
      let inputSQM = ((parseFloat(jc.jcNo.bomArea)*parseFloat(jc.inputQuantity))/1550);
      let outputSQM = jc.jcNo.bomArea/1550*jc.totalOutputQuantity
      srs.inputSqm = inputSQM.toFixed(2);
      srs.outputSqm = outputSQM.toFixed(2);
      srs.wasteSqm = (inputSQM-outputSQM).toFixed(2);
      srs.yieldPercent = (100-(((inputSQM-outputSQM)/outputSQM)*100)).toFixed(2);

      jobCards.push(srs)
   }
   console.log(jobCards.length)
   res.json({ jobCards});
  
})

export {
   createJobCard,
   getJobCardById,
   updateJobCard,
   deleteJobCard,
   getAllJobCards,
   getAllMasterDataForJobCard,
   getYieldReport
}

