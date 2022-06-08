import asyncHandler from 'express-async-handler'
import xlsxtojson from 'xlsx-to-json'
import xlstojson from 'xls-to-json'
import Supplier from '../../models/master/supplierModel.js'
import { SUPPLIER_MODULE_PREFIX_PREFIX } from '../../config/moduleConstants.js'
import AutoIncrement from './../../models/autoincrement/autoIncrementModel.js'

// @desc    Register a new SUPPLIER
// @route   POST /api/suppliers
// @access  Public
const registerSupplier = asyncHandler(async (req, res) => {
  console.log('Inside register SUPPLIER.... ')
  const {
    supplierCode,
    supplierName,
    supplierNickName,
    supplierCompanyType,
    supplierCIN,
    supplierUdyogAadhar,
    supplierGST,
    supplierURD,
    supplierPAN,
    supplierBillingAddress,
    supplierShipingAddress,
    supplierContactPersonName,
    supplierContactPersonDesignation,
    supplierContactPersonNumber,
    supplierContactPersonAltNum,
    supplierContactPersonEmail,
    supplierTelNo,
    supplierWebsite,
    //custAlsoSupplier,
    supplierVendorCode,
  } = req.body

  console.log('Check whether Supplier Exists....', supplierCode)
  console.log('Check whether Supplier Exists....', req.user.company)
  const supplierExists = await Supplier.findOne({
    supplierCode,
    company: req.user.company,
  })
  if (supplierExists) {
    console.log('Supplier Code Alreaady Exists....')
    res.status(400)
    throw new Error('Supplier Code already exists')
  }
  console.log('>>>>>>>>>> BEFORE SUPPLIER is --- ')
  try {
    let supplierBillAddress = {}
    let supplierShipAddress = {}
    let supplierAddress = []

    supplierBillAddress.addressType = 'Billing'
    supplierBillAddress.addressLine1 =
      supplierBillingAddress[0].supplierBillAddressLine1
    supplierBillAddress.addressLine2 =
      supplierBillingAddress[0].supplierBillAddressLine2
    supplierBillAddress.addressLine3 =
      supplierBillingAddress[0].supplierBillAddressLine3
    supplierBillAddress.state = supplierBillingAddress[0].supplierBillState
    supplierBillAddress.city = supplierBillingAddress[0].supplierBillCity
    supplierBillAddress.district =
      supplierBillingAddress[0].supplierBillDistrict
    supplierBillAddress.pinCode = supplierBillingAddress[0].supplierBillPinCode
    supplierAddress.push(supplierBillAddress)

    supplierShipAddress.addressType = 'Shipping'
    supplierShipAddress.addressLine1 =
      supplierShipingAddress[0].supplierShipAddressLine1
    supplierShipAddress.addressLine2 =
      supplierShipingAddress[0].supplierShipAddressLine2
    supplierShipAddress.addressLine3 =
      supplierShipingAddress[0].supplierShipAddressLine3
    supplierShipAddress.state = supplierShipingAddress[0].supplierShipState
    supplierShipAddress.city = supplierShipingAddress[0].supplierShipCity
    supplierShipAddress.district =
      supplierShipingAddress[0].supplierShipDistrict
    supplierShipAddress.pinCode = supplierShipingAddress[0].supplierShipPinCode
    supplierAddress.push(supplierShipAddress)

    if (req.body.supplierAddress === undefined) {
      console.log(
        '3. Inside IF Supplier Shop Address ------------- > ',
        supplierAddress
      )
      supplierAddress = JSON.parse(JSON.stringify(supplierAddress))
    } else {
      console.log(
        '4. Inside ELSE Supplier Shop Address ------------- > ',
        supplierAddress
      )
      supplierAddress = req.body.supplierAddress
    }

    const supplier = await Supplier.create({
      company: req.user.company,
      createdBy: req.user._id,
      updatedBy: req.user._id,
      supplierCode,
      supplierName,
      supplierNickName,
      supplierCompanyType,
      supplierCIN,
      supplierUdyogAadhar,
      supplierGST,
      supplierURD,
      supplierPAN,
      supplierBillingAddress,
      supplierShipingAddress,
      supplierContactPersonName,
      supplierContactPersonDesignation,
      supplierContactPersonNumber,
      supplierContactPersonAltNum,
      supplierContactPersonEmail,
      supplierTelNo,
      supplierWebsite,
      //custAlsoSupplier,
      supplierVendorCode,
      supplierAddress,
    })
    console.log('>>>>>>>>>> SUPPLIER is --- ', supplier)
    if (supplier) {
      const aiv = await AutoIncrement.setNextId(SUPPLIER_MODULE_PREFIX_PREFIX)
      res.status(201).json({ supplier })
    } else {
      res.status(400)
      throw new Error('Invalid Supplier data')
    }
  } catch (error) {
    console.log('>>>>>>>>>> SUPPLIER Creating ERROR --- ', error)
    res.status(400)
    throw new Error('Invalid Supplier data')
  }
})

// @desc    Get supplier profile
// @route   GET /api/suppliers/profile
// @access  Private
const getSupplierProfile = asyncHandler(async (req, res) => {
  console.log('Inside get SUPPLIER profile....', req.params)
  console.log('Inside get SUPPLIER profile....', req.params.id)
  const supplier = await Supplier.findById(req.params.id).populate('company')

  if (supplier) {
    console.log('--- printing supplier ==== ', supplier)
    res.json({
      supplier,
    })
  } else {
    res.status(404)
    throw new Error('Supplier not found')
  }
})

// @desc    Get supplier by ID
// @route   GET /api/suppliers/:id
// @access  Private
const getSupplierById = asyncHandler(async (req, res) => {
  console.log('Inside getSupplierById....', req.params)
  const supplier = await Supplier.findById(req.params.id).populate('company')

  if (supplier) {
    res.json(supplier)
  } else {
    res.status(404)
    throw new Error('supplier not found')
  }
})

// @desc    Get supplier by ID
// @route   GET /api/suppliers/:id
// @access  Private
const findSupplierById = asyncHandler(async (id) => {
  const supplier = await Supplier.findById(id).exec()
  if (supplier) {
    console.log('findSupplierById...... ', supplier)
    return supplier
  } else {
    res.status(404)
    throw new Error('Record Not Found')
  }
})

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private/Admin
const getSuppliers = asyncHandler(async (req, res) => {
  //console.log("1. Inside route to get all users..... ", req.user.company)
  const pageSize = 1000

  const page = Number(req.query.pageNumber) || 1

  const count = await Supplier.countDocuments({ company: req.user.company })

  //console.log("2. Total Number of Records found ..... ", count)

  const suppliers = await Supplier.find({ company: req.user.company })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  //console.log("3. Supplier Records are ..... ", suppliers)

  res.json({ suppliers, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private/Admin
const getAllSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find({}).sort({ supplierCode: 1 })
  //console.log("Inside supplier controller ", suppliers)
  return suppliers
})

const getAllMasterDataForSupplier = asyncHandler(async (req, res) => {
  let autoIncrementedSupplierNo = ''

  const autoIncrementedNo = await AutoIncrement.getNextId(
    SUPPLIER_MODULE_PREFIX_PREFIX
  )
  console.log('Supplier Number got is ', autoIncrementedNo)
  if (autoIncrementedNo < 10) {
    autoIncrementedSupplierNo = 'S000' + autoIncrementedNo
  } else if (autoIncrementedNo < 100) {
    autoIncrementedSupplierNo = 'S00' + autoIncrementedNo
  } else if (autoIncrementedNo < 1000) {
    autoIncrementedSupplierNo = 'S0' + autoIncrementedNo
  } else {
    autoIncrementedSupplierNo = 'S' + autoIncrementedNo
  }
  res.json({ autoIncrementedSupplierNo })
})

// @desc    Update Supplier Record
// @route   PUT /api/suppliers/:id
// @access  Private
const updateSupplier = asyncHandler(async (req, res) => {
  console.log('---------------start supplier update --------------------')
  console.log('Inside UPDATE Supplier and ID is ', req.params.id)
  const supplier = await Supplier.findById(req.params.id)
  if (supplier) {
    let supplierBillAddress = {}
    let supplierShipAddress = {}
    let supplierAddress = []

    supplierBillAddress.addressType = 'Billing'
    supplierBillAddress.addressLine1 =
      supplier.supplierBillingAddress[0].supplierBillAddressLine1
    supplierBillAddress.addressLine2 =
      supplier.supplierBillingAddress[0].supplierBillAddressLine2
    supplierBillAddress.addressLine3 =
      supplier.supplierBillingAddress[0].supplierBillAddressLine3
    supplierBillAddress.state =
      supplier.supplierBillingAddress[0].supplierBillState
    supplierBillAddress.city =
      supplier.supplierBillingAddress[0].supplierBillCity
    supplierBillAddress.district =
      supplier.supplierBillingAddress[0].supplierBillDistrict
    supplierBillAddress.pinCode =
      supplier.supplierBillingAddress[0].supplierBillPinCode
    supplierAddress.push(supplierBillAddress)

    supplierShipAddress.addressType = 'Shipping'
    supplierShipAddress.addressLine1 =
      supplier.supplierShipingAddress[0].supplierShipAddressLine1
    supplierShipAddress.addressLine2 =
      supplier.supplierShipingAddress[0].supplierShipAddressLine2
    supplierShipAddress.addressLine3 =
      supplier.supplierShipingAddress[0].supplierShipAddressLine3
    supplierShipAddress.state =
      supplier.supplierShipingAddress[0].supplierShipState
    supplierShipAddress.city =
      supplier.supplierShipingAddress[0].supplierShipCity
    supplierShipAddress.district =
      supplier.supplierShipingAddress[0].supplierShipDistrict
    supplierShipAddress.pinCode =
      supplier.supplierShipingAddress[0].supplierShipPinCode
    supplierAddress.push(supplierShipAddress)

    try {
      console.log(
        '1 Supplier Address ------------- > ',
        supplier.supplierAddress.length
      )
      console.log(
        '2. Supplier req.body.supplierAddress ------------- > ',
        req.body.supplierAddress
      )
      supplier.updatedBy = req.user._id
      supplier.company = supplier.company
      supplier.supplierCode = req.body.supplierCode || supplier.supplierCode
      supplier.supplierName = req.body.supplierName || supplier.supplierName
      supplier.supplierNickName =
        req.body.supplierNickName || supplier.supplierNickName
      supplier.supplierCompanyType =
        req.body.supplierCompanyType || supplier.supplierCompanyType
      supplier.supplierCIN = req.body.supplierCIN || supplier.supplierCIN
      supplier.supplierUdyogAadhar =
        req.body.supplierUdyogAadhar || supplier.supplierUdyogAadhar
      supplier.supplierGST = req.body.supplierGST || supplier.supplierGST
      supplier.supplierURD = req.body.supplierURD || supplier.supplierURD
      supplier.supplierPAN = req.body.supplierPAN || supplier.supplierPAN
      supplier.supplierBillingAddress =
        req.body.supplierBillingAddress || supplier.supplierBillingAddress
      supplier.supplierShipingAddress =
        req.body.supplierShipingAddress || supplier.supplierShipingAddress

      if (
        supplier.supplierAddress.length === 0 &&
        req.body.supplierAddress === undefined
      ) {
        console.log(
          '3. Inside IF Supplier Shop Address ------------- > ',
          supplierAddress
        )
        supplier.supplierAddress = JSON.parse(JSON.stringify(supplierAddress))
      } else {
        console.log(
          '4. Inside ELSE Supplier Shop Address ------------- > ',
          supplierAddress
        )
        supplier.supplierAddress =
          req.body.supplierAddress || supplier.supplierAddress
      }
      console.log(
        '5. FINAL Shop Address ------------- > ',
        supplier.supplierAddress
      )
      supplier.supplierContactPersonName =
        req.body.supplierContactPersonName || supplier.supplierContactPersonName
      supplier.supplierContactPersonDesignation =
        req.body.supplierContactPersonDesignation ||
        supplier.supplierContactPersonDesignation
      supplier.supplierContactPersonNumber =
        req.body.supplierContactPersonNumber ||
        supplier.supplierContactPersonNumber
      supplier.supplierContactPersonAltNum =
        req.body.supplierContactPersonAltNum ||
        supplier.supplierContactPersonAltNum
      supplier.supplierContactPersonEmail =
        req.body.supplierContactPersonEmail ||
        supplier.supplierContactPersonEmail
      supplier.supplierTelNo = req.body.supplierTelNo || supplier.supplierTelNo
      supplier.supplierWebsite =
        req.body.supplierWebsite || supplier.supplierWebsite
      supplier.supplierAlsoSupplier =
        req.body.supplierAlsoSupplier || supplier.supplierAlsoSupplier
      supplier.supplierVendorCode =
        req.body.supplierVendorCode || supplier.supplierVendorCode

      supplier.supplierBefName =
        req.body.supplierBefName || supplier.supplierBefName
      supplier.supplierBankName =
        req.body.supplierBankName || supplier.supplierBankName
      supplier.supplierAccountNumber =
        req.body.supplierAccountNumber || supplier.supplierAccountNumber
      supplier.supplierAccType =
        req.body.supplierAccType || supplier.supplierAccType
      supplier.supplierBankIFSCCode =
        req.body.supplierBankIFSCCode || supplieromer.supplierBankIFSCCode

      const updatedSupplier = await supplier.save()
      console.log('Updated SUPPLIER RECORD IS ', updatedSupplier)
      res.status(201).json(updatedSupplier)
    } catch (error) {
      console.log('Inside error while creating Supplier Master ==== ', error)
      res.status(400)
      throw new Error('Error in Updating Supplier Master Record')
    }
  } else {
    res.status(400)
    throw new Error('Invalid Supplier Master data')
  }
})

const massSupplierUpload = asyncHandler(async (req, res) => {
  console.log('Inside amsss supplier upload data.....')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS, DELETE, GET')
  res.header('Access-Control-Max-Age', '3600')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
  )
  //next();
  console.log('Inside msss supplier Before executing excel funtion.....')
  xlsxtojson(
    {
      input: '../uploads/supplier.xlsx', // input xls
      output: 'output.json', // output json
      lowerCaseHeaders: true,
    },
    function (err, result) {
      if (err) {
        res.json(err)
      } else {
        res.json(result)
      }
    }
  )
})

export {
  registerSupplier,
  getSupplierProfile,
  findSupplierById,
  getSuppliers,
  getAllSuppliers,
  getAllMasterDataForSupplier,
  updateSupplier,
  getSupplierById,
  massSupplierUpload,
}
