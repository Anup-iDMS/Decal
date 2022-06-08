import asyncHandler from 'express-async-handler';
import { findAppParameterValue } from '../master/appParameterController.js';
import PPMReport from './../../models/qa/PPMModel.js';
import { getCurrentFinancialYear } from './../../utils/utility.js';

// @desc    Create new PPMReport Record
// @route   POST /api/ppmreport
// @access  Private

const createPPMReport = asyncHandler(async (req, res) => {
	console.log("------------>>>> Inside create PPMReport function.....", )
   let targetPPMValue = await findAppParameterValue("TARGET_PPM_LEVEL")
   console.log("targetPPMValue >>>>>>>>>>> ", targetPPMValue)
   let targetPPMValueArray = [];
   for (let i = 0; i < 13; i++) {
      targetPPMValueArray.push(parseFloat(targetPPMValue))
      
   }
	const {
      reportYear,
      reportType,
      month,
      dispatchedQuantity,
      customerComplaintQty,
      actualPPMLevel
	} = req.body;

	const ppmReport = new PPMReport({
		company: req.user.company,
		createdBy: req.user._id,
		updatedBy: req.user._id,
      reportYear,
      reportType,
      month: ['Apr', "May", 'Jun', 'Jul', 'Aug', 'Sep', "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Total"],
      dispatchedQuantity: [206078, 156065, 135635, 228276, 197238, 221838, 173952, 0, 0, 0, 0, 0, 1319082],
      customerComplaintQty: [1319082, 0, 177, 273, 0, 0, 0, 0, 0, 0, 0, 0, 1220],
      targetPPMLevel: targetPPMValueArray,
      actualPPMLevel: [3736, 0, 1305, 1196, 0, 0, 0, 0, 0, 0, 0, 0, 520]
	});
	//return;
	try {
		const createPPMReport = await ppmReport.save();
		console.log("Created REcord is >>>>>> ", createPPMReport);
		if (createPPMReport) {
         res.status(201).json(createPPMReport)
      } else {
         res.status(400)
         throw new Error('Invalid PPM Report data')
      }
		//res.status(201).json(createPPMReport);
    } catch (error) {
		console.log("Inside error while creating error ==== ", error)
		res.status(400)
		throw new Error('Invalid PPMReport data')
    }
});

// @desc    Get PPMReport Report By Year
// @route   GET /api/ppmreport
// @access  Private
const getPPMReport = asyncHandler(async (req, res) => {
   let currentFinancialYear = getCurrentFinancialYear();
   let reportYear = req.query.reportYear || currentFinancialYear;
   let findQuery = {};
   console.log("reportYear >>>>>>>>>>> ", reportYear)
   if(req.query.reportYear !== undefined ) {
      findQuery["reportYear"] = reportYear;
   }

   const ppmReportRecord = await PPMReport.find(findQuery)
   const ppmReport = ppmReportRecord[0];
   console.log("Inside getPPMReport and PPM Report Detals are >>>>>>>>>>> ", ppmReport)
   res.json(ppmReport);
});

// @desc    Get PPMReport Report By Year
// @route   NONE
// @access  Private
const findPPMReportDetails = asyncHandler(async (reportYear) => {
   //let currentFinancialYear = getCurrentFinancialYear();
   //let reportYear = req.query.reportYear || currentFinancialYear;
   let findQuery = {};
   console.log("1. >>>>>>>. findPPMReportDetails >>>>>>>>> reportYear >>>>>>>>>>> ", reportYear)
   findQuery["reportYear"] = reportYear;

   const ppmReportRecord = await PPMReport.find(findQuery)
   const ppmReport = ppmReportRecord[0];
   
   return ppmReport;
});

// @desc    Update PPM Report Record
// @route   PUT /api/ppmreport/:id
// @access  Private

const updatePPMReport = asyncHandler(async (req, res) => {
	console.log("------------>>>> Inside create PPMReport function.....", )
   let targetPPMValue = await findAppParameterValue("TARGET_PPM_LEVEL")
   console.log("targetPPMValue >>>>>>>>>>> ", targetPPMValue)
   
   console.log("Inside UPDATE updatePPMReport and ID is ", req.params.id)
	const ppmReport = await PPMReport.findById(req.params.id)

   let targetPPMValueArray = [];
   for (let i = 0; i < 13; i++) {
      targetPPMValueArray.push(parseFloat(targetPPMValue))
      
   }
	
   if (ppmReport) {
		try {
			console.log(">>>>>>>>>>>>>>>> report type",ppmReport.reportType)
			ppmReport.updatedBy = req.user._id;
			ppmReport.month = ppmReport.month
			ppmReport.isActive = ppmReport.isActive
			ppmReport.reportType = req.body.reportType || ppmReport.reportType
			ppmReport.dispatchedQuantity = req.body.dispatchedQuantity || ppmReport.dispatchedQuantity
			ppmReport.customerComplaintQty = req.body.customerComplaintQty || ppmReport.customerComplaintQty
			ppmReport.targetPPMLevel = targetPPMValueArray
			ppmReport.actualPPMLevel = ppmReport.actualPPMLevel
			
			const updatedPPMReport = await ppmReport.save()
			console.log("Updated updatedPPMReport RECORD IS ", updatedPPMReport)
			res.status(201).json(updatedPPMReport)
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

export {
	createPPMReport,
   getPPMReport,
   updatePPMReport,
   findPPMReportDetails
}