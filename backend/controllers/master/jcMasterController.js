import colors from 'colors';
import json2csv from 'json2csv';
import asyncHandler from 'express-async-handler';
import { JCMaster } from "../../models/master/jcMasterModel.js";
import { 
   getAllProductCategories,
   getAllProductCodes,
   getAllUOMs,
   getAllMachineMasters 
} from './appControllers.js';
import { getAllCustomers } from './customerControllers.js';
import AutoIncrement from '../../models/autoincrement/autoIncrementModel.js';
import { getHSNByCode } from './hsnController.js';
import path from 'path'


// @desc    Register a new user
// @route   POST /api/jcmasters
// @access  Public
const createJCMaster = asyncHandler(async (req, res) => {
   //console.log("Inside createJCMaster ....")
   const { 
      jcno,
      company,
      jcProdCategory,
      jcProdCode,
      jcDescription,
      unit,
      customerPartNumber,
      hsn,
      artUOM,
      adWidth,
      adHeight,
      adArea,
      prodLayoutUOM,
      prodLayoutWidth,
      prodLayoutHeight,
      prodLayoutWidthUps,
      prodLayoutHeightUps,
      prodLayoutArea,
      prodLayoutTotalUps,
      bomUOM,
      bomWidth,
      bomHeight,
      bomArea,
      colour1,
      colour2,
      colour3,
      colour4,
      colour5,
      colour6,
      colour7,
      colour8,
      colour9,
      colour10,
      colour11,
      colour12,
      colour13,
      colour14,
      colour15,
      totalColors,
      proposedMachine,
      prodRemarks,
      isActive,
      positiveRemarks,
      jcCustomerDetails,
      inputFields
      
     } = req.body
  
    const jcExists = await JCMaster.findOne({ jcno, company: req.user.company })
  
   if (jcExists) {
      res.status(400)
      //console.log("JC Master No is ", jcno)
      //console.log("JC Master Company is ", req.user.company)
      throw new Error('JCMaster already exists')
   }
  
   try {
      const jcRecord = await JCMaster.create({
         jcno,
         company:req.user.company,
         createdBy: req.user._id,
         updatedBy: req.user._id,
         jcProdCategory,
         jcProdCode,
         jcDescription,
         unit,
         customerPartNumber,
         hsn,
         artUOM,
         adWidth,
         adHeight,
         adArea,
         prodLayoutUOM,
         prodLayoutWidth,
         prodLayoutHeight,
         prodLayoutWidthUps,
         prodLayoutHeightUps,
         prodLayoutArea,
         prodLayoutTotalUps,
         bomUOM,
         bomWidth,
         bomHeight,
         bomArea,
         colour1,
         colour2,
         colour3,
         colour4,
         colour5,
         colour6,
         colour7,
         colour8,
         colour9,
         colour10,
         colour11,
         colour12,
         colour13,
         colour14,
         colour15,
         totalColors,
         proposedMachine,
         prodRemarks,
         isActive,
         positiveRemarks,
         totalColors,
         jcCustomerDetails:inputFields
      })
       
      if (jcRecord) {
         ////console.log("====>>> After inserting record update AUTO increment number <<<==== ", jcRecord.jcno)
         if(jcRecord.jcno.startsWith("S")) {
            const aiv = await AutoIncrement.setNextId("JC-SP")
         } else if(jcRecord.jcno.startsWith("D")) {
            const aiv = await AutoIncrement.setNextId("JC-DP")
         } else if(jcRecord.jcno.startsWith("P")) {
            const aiv = await AutoIncrement.setNextId("JC-PC")
         } else {
            const aiv = await AutoIncrement.setNextId("JC")
         }
         res.status(201).json(jcRecord)
      } else {
         res.status(400)
         throw new Error('Invalid JC data')
      }
   } catch (error) {
      //console.log("Error while creating JC data ".red.underline.bold, error)
      res.status(400)
      throw new Error('Unable to save the record !')
   }
})

// @desc    Get JCMaster Record by ID
// @route   GET /api/jcmasters/:id
// @access  Private

const getJCMasterById = asyncHandler(async (req, res) => {
   ////console.log(">>>>> Inside get JCMaster By Id")
   const module = await JCMaster.findById(req.params.id)
                                 .populate('jcProdCode', 'name')
                                 .populate('jcProdCategory', 'name')
                                 .populate('jcCustomerDetails.customerId', 'custName custCode').exec()
                                 //.populate('jcCustomerDetails.custName').exec()
                                 
   ////console.log("2. The fetched customer record is ==== ", module._id)
   if (module) {
       ////console.log("Module Record is .... ", module.jcCustomerDetails)
       res.json(module)
   } else {
       res.status(404)
       throw new Error('Record Not Found')
   }
})

// @desc    Get JCMaster Record by ID
// @route   none
// @access  Private

const findJCMasterById = asyncHandler(async (jcId) => {
   ////console.log(">>>>> Inside findJCMasterById")
   const module = await JCMaster.findById(jcId)
                                 .populate('jcProdCode', 'name')
                                 .populate('jcProdCategory', 'name')
                                 .populate('jcCustomerDetails.customerId', 'custName').exec()
                                 //.populate('jcCustomerDetails.custName').exec()
                                 
   ////console.log("2. The fetched customer record is ==== ", module._id)
   if (module) {
       ////console.log("Module Record is .... ", module.jcCustomerDetails)
       return module;
   } else {
       res.status(404)
       throw new Error('Record Not Found')
   }
})

// @desc    Update JCMaster Record
// @route   PUT /api/jcmasters/:id
// @access  Private
const updateJCMaster = asyncHandler(async (req, res) => {
	//console.log("Inside UPDATE JCMaster and ID is ", req.params.id)
	//console.log("req.body.jcCustomerDetails ", req.body.jcCustomerDetails)
	const module = await JCMaster.findById(req.params.id)
	if (module) {
		try {
			
			module.jcno = req.body.jcno || module.jcno ,
         module.jcId = req.body.jcId || module.jcId ,
         module.updatedBy = req.user._id,
         module.jcProdCategory = req.body.jcProdCategory || module.jcProdCategory ,
         module.jcProdCode = req.body.jcProdCode || module.jcProdCode ,
         module.jcDescription = req.body.jcDescription || module.jcDescription ,
         module.unit = req.body.unit || module.unit ,
         module.customerPartNumber = req.body.customerPartNumber || module.customerPartNumber ,
         module.hsn = req.body.hsn || module.hsn ,
         module.artUOM = req.body.artUOM || module.artUOM ,
         module.adWidth = req.body.adWidth || module.adWidth ,
         module.adHeight = req.body.adHeight || module.adHeight ,
         module.adArea = req.body.adArea || module.adArea ,
         module.prodLayoutUOM = req.body.prodLayoutUOM || module.prodLayoutUOM ,
         module.prodLayoutWidth = req.body.prodLayoutWidth || module.prodLayoutWidth ,
         module.prodLayoutHeight = req.body.prodLayoutHeight || module.prodLayoutHeight ,
         module.prodLayoutWidthUps = req.body.prodLayoutWidthUps || module.prodLayoutWidthUps ,
         module.prodLayoutHeightUps = req.body.prodLayoutHeightUps || module.prodLayoutHeightUps ,
         module.prodLayoutArea = req.body.prodLayoutArea || module.prodLayoutArea ,
         module.prodLayoutTotalUps = req.body.prodLayoutTotalUps || module.prodLayoutTotalUps ,
         module.bomUOM = req.body.bomUOM || module.bomUOM ,
         module.bomWidth = req.body.bomWidth || module.bomWidth ,
         module.bomHeight = req.body.bomHeight || module.bomHeight ,
         module.bomArea = req.body.bomArea || module.bomArea ,
         module.colour1 = req.body.colour1 || module.colour1 ,
         module.colour2 = req.body.colour2 || module.colour2 ,
         module.colour3 = req.body.colour3 || module.colour3 ,
         module.colour4 = req.body.colour4 || module.colour4 ,
         module.colour5 = req.body.colour5 || module.colour5 ,
         module.colour6 = req.body.colour6 || module.colour6 ,
         module.colour7 = req.body.colour7 || module.colour7 ,
         module.colour8 = req.body.colour8 || module.colour8 ,
         module.colour9 = req.body.colour9 || module.colour9 ,
         module.colour10 = req.body.colour10 || module.colour10 ,
         module.colour11 = req.body.colour11 || module.colour11 ,
         module.colour12 = req.body.colour12 || module.colour12 ,
         module.colour13 = req.body.colour13 || module.colour13 ,
         module.colour14 = req.body.colour14 || module.colour14 ,
         module.colour15 = req.body.colour15 || module.colour15 ,
         module.totalColors = req.body.totalColors || module.totalColors ,
         module.proposedMachine = req.body.proposedMachine || module.proposedMachine ,
         module.prodRemarks = req.body.prodRemarks || module.prodRemarks ,
         module.isActive = req.body.isActive || module.isActive ,
         module.positiveRemarks = req.body.positiveRemarks || module.positiveRemarks ,
         module.jcCustomerDetails = req.body.jcCustomerDetails || module.jcCustomerDetails
			
			const updatedModule = await module.save()
			//console.log("Updated JCMaster RECORD IS ", updatedModule)
			res.status(201).json(updatedModule)
		} catch (error) {
			//console.log("Inside error while Updating JC MAster error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating JCMaster Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid JCMaster data')
	}
});

// @desc    Delete a JCMaster Record
// @route   DELETE /api/jcmasters/:id
// @access  Private
const deleteJCMaster = asyncHandler(async (req, res) => {
   ////console.log("Inside DELETE Module and ID is ", req.params.id)
   const module = await JCMaster.findById(req.params.id)
 
   if (module) {
     await module.remove()
     res.json({ message: 'JCMaster removed' })
   } else {
     res.status(404)
     throw new Error('JCMaster not found')
   }
})
// @desc    Get all JCMaster Records
// @route   GET /api/jcmasters
// @access  Private
const getJCMasters = asyncHandler(async (req, res) => {
   ////console.log(">>>>> Inside JCMasters WITH PAGINATION and JSON --- === ")
   //{isActive:"A"}
   const jcMasters = await JCMaster.find()
                                 .sort({ jcno:-1 })
                                 .populate('jcCustomerDetails.customerId', 'custName')
                                 .populate('jcProdCode', 'name')
                                 .populate('jcProdCategory', 'name')
                                 .populate('prodLayoutUOM', 'name')
   
   //console.log("Total jcMasters >>>>>> are ==== ", jcMasters.length)
   res.json(jcMasters)
   //res.json(leads)
})

// @desc    Get all JCMaster Records
// @route   GET /api/jcmasters/all
// @access  Private
const getAllJCMasters = asyncHandler(async (req, res) => {
   ////console.log(">>>>> Inside JCMasters WITH PAGINATION--- === ")
   //const pageSize = Number(req.query.pageSize) || 10000
   //const page = Number(req.query.pageNumber) || 1

   //const count = await JCMaster.countDocuments()
   ////console.log("Total records count are ==== ", count)
   // .populate('jcCustomerDetails.customer', 'custName').exec()
   const jcMasters = await JCMaster.find({isActive:"A"})
                                 .sort({ jcno:-1 })
                                 .populate('jcCustomerDetails.customerId', 'custName')
                                 .populate('jcProdCode', 'name')
                                 .populate('jcProdCategory', 'name')
   ////console.log("Total Leads are ==== ", jcMasters)
   ////console.log("Page Number is ==== ", page)
   ////console.log("Total pages are ==== ", Math.ceil(count / pageSize))
   return jcMasters;
   //res.json(leads)
})

// @desc    Get all Master data required to create a JC record
// @route   GET /api/jcmasters/masterdata
// @access  Private
const getAllMasterDataForJC = asyncHandler(async (req, res) => {
   ////console.log("Inside function to get all master data for JC master ==== ")
   let autoIncrementedSPNo = "";
   let autoIncrementedDPNo = "";
   let autoIncrementedPCNo = "";
   const prodCategories = await getAllProductCategories();
   const prodCodes = await getAllProductCodes();
   const uoms = await getAllUOMs();
	const machineMasters = await getAllMachineMasters();
   const customers = await getAllCustomers();
   const autoIncrementedSP = await AutoIncrement.getNextId("JC-SP")
   ////console.log("Screen Priniting is ", autoIncrementedSP)
   const autoIncrementedDP = await AutoIncrement.getNextId("JC-DP")
   ////console.log("Digital Priniting is ", autoIncrementedDP)
   const autoIncrementedPC = await AutoIncrement.getNextId("JC-PC")
   ////console.log("Plotter Cutting Priniting is ", autoIncrementedPC)
   if(autoIncrementedSP < 10) {
      autoIncrementedSPNo = "S000"+autoIncrementedSP;
   } else if(autoIncrementedSP < 100) {
      autoIncrementedSPNo = "S00"+autoIncrementedSP;
   } else if(autoIncrementedSP < 1000) {
      autoIncrementedSPNo = "S0"+autoIncrementedSP;
   } else {
      autoIncrementedSPNo = "S"+autoIncrementedSP;
   }

   if(autoIncrementedDP < 10) {
      autoIncrementedDPNo = "D000"+autoIncrementedDP;
   } else if(autoIncrementedDP < 100) {
      autoIncrementedDPNo = "D00"+autoIncrementedDP;
   } else if(autoIncrementedDP < 1000) {
      autoIncrementedDPNo = "D0"+autoIncrementedDP;
   } else {
      autoIncrementedDPNo = "D"+autoIncrementedDP;
   }

   if(autoIncrementedPC < 10) {
      autoIncrementedPCNo = "P000"+autoIncrementedPC;
   } else if(autoIncrementedPC < 100) {
      autoIncrementedPCNo = "P00"+autoIncrementedPC;
   } else if(autoIncrementedPC < 1000) {
      autoIncrementedPCNo = "P0"+autoIncrementedPC;
   } else {
      autoIncrementedPCNo = "P"+autoIncrementedPC;
   }

   const autoIncValues = {
      "SP": autoIncrementedSPNo,
      "DP": autoIncrementedDPNo,
      "PC": autoIncrementedPCNo,
   }
   ////console.log("Inside function to get all master data for JC master and autoIncrementedValue ==== ", autoIncrementedValue)
   //const aiv = await AutoIncrement.setNextId("JC")
   ////console.log("ALLs AUTO Incremented Value ==== ", autoIncValues)
   res.json({ prodCategories, prodCodes, uoms, machineMasters, customers, autoIncValues })
})

// @desc    Get all JC records for a Customer
// @route   GET /api/jcmasters/customer/:id
// @access  Private
const getCustomerJCs = asyncHandler(async (req, res) => {
   let customerId = req.params.id;
   ////console.log(">>>>> Inside a function to get Customer specific JCs--- === ", customerId)
   const jcs = await JCMaster.find({ "jcCustomerDetails.customerId":customerId, isActive:"A" })
   ////console.log("Found Records are ==== ", customerJCs)
   ////console.log("Page Number is ==== ", page)
   ////console.log("Total pages are ==== ", Math.ceil(count / pageSize))
   let index = 0;
   let customerJCs =  JSON.parse(JSON.stringify(jcs));
   for (const jc of customerJCs) {
      jc.hsnDetails = {}
      let srs = await getHSNByCode(jc.hsn)
      jc.hsnDetails = srs;
      index++;
   }
   ////console.log(customerJCs)

   //console.log("-------------XX START XX-------------------")
   //console.log(customerJCs)
   //console.log("-------------XX END XX-------------------")

   res.json(customerJCs)
   //res.json(leads)
})

// @desc    Get all JC POs records for a Customer
// @route   GET /api/jcmasters/po/customer/:id
// @access  Private
const getCustomerJCPOs = asyncHandler(async (req, res) => {
   let customerId = req.params.id;
   const jcs = await JCMaster.find({ "jcCustomerDetails.customerId":customerId, isActive:"A", "jcCustomerDetails.isCustomerPOActive":"Yes" })
   let index = 0;
   let customerJCs =  JSON.parse(JSON.stringify(jcs));
   let customerJCIDs = [];
   for (const jc of customerJCs) {
      jc.hsnDetails = {}
      let srs = await getHSNByCode(jc.hsn)
      jc.hsnDetails = srs;
      if(!customerJCIDs.includes(jc.jcCustomerDetails[0].customerPONumber)) {
         //console.log("JC NO is ", jc.jcno)
         //console.log("JC details ", jc)
         if(jc.jcCustomerDetails[0].customerPONumber === "-"){

         } else if(jc.jcCustomerDetails[0].customerPONumber === ""){
            
         } else if(jc.jcCustomerDetails[0].customerPONumber === " "){
            
         } else if(jc.jcCustomerDetails[0].customerPONumber == null){
            
         } else {
            customerJCIDs.push(jc.jcCustomerDetails[0].customerPONumber)
         }
      }
             
      index++;
   }
   console.log("Customre JC ids are ", customerJCIDs)
   res.json({customerJCs, customerJCIDs})
   //res.json(leads)
})

// @desc    Get all JC records for a Specific Customer
// @access  Private
const getCustomerSpecificJCs = asyncHandler(async (req, res) => {
   let customerId = req.params.id;
  // //console.log(">>>>> Inside a function to get Customer specific JCs--- === ", customerId)
   const customerJCs = await JCMaster.find({ "jcCustomerDetails.customerId":customerId, isActive:"A" })
  // //console.log("Found Records are ==== ", customerJCs)
   ////console.log("Page Number is ==== ", page)
   ////console.log("Total pages are ==== ", Math.ceil(count / pageSize))
  ////console.log(modules)
   return customerJCs;
   //res.json(leads)
})

// @desc    Get all JC records for a Specific Customer
// @access  Private
const getHSNDetailsForJCId = asyncHandler(async (jcId) => {
   ////console.log(" --- JC ID ---- ", jcId)
   const jcDetailsDetails = await JCMaster.findById(jcId)
   ////console.log("HSN Code is ", jcDetailsDetails.hsn)
   const hsnDetails = await getHSNByCode(jcDetailsDetails.hsn)
   ////console.log(" HS N DETAILS ARE -------------> ", hsnDetails)
   return hsnDetails;
})

// @desc    Get all JCMaster Records
// @route   GET /api/jcmasters/jcmasterreport
// @access  Private
const getJCMastersReport = asyncHandler(async (req, res) => {
   //console.log(">>>>> Inside getJCMastersReport --- === ")
   let findQuery = {isActive:"A"};
   
   
   let customerId = req.query.customerId;
   console.log("---------- customerId -----", customerId)
   if(customerId !== "undefined") {
      findQuery["jcCustomerDetails.customerId"] = customerId
   } 
   
   let jcId = req.params.jcId;
   console.log("---------- jcId id -----", jcId)
   if(jcId !== undefined) {
      findQuery["_id"] = jcId
   } 
   console.log("--- Final Qiery is ---- ", findQuery)
   const jcMastersRecords = await JCMaster.find(findQuery)
                                 .sort({ jcno:-1 })
                                 .populate('jcCustomerDetails.customerId', 'custName')
                                 .populate('jcProdCode', 'name')
                                 .populate('jcProdCategory', 'name')
   //return jcMasters;
   let jcMasters = [];
   for (const jc of jcMastersRecords) {
      let srs = {};
      let u = "";
      let b = "";
      if(jc.prodLayoutUOM === "60f6e44fb74ae12ce4f0995b"){
         u = "ft"
      } else if(jc.prodLayoutUOM === "60f6e453b74ae12ce4f0995e"){
         u = "mm"
      } else if(jc.prodLayoutUOM === "60f6e459b74ae12ce4f09961"){
         u = "cm"
      } else if(jc.prodLayoutUOM === "60f6e45eb74ae12ce4f09964"){
         u = "inch"
      }

      if(jc.bomUOM === "60f6e44fb74ae12ce4f0995b"){
         b = "ft"
      } else if(jc.bomUOM === "60f6e453b74ae12ce4f0995e"){
         b = "mm"
      } else if(jc.bomUOM === "60f6e459b74ae12ce4f09961"){
         b = "cm"
      } else if(jc.bomUOM === "60f6e45eb74ae12ce4f09964"){
         b = "inch"
      }

      srs['JC #'] = jc.jcno
      srs['JC Description'] = jc.jcDescription
      srs['Customer Name'] = jc.jcCustomerDetails[0].customerId.custName
      srs['Part Number'] = (jc.customerPartNumber === undefined || jc.customerPartNumber === "")?"-":jc.customerPartNumber
      srs['Rate'] = jc.jcCustomerDetails[0].customerPrice
      srs['Tentative Monthly Offtake'] = jc.jcCustomerDetails[0].tmo === undefined ? "-":jc.jcCustomerDetails[0].tmo
      srs['PO #'] = jc.jcCustomerDetails[0].customerPONumber === undefined ? "-":jc.jcCustomerDetails[0].customerPONumber
      srs['PO Date'] = jc.jcCustomerDetails[0].customerPODate === undefined ? "":jc.jcCustomerDetails[0].customerPODate
      srs['Total Colors'] = jc.totalColors
      srs['HSN'] = jc.hsn
      srs['Unit'] = (jc.unit)
      srs['Label UOM'] = (jc.artUOM === undefined || jc.artUOM === "")?"-":jc.artUOM
      srs['Label Width'] = (jc.adWidth === undefined || jc.adWidth === null)?0:jc.adWidth
      srs['Label Height'] = (jc.adHeight === undefined || jc.adHeight === null)?0:jc.adHeight
      srs['Label Area'] = (jc.adArea === undefined || jc.adArea === null)?0:jc.adArea
      srs['PL UOM'] = u
      srs['PL Width'] = jc.prodLayoutWidth
      srs['PL Height'] = jc.prodLayoutHeight
      srs['PL Area'] = jc.prodLayoutArea
      srs['PL Width Ups'] = jc.prodLayoutWidthUps
      srs['PL Height Ups'] = jc.prodLayoutHeightUps
      srs['PL Total Ups'] = jc.prodLayoutTotalUps
      srs['BOM UOM'] = b
      srs['BOM Width'] = jc.bomWidth
      srs['BOM Height'] = jc.bomHeight
      srs['BOM Area'] = jc.bomArea
      srs['Product Category'] = jc.jcProdCategory.name
      srs['Product Code'] = jc.jcProdCode.name

      jcMasters.push(srs)
   }
   res.json(jcMasters)
})

const getJCBulkUploadTemplate = asyncHandler(async (req, res) => {
   console.log("Inside function to get JC master bulk upload template ========== ")
   
   let fields = [
		'name.firstName',
		'name.lastName',
		'biography',
		'twitter',
		'facebook',
		'linkedin'
	];
   const __dirname = path.resolve()
   var filename = "authors.csv"
   var filePath = `${__dirname}`+'/uploads/sales/po/'+`${filename}`;

	// let csv = json2csv({ data: '', fields: fields });

	// res.set("Content-Disposition", "attachment;filename=authors.csv");
	// res.set("Content-Type", "application/octet-stream");

	// res.send(csv);
   res.sendFile(filePath)

   //res.json("Will Send You The Template");
})

export {
   createJCMaster,
   getJCMasterById,
   updateJCMaster,
   deleteJCMaster,
   getJCMasters,
   getAllJCMasters,
   getAllMasterDataForJC,
   getCustomerJCs,
   getCustomerJCPOs,
   getCustomerSpecificJCs,
   getHSNDetailsForJCId,
   findJCMasterById,
   getJCMastersReport,
   getJCBulkUploadTemplate
}