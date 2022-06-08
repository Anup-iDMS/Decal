import asyncHandler from 'express-async-handler';
import Company from '../../models/master/companyModel.js';
import User from '../../models/master/userModel.js';
import generateToken from '../../utils/generateToken.js';

// @desc    Register a new company
// @route   POST /api/admin/company
// @access  Public
const registerCompany = asyncHandler(async (req, res) => {
  //console.log("Inside register COMPANY....")
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
  //console.log("Company createdd ..... ", company)
  if (company) {
    res.status(201).json({
      _id: company._id,
      name: company.name,
      address: company.address,
      pinCode: company.pinCode,
      isCompanyActive: company.isCompanyActive
      //token: generateToken(company._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid company data')
  }
})

// @desc    Get super admin dashboard
// @route   GET /api/admin/dashboard
// @access  Private
const getAdminDashboard = asyncHandler(async (req, res) => {

})

// @desc    Get all companies list
// @route   GET /api/admin/companies
// @access  Private
const getAllCompaniesList = asyncHandler(async (req, res) => {
  //console.log("Inside function to get all companies ========== ")
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const count = await Company.countDocuments({})

  const companies = await Company.find({}).populate('user').limit(pageSize)
  .skip(pageSize * (page - 1))
  //console.log("Prinitng companies ===== ", companies)
  res.json({ companies, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private
const getAllUsersList = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const count = await User.countDocuments({})

  const users = await User.find({}).populate('company').limit(pageSize)
  .skip(pageSize * (page - 1)).sort('company')

  res.json({ users, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get all users list
// @route   PUT /api/admin/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isActive = req.body.active || user.isActive
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isSuperAdmin: updatedUser.isSuperAdmin,
      isActive: updatedUser.isActive
      //token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get all users list
// @route   DELETE /api/admin/users/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
  //console.log("Inside DELETE LEAD controller and ID is ", req.params.id)
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get all users list
// @route   PUT /api/admin/companies/:id
// @access  Private
const updateCompany = asyncHandler(async (req, res) => {
  //console.log("==== inside update company ===== and id is ", req.params.id)
  const company = await Company.findById(req.params.id)
  //console.log("==== FOUND THE company ===== and id is ",req.body.isCompanyActive)
  if (company) {
    if(req.body.isCompanyActive === "Active") {
      //console.log("INSIDE ACTIVE")
      company.isCompanyActive = true
    } else {
      //console.log("**** inside inactive")
      company.isCompanyActive = false
    }
    company.name = req.body.name || company.name
    company.address = req.body.address || company.address
    //company.isCompanyActive = req.body.isCompanyActive === "Active"?true:false || company.isCompanyActive
    //console.log("In controller active and inactivve === ", company.isCompanyActive)
    company.pinCode = req.body.pinCode || company.pinCode
    
    const updatedCompany = await company.save()
    //console.log("==== inside update company ===== and id is ", updatedCompany)
    res.json({
      _id: updatedCompany._id,
      name: updatedCompany.name,
      address: updatedCompany.address,
      isCompanyActive: updatedCompany.isCompanyActive
      //token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('Company not found')
  }

})

// @desc    Get all users list
// @route   DELETE /api/admin/companies/:id
// @access  Private
const deleteCompany = asyncHandler(async (req, res) => {
  //console.log("Inside DELETE LEAD controller and ID is ", req.params.id)
  const company = await Company.findById(req.params.id)

  if (company) {
    await company.remove()
    res.json({ message: 'Company removed' })
  } else {
    res.status(404)
    throw new Error('Company not found')
  }
})

// @desc    Register a new user
// @route   POST /api/admin/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  console.log("Inside register user....")
  const { name, email, password, company, isAdmin, isSuperAdmin } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
    company,
    isAdmin,
    isSuperAdmin
  })
  console.log("User is --- ", user)
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      company: user.company,
      isSuperAdmin: user.isSuperAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Get Lead by ID
// @route   GET /api/admin/users/:id
// @access  Private

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }

})

// @desc    Get company by ID
// @route   GET /api/admin/companies/:id
// @access  Private

const getCompanyById = asyncHandler(async (req, res) => {
  //console.log(">>>>> Inside get COMPANY By Id")
  const company = await Company.findById(req.params.id)
  if (company) {
      //console.log("company is .... ", company)
      res.json(company)
  } else {
      res.status(404)
      throw new Error('Record Not Found')
  }
})

export {
    registerCompany,
    getAdminDashboard,
    getAllUsersList,
    getAllCompaniesList,
    updateCompany,
    updateUser,
    registerUser,
    getUserById,
    deleteUser,
    deleteCompany,
    getCompanyById
}