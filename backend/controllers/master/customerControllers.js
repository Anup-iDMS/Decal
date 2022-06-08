import asyncHandler from 'express-async-handler';
import xlsxtojson from "xlsx-to-json";
import xlstojson from "xls-to-json";
import Customer from '../../models/master/customerModel.js';
import { CUSTOMER_MODULE_PREFIX_PREFIX } from '../../config/moduleConstants.js';
import AutoIncrement from './../../models/autoincrement/autoIncrementModel.js';

const massCustomerUpload = asyncHandler(async (req, res) => {
   console.log("Inside amsss customer upload data.....")
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
   res.header("Access-Control-Max-Age", "3600");
   res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
   //next();
   console.log("Inside amsss customer Before executing excel funtion.....")
   xlsxtojson({
      input: "../uploads/customer.xlsx",  // input xls
      output: "output.json", // output json
      lowerCaseHeaders:true
   }, function(err, result) {
      if(err) {
        res.json(err);
      } else {
        res.json(result);
      }
  });
})

// @desc    Register a new CUSTOMER
// @route   POST /api/customers
// @access  Public
const registerCustomer = asyncHandler(async (req, res) => {
  console.log("@@@@@@@@@@@@@@@@@@@@@2 Inside register CUSTOMER.... ")
  const { 
    company, 
    createdBy,
    updatedBy,
    custCode,
    custName,
    custNickName,
    custCompanyType,
    custCIN,
    custUdyogAadhar,
    custGST,
    custURD,
    custPAN,
    custBillingAddress,
    custShipingAddress,
    custContactPersonName,
    custContactPersonDesignation,
    custContactPersonNumber,
    custContactPersonAltNum,
    custContactPersonEmail,
    custTelNo,
    custWebsite,
    custAlsoSupplier,
    custVendorCode
  } = req.body

  console.log("Check whether Customer Exists....", custCode)
  console.log("Check whether Customer Exists....", req.user.company)
  const customerExists = await Customer.findOne({ custCode, company:req.user.company })
  if (customerExists) {
    console.log("Customer Code Alreaady Exists....")
    res.status(400)
    throw new Error('Customer Code already exists')
  }
  console.log(">>>>>>>>>> BEFORE CUSTOMER is --- ")
  try {

    let customerBillAddress = {};
    let customerShipAddress = {};
    let customerAddress = []

    customerBillAddress.addressType = 'Billing';
    customerBillAddress.addressLine1 = custBillingAddress[0].custBillAddressLine1;
    customerBillAddress.addressLine2 = custBillingAddress[0].custBillAddressLine2;
    customerBillAddress.addressLine3 = custBillingAddress[0].custBillAddressLine3;
    customerBillAddress.state = custBillingAddress[0].custBillState;
    customerBillAddress.city = custBillingAddress[0].custBillCity;
    customerBillAddress.district = custBillingAddress[0].custBillDistrict;
    customerBillAddress.pinCode = custBillingAddress[0].custBillPinCode;
    customerAddress.push(customerBillAddress);
    
    customerShipAddress.addressType = 'Shipping';
    customerShipAddress.addressLine1 = custShipingAddress[0].custShipAddressLine1;
    customerShipAddress.addressLine2 = custShipingAddress[0].custShipAddressLine2;
    customerShipAddress.addressLine3 = custShipingAddress[0].custShipAddressLine3;
    customerShipAddress.state = custShipingAddress[0].custShipState;
    customerShipAddress.city = custShipingAddress[0].custShipCity;
    customerShipAddress.district = custShipingAddress[0].custShipDistrict;
    customerShipAddress.pinCode = custShipingAddress[0].custShipPinCode;
    customerAddress.push(customerShipAddress);

    if(req.body.customerAddress === undefined) {
      console.log("3. Inside IF Customer Shop Address ------------- > ", customerAddress)
      customerAddress = JSON.parse(JSON.stringify(customerAddress));
    } else {
      console.log("4. Inside ELSE Customer Shop Address ------------- > ", customerAddress)
      customerAddress = req.body.customerAddress
    }

    const customer = await Customer.create({
      company: req.user.company,
		  createdBy: req.user._id,
		  updatedBy: req.user._id,
      custCode,
      custName,
      custNickName,
      custCompanyType,
      custCIN,
      custUdyogAadhar,
      custGST,
      custURD,
      custPAN,
      custBillingAddress,
      custShipingAddress,
      custContactPersonName,
      custContactPersonDesignation,
      custContactPersonNumber,
      custContactPersonAltNum,
      custContactPersonEmail,
      custTelNo,
      custWebsite,
      custAlsoSupplier,
      custVendorCode,
      customerAddress
    })
    console.log(">>>>>>>>>> CUSTOMER is --- ", customer)
    if (customer) {
      const aiv = await AutoIncrement.setNextId(CUSTOMER_MODULE_PREFIX_PREFIX)
      res.status(201).json({customer})
    } else {
      res.status(400)
      throw new Error('Invalid Customer data')
    }
  } catch (error) {
    console.log(">>>>>>>>>> CUSTOMER Creating ERROR --- ", error)
    res.status(400)
    throw new Error('Invalid Customer data')
  }
})

// @desc    Get customer profile
// @route   GET /api/customers/profile
// @access  Private
const getCustomerProfile = asyncHandler(async (req, res) => {
  console.log("Inside get CUSTOMER profile....", req.params)
  console.log("Inside get CUSTOMER profile....", req.params.id)
  const customer = await Customer.findById(req.params.id).populate('company')

  if (customer) {
    console.log("--- printing customer ==== ", customer)
    res.json({
      customer
    })
  } else {
    res.status(404)
    throw new Error('Customer not found')
  }
})

// @desc    Get customer by ID
// @route   GET /api/customers/:id
// @access  Private
const getCustomerById = asyncHandler(async (req, res) => {
  console.log("Inside getCustomerById....", req.params)
  const customer = await Customer.findById(req.params.id).populate('company')

  if (customer) {
    res.json(customer)
  } else {
    res.status(404)
    throw new Error('customer not found')
  }
})

// @desc    Get customer by ID
// @route   GET /api/customers/:id
// @access  Private
const findCustomerById = asyncHandler(async (id) => {
  const customer = await Customer.findById(id)
  return customer;
})

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private/Admin
const getCustomers = asyncHandler(async (req, res) => {
  //console.log("1. Inside route to get all users..... ", req.user.company)
  const pageSize = 1000
  
  const page = Number(req.query.pageNumber) || 1

  const count = await Customer.countDocuments({company:  req.user.company})

  //console.log("2. Total Number of Records found ..... ", count)

  const customers = await Customer.find({ company:req.user.company }).limit(pageSize)
  .skip(pageSize * (page - 1))

  //console.log("3. Customer Records are ..... ", customers)

  res.json({ customers, page, pages: Math.ceil(count / pageSize) })
  
})

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private/Admin
const getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({}).sort({ "custCode": 1 });
  //console.log("Inside customer controller ", customers)
  return  customers;
})

const getAllMasterDataForCustomer = asyncHandler(async (req, res) => {
  let autoIncrementedCustomerNo = "";

  const autoIncrementedNo = await AutoIncrement.getNextId(CUSTOMER_MODULE_PREFIX_PREFIX)
  console.log("Customer Number got is ", autoIncrementedNo)
	if(autoIncrementedNo < 10) {
      autoIncrementedCustomerNo = "C000"+autoIncrementedNo;
   } else if(autoIncrementedNo < 100) {
      autoIncrementedCustomerNo = "C00"+autoIncrementedNo;
   } else if(autoIncrementedNo < 1000) {
      autoIncrementedCustomerNo = "C0"+autoIncrementedNo;
   } else {
      autoIncrementedCustomerNo = "C"+autoIncrementedNo;
   }
	res.json({ autoIncrementedCustomerNo })
})

// @desc    Update Customer Record
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = asyncHandler(async (req, res) => {
  console.log("---------------start job card update --------------------")
  console.log("Inside UPDATE Customer and ID is ", req.params.id)
  const customer = await Customer.findById(req.params.id)
  if (customer) {
    let customerBillAddress = {};
    let customerShipAddress = {};
    let customerAddress = []

    customerBillAddress.addressType = 'Billing';
    customerBillAddress.addressLine1 = customer.custBillingAddress[0].custBillAddressLine1;
    customerBillAddress.addressLine2 = customer.custBillingAddress[0].custBillAddressLine2;
    customerBillAddress.addressLine3 = customer.custBillingAddress[0].custBillAddressLine3;
    customerBillAddress.state = customer.custBillingAddress[0].custBillState;
    customerBillAddress.city = customer.custBillingAddress[0].custBillCity;
    customerBillAddress.district = customer.custBillingAddress[0].custBillDistrict;
    customerBillAddress.pinCode = customer.custBillingAddress[0].custBillPinCode;
    customerAddress.push(customerBillAddress);
    
    customerShipAddress.addressType = 'Shipping';
    customerShipAddress.addressLine1 = customer.custShipingAddress[0].custShipAddressLine1;
    customerShipAddress.addressLine2 = customer.custShipingAddress[0].custShipAddressLine2;
    customerShipAddress.addressLine3 = customer.custShipingAddress[0].custShipAddressLine3;
    customerShipAddress.state = customer.custShipingAddress[0].custShipState;
    customerShipAddress.city = customer.custShipingAddress[0].custShipCity;
    customerShipAddress.district = customer.custShipingAddress[0].custShipDistrict;
    customerShipAddress.pinCode = customer.custShipingAddress[0].custShipPinCode;
    customerAddress.push(customerShipAddress);

    try {
      console.log("1 Customer Address ------------- > ", customer.customerAddress.length)
      console.log("2. Customer req.body.customerAddress ------------- > ", req.body.customerAddress)
      customer.updatedBy = req.user._id;
      customer.company = customer.company;
      customer.custCode = req.body.custCode  || customer.custCode ;
      customer.custName = req.body.custName  || customer.custName ;
      customer.custNickName = req.body.custNickName  || customer.custNickName ;
      customer.custCompanyType = req.body.custCompanyType  || customer.custCompanyType ;
      customer.custCIN = req.body.custCIN  || customer.custCIN ;
      customer.custUdyogAadhar = req.body.custUdyogAadhar  || customer.custUdyogAadhar ;
      customer.custGST = req.body.custGST  || customer.custGST ;
      customer.custURD = req.body.custURD  || customer.custURD ;
      customer.custPAN = req.body.custPAN  || customer.custPAN ;
      customer.custBillingAddress = req.body.custBillingAddress  || customer.custBillingAddress ;
      customer.custShipingAddress = req.body.custShipingAddress  || customer.custShipingAddress ;
      
      if(customer.customerAddress.length === 0 && req.body.customerAddress === undefined) {
        console.log("3. Inside IF Customer Shop Address ------------- > ", customerAddress)
        customer.customerAddress = JSON.parse(JSON.stringify(customerAddress));
      } else {
        console.log("4. Inside ELSE Customer Shop Address ------------- > ", customerAddress)
        customer.customerAddress = req.body.customerAddress  || customer.customerAddress;
      }
      console.log("5. FINAL Shop Address ------------- > ", customer.customerAddress)
      customer.custContactPersonName = req.body.custContactPersonName  || customer.custContactPersonName ;
      customer.custContactPersonDesignation = req.body.custContactPersonDesignation  || customer.custContactPersonDesignation ;
      customer.custContactPersonNumber = req.body.custContactPersonNumber  || customer.custContactPersonNumber ;
      customer.custContactPersonAltNum = req.body.custContactPersonAltNum  || customer.custContactPersonAltNum ;
      customer.custContactPersonEmail = req.body.custContactPersonEmail  || customer.custContactPersonEmail ;
      customer.custTelNo = req.body.custTelNo  || customer.custTelNo ;
      customer.custWebsite = req.body.custWebsite  || customer.custWebsite ;
      customer.custAlsoSupplier = req.body.custAlsoSupplier  || customer.custAlsoSupplier;
      customer.custVendorCode = req.body.custVendorCode  || customer.custVendorCode;

      customer.custBefName = req.body.custBefName  || customer.custBefName;
      customer.custBankName = req.body.custBankName  || customer.custBankName;
      customer.custAccountNumber = req.body.custAccountNumber  || customer.custAccountNumber;
      customer.custAccType = req.body.custAccType  || customer.custAccType;
      customer.custBankIFSCCode = req.body.custBankIFSCCode  || customer.custBankIFSCCode;

      const updatedCustomer = await customer.save()
			console.log("Updated CUSTOMER RECORD IS ", updatedCustomer)
      res.status(201).json(updatedCustomer)

    } catch (error) {
			console.log("Inside error while creating Customer Master ==== ", error)
			res.status(400)
			throw new Error('Error in Updating Customer Master Record')
		}
  } else {
		res.status(400)
		throw new Error('Invalid Customer Master data')
	}
})

export {
   massCustomerUpload,
   registerCustomer,
   getCustomerProfile,
   getCustomerById,
   getCustomers,
   getAllCustomers,
   getAllMasterDataForCustomer,
   updateCustomer,
   findCustomerById
}