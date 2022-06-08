import asyncHandler from 'express-async-handler';
import Company from '../../models/master/companyModel.js';
import generateToken from '../../utils/generateToken.js';

// @desc    Register a new company
// @route   POST /api/company
// @access  Public
const registerCompany = asyncHandler(async (req, res) => {
  console.log("Inside register COMPANY....")
  const { name, address, pinCode } = req.body

  const companyExists = await Company.findOne({ name })

  if (companyExists) {
    res.status(400)
    throw new Error('Company already exists')
  }

  const company = await Company.create({
    name,
    address,
    pinCode,
  })

  if (company) {
    res.status(201).json({
      _id: company._id,
      name: company.name,
      address: company.address,
      pinCode: company.pinCode,
      token: generateToken(company._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid company data')
  }
})

// @desc    Get Company Record by ID
// @route   GET /api/company/:id
// @access  Private

const getCompanyById = asyncHandler(async (req, res) => {
  console.log(">>>>> Inside get Company By Id")
  const company = await Company.findById(req.params.id).exec()
  if (company) {
      console.log("Company Record is .... ", company)
      res.json(company)
  } else {
      res.status(404)
      throw new Error('Record Not Found')
  }
})

// @desc    Update Company Record
// @route   PUT /api/company/:id
// @access  Private
const updateCompany = asyncHandler(async (req, res) => {
	console.log("Inside UPDATE Company and ID is ", req.params.id)
	console.log("req.user ", req.user._id)
  const company = await Company.findById(req.params.id)
	if (company) {
		try {
			
			company.updatedBy = req.user._id;
			company.name = req.body.name || company.name
			company.address = req.body.address || company.address
			company.pinCode = req.body.pinCode || company.pinCode
			company.logo = req.body.logo || company.logo
			company.contactNumber = req.body.contactNumber || company.contactNumber
			company.alternateContactNumber = req.body.alternateContactNumber || company.alternateContactNumber
			company.website = req.body.website || company.website
			company.contactPerson = req.body.contactPerson || company.contactPerson
      company.companyAddress = req.body.companyAddress  || company.companyAddress ;
      //company.factoryAddress = req.body.factoryAddress  || company.factoryAddress ;
			
			const updatedCompany = await company.save()
			console.log("Updated Company RECORD IS ", updatedCompany)
			res.status(201).json(updatedCompany)
		} catch (error) {
			console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating Company Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid Company data')
	}
});

// @desc    Delete a Company Record
// @route   DELETE /api/company/:id
// @access  Private
const deleteCompany = asyncHandler(async (req, res) => {
  console.log("Inside DELETE Company and ID is ", req.params.id)
  const company = await Company.findById(req.params.id)

  if (company) {
    await company.remove()
    res.json({ message: 'Company removed' })
  } else {
    res.status(404)
    throw new Error('Company not found')
  }
})

// @desc    Get all Company Records
// @route   GET /api/company/all
// @access  Private
const getAllCompany = asyncHandler(async (req, res) => {
  //console.log(">>>>> Inside getAllCompany WITH PAGINATION--- === ", req.user._id)
  const pageSize = Number(req.query.pageSize) || 10
  const page = Number(req.query.pageNumber) || 1

  const count = await Company.countDocuments()
  //console.log("Total records count are ==== ", count)

  const company = await Company.find().limit(pageSize).skip(pageSize * (page - 1))
  //console.log("Total company ==== ", company)
  //console.log("Page Number is ==== ", page)
  //console.log("Total pages are ==== ", Math.ceil(count / pageSize))
  //console.log(company)
  res.json({ company, page, pages: Math.ceil(count / pageSize) })
})

export {
    registerCompany,
    getCompanyById,
    updateCompany,
    deleteCompany,
    getAllCompany
}