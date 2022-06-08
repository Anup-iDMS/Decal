import asyncHandler from 'express-async-handler';
import { getYTDNetSale, getMTDNetSale, getMonthlySalesData, getMonthlyPPMSalesData } from '../sales/salesInvoiceController.js';
import { 
   getMTDCreditNote,
   getYTDNetCreditNote,
   getMonthlyPPMCreditData
} from '../sales/creditNoteController.js';
import { 
   getSalesOrdersBalanceValue, 
   getCurrentMonthSalesOrdersValue, 
   getCurrentMonthSalesOrdersDispatchValue, 
   getMonthlySalesOrderData,
   getCustomerSalesOrderData,
   getTopFiveOrderedJCs
} from '../sales/salesOrderController.js';
import { getFGMIData } from '../production/fgmiController.js';

import { 
   getPendingDRNWithQA,
   getMonthlyRejectedCountByQA,
   getMonthlyRejectedDRNData
} from './../drn/drnController.js';

import { ytdNetSalesFirstQuarter2122 } from '../../config/moduleConstants.js';
import { getCurrentFinancialYear } from './../../utils/utility.js';
import { findAppParameterValue } from '../master/appParameterController.js';
import { findPPMReportDetails } from '../qa/ppmReportController.js';

// @desc    Get all Required Master Data for DRN Screen
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = asyncHandler(async (req, res) => {
   console.log("1. Inside getDashboardData DASHBOARD")
   //sales orders value
   const soValue = await getCurrentMonthSalesOrdersValue();
   const dispatchValue = await getCurrentMonthSalesOrdersDispatchValue();
	const soBalanceValue = await getSalesOrdersBalanceValue();
   //invoice values
   const currentYear = getCurrentFinancialYear();
   let ytdNetSale1 = await getYTDNetSale();
   let ytdNetSale = 0
	if(currentYear === "2122") {
      console.log("currentYear ======= ", currentYear)
      console.log("ytdNetSale ======= ", ytdNetSale)
      console.log("ytdNetSalesFirstQuarter2122 ======= ", ytdNetSalesFirstQuarter2122)
      ytdNetSale = parseFloat(ytdNetSale1) + parseFloat(ytdNetSalesFirstQuarter2122);
   } else {
      ytdNetSale = parseFloat(ytdNetSale1)
   }
   console.log("******* FINAL ytdNetSale ======= ", ytdNetSale)
      
   const mtdNetSale = await getMTDNetSale()
	const ytdCreditNote = await getYTDNetCreditNote()
	console.log("******* FINAL ytdCreditNote ======= ", ytdCreditNote)
   const mtdCreditNote = await getMTDCreditNote()
	const monthlySalesData = await getMonthlySalesData()
	const monthlySalesOrderData = await getMonthlySalesOrderData()
	
   res.json({ ytdNetSale, monthlySalesData, monthlySalesOrderData, mtdNetSale, ytdCreditNote, mtdCreditNote, soValue, dispatchValue, soBalanceValue })
})

// @desc    Get all Required Master Data for DRN Screen
// @route   GET /api/dashboard/ppm
// @access  Private
const getPPMDashboardData = asyncHandler(async (req, res) => {
   console.log("1. Inside getPPMDashboardData DASHBOARD")
   const monthlyPPMSalesData = await getMonthlyPPMSalesData()
   const monthlyPPMCreditData = await getMonthlyPPMCreditData()

   let actualPPMData = {};
   let correctedPPMData = {};
   /** Below Data Variable are for PPM Actual Data */
   let dispatchedQty = [];
   let complaintedQty = [];
   let targetPPMLevel = [];
   let actualPPMLevel = [];
   let months = [];
   let dispatchedQtySum = 0;
   let complaintedQtySum = 0;
   //let reportYear = "2021-22";

   let targetPPMValue = await findAppParameterValue("TARGET_PPM_LEVEL")
   let reportYear = await findAppParameterValue("CURRENT_YEAR")||"2021-22";
   //console.log("targetPPMValue >>>>>>>>>>> ", targetPPMValue)
   //let targetPPMValueArray = [];
   for (let i = 0; i < 13; i++) {
      targetPPMLevel.push(parseFloat(targetPPMValue))
      
   }

   if(monthlyPPMSalesData !== undefined && monthlyPPMCreditData !== undefined) {
      dispatchedQty = monthlyPPMSalesData['Sales']
      for (let index = 0; index < dispatchedQty.length; index++) {
         const element = dispatchedQty[index];
         dispatchedQtySum += parseFloat(element)
         //targetPPMLevel.push(1000);
      }
      dispatchedQty.push(dispatchedQtySum)
      /** Rejected Qty Details */
      complaintedQty = monthlyPPMCreditData['Credit']
      months = monthlyPPMCreditData['Months'];
      months.push('Total')
      for (let index = 0; index < complaintedQty.length; index++) {
         const element = complaintedQty[index];
         complaintedQtySum += parseFloat(element)
      }
      complaintedQty.push(complaintedQtySum)
      for (let index = 0; index < complaintedQty.length; index++) {
         const element = complaintedQty[index];
         //calculate Actual PPM Level
         let targetLevel = targetPPMLevel[index]
         let dispqty = dispatchedQty[index]
         let mf = 1000
         let actualppm = 0;
         if(dispqty > 0) {
            actualppm = Math.round(((targetLevel*element)/dispqty)*mf)
         }
         actualPPMLevel.push(actualppm)
      }
      
      /** Add the data to the object */
      actualPPMData.reportYear = reportYear;
      actualPPMData.months = months;
      actualPPMData.dispatchedQty = dispatchedQty;
      actualPPMData.complaintedQty = complaintedQty;
      actualPPMData.targetPPMLevel = targetPPMLevel;
      actualPPMData.actualPPMLevel = actualPPMLevel;
   }

   /** Get Adjusted PPM data */
   let currentFinancialYear = getCurrentFinancialYear();
   const ppmReport = await findPPMReportDetails(currentFinancialYear)
  
   if(ppmReport !== undefined){
      correctedPPMData.reportYear = reportYear;
      correctedPPMData.months = ppmReport.month;
      correctedPPMData.dispatchedQty = ppmReport.dispatchedQuantity;
      correctedPPMData.complaintedQty = ppmReport.customerComplaintQty;
      let month = new Date().getMonth();
      console.log("Inside getPPMDashboardData and PPM Report Detals are >>>>>>>>>>> ", month)
      if(month === 0) {
         ppmReport.targetPPMLevel[10] = 0;
      } else if(month === 1) {
         ppmReport.targetPPMLevel[10] = 0;
         ppmReport.targetPPMLevel[11] = 0;
      } else {
         for (let index = month-2; index < ppmReport.targetPPMLevel.length; index++) {
            const element = ppmReport.targetPPMLevel[index];
            ppmReport.targetPPMLevel[index] = 0;
         }
      }
      correctedPPMData.targetPPMLevel = ppmReport.targetPPMLevel;
      correctedPPMData.adjustedPPMLevel = ppmReport.actualPPMLevel;
   }
   res.json({ actualPPMData, correctedPPMData, monthlyPPMSalesData, monthlyPPMCreditData })
   //res.json({ monthlyPPMSalesData, monthlyPPMCreditData })
});

// @desc    Get all Required Master Data for DRN Screen
// @route   GET /api/dashboard/charts
// @access  Private
const getDashboardChartData = asyncHandler(async (req, res) => {
   console.log("1. Inside getDashboardChartData DASHBOARD")
   //sales orders value
   const customerSalesOrderData = await getCustomerSalesOrderData()
   const topOrderedJCData = await getTopFiveOrderedJCs()
   console.log("topOrderedJCData == ", topOrderedJCData)
   res.json({ customerSalesOrderData, topOrderedJCData })
})

// @desc    Get all Required Data for Production Dashboard
// @route   GET /api/dashboard/production
// @access  Private
const getProductionDashboard = asyncHandler(async (req, res) => {
   console.log("1. Inside getProductionDashboard DASHBOARD")
   //FGMI Inventory
   const fgmiInventoryData = await getFGMIData()
   console.log("fgmiInventoryData == ", fgmiInventoryData)
   res.json({ fgmiInventoryData })
})

// @desc    Get all Required Data for QA Dashboard
// @route   GET /api/dashboard/qa
// @access  Private
const getQADashboard = asyncHandler(async (req, res) => {
   console.log("1. Inside getQADashboard DASHBOARD")
   //FGMI Inventory
   const pendingcount = await getPendingDRNWithQA()
   const mothlyRejectedCount = await getMonthlyRejectedCountByQA()
   const monthlyRejectedDRNCountData = await getMonthlyRejectedDRNData()
   //console.log("fgmiInventoryData == ", fgmiInventoryData)
   res.json({ pendingcount, mothlyRejectedCount, monthlyRejectedDRNCountData })
})

// @desc    Get all Required Data for QA Dashboard
// @route   GET /api/dashboard/sales
// @access  Private
const getSalesDashboard = asyncHandler(async (req, res) => {
   console.log("1. Inside getSalesDashboard DASHBOARD")
   //FGMI Inventory
   let salesData = {}
   //const fgmiInventoryData = await getFGMIData()
   //console.log("fgmiInventoryData == ", fgmiInventoryData)
   res.json({ salesData })
})

export {
   getDashboardData,
   getDashboardChartData,
   getProductionDashboard,
   getQADashboard,
   getSalesDashboard,
   getPPMDashboardData
}