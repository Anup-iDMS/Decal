import asyncHandler from 'express-async-handler';
import User from '../../models/master/userModel.js';
import Role from '../../models/master/roleModel.js';
import generateToken from '../../utils/generateToken.js';
import RoleMenuItem from '../../models/master/roleMenuItem.js';
import { USER_MODULE_PREFIX } from '../../config/moduleConstants.js';
import AutoIncrement from './../../models/autoincrement/autoIncrementModel.js';
import MenuItem from './../../models/master/menuItem.js';


/** NOTE: START:::: ALL THE BELOW FUNCTIONS ARE USED FOR "USER MANAGEMENT" */

//1. CREATE USER
// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  console.log("Inside register user....", req.body)
  //console.log("Inside req.user.company....", req.user.company)
  const { userCode, name, email, password, company, role } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }
  
  try {
    const user = new User({
      //company: "611b772e503f262dc82270b7",//req.body.company || req.user.company,
      company: req.body.company || req.user.company,
      userCode, 
      name, 
      email, 
      password, 
      role
    });

		const createUser = await user.save();
		//console.log("Created REcord is >>>>>> ", createUser);
		if (createUser) {
         const aiv = await AutoIncrement.setNextId(USER_MODULE_PREFIX)
         res.status(201).json(createUser)
    } else {
         res.status(400)
         throw new Error('Invalid User data')
    }
		//res.status(201).json(createDebitNote);
  } catch (error) {
		console.log("Inside create User while creating error ==== ", error)
		res.status(400)
		throw new Error('Error in creating User')
  }
})


//2. LOGIN/AUTHORIZE USER 

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  //console.log("Inside Auth User ")
  const { email, password } = req.body;

  const user = await User.findOne({ email: email, isActive: true })
    .populate('company')
    .populate('role');
  
  //console.log("Prinitng full user ==== ", user)
  console.log("Prinitng user ==== ", user.company)
  //console.log("Prinitng user ==== ", user.company.isCompanyActive)

  if (user && (await user.matchPassword(password)) && (user.company.isCompanyActive)) {
    //console.log("User found user role id is ==== ", user.role._id)
    const menuItems = await RoleMenuItem.findOne({role: user.role._id})
    //console.log("User role menu items are ==== ", menuItems)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role._id,
      roleName: user.role.role,
      menuItems: menuItems,
      //isAdmin: user.isAdmin,
      //isSuperAdmin: user.isSuperAdmin,
      companyId: user.company._id,
      companyName: user.company.name,
      companyAddress: user.company.companyAddress,
      token: generateToken(user._id),
    });
  } else {
   // console.log("User not found throwing error....")
    res.status(401);
    throw new Error('Invalid email or password')
  }
});

//3. GET USER BY ID
// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
                          .populate('role', 'role')
                          .exec()

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})


//4. GET USER PROFILE

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  //console.log("Inside get user profile....", req.user)
  const user = await User.findById(req.user._id).populate('company')

  if (user) {
    //console.log("--- printing user ==== ", user)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      company: user.company.name,
      companyAddress: user.company.companyAddress,
      company: user.company,
      isSuperAdmin: user.isSuperAdmin
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})


//5. UPDATE USER
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  //console.log("Update User Profile ", req.params.id)
  const user = await User.findById(req.params.id)
  //console.log("Found User Profile ", user)
  //console.log("req.body.isActive ", req.body.isActive)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isActive = req.body.isActive
    user.userCode = user.userCode
    if (req.body.password) {
      user.password = req.body.password
    }
    //console.log("User Before Saving ", user)
    
    const updatedUser = await user.save()
    //console.log("User After Saving ", user)
    res.json(updatedUser);
    // res.json({
    //   _id: updatedUser._id,
    //   name: updatedUser.name,
    //   email: updatedUser.email,
    //   isActive: updatedUser.isActive,
    //   role: updatedUser.role,
    //   // token: generateToken(updatedUser._id),
    // })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})


//6. GET ALL USERS LIST
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  //console.log("Inside route to get all users..... ", req.user)
  const users = await User.find({ company: req.user.company }).sort({ userCode:1 })
  res.json(users)
})

// @desc    Get all users
// @route   GET /api/users/all
// @access  Private/Admin Super Admin
const getAllUsers = asyncHandler(async (req, res) => {
  //console.log("Inside route to get all users..... ", req.user.company)
  const users = await User.find({company: req.user.company})
                          .populate('role', 'role')
                          .sort({ userCode:1 })
                          .exec()
  
  //console.log("users", users);
  res.json(users)
})


// @desc    Get all Required Master Data for DebitNote Screen
// @route   GET /api/users/masterdata
// @access  Private
const getAllMasterDataForUser = asyncHandler(async (req, res) => {
  //console.log("6. Inside getAllMasterDataForUser function ------------>")
  let autoIncrementedUserNo = "";
  const autoIncrementedNo = await AutoIncrement.getNextId(USER_MODULE_PREFIX)
  const roles = await Role.find();

  if(autoIncrementedNo < 10) {
    autoIncrementedUserNo = "U000"+autoIncrementedNo;
  } else if(autoIncrementedNo < 100) {
      autoIncrementedUserNo = "U00"+autoIncrementedNo;
  } else if(autoIncrementedNo < 1000) {
      autoIncrementedUserNo = "U0"+autoIncrementedNo;
  } else {
      autoIncrementedUserNo = "U"+autoIncrementedNo;
  }
    //console.log("2. Inside getAllMasterDataForDebitNote and autoIncrementedDebitNo is ",autoIncrementedDebitNo)
  res.json({ autoIncrementedUserNo, roles })
})

/** NOTE: END:::: ALL THE BELOW FUNCTIONS ARE USED FOR "USER MANAGEMENT" */

/** NOTE: START:::: ALL THE BELOW FUNCTIONS ARE USED FOR "ROLE MANAGEMENT" */
//1. CREATE
// @desc    Create a new Role
// @route   POST /api/users/role
// @access  Public
const createRole = asyncHandler(async (req, res) => {
  const { role } = req.body
  //console.log("Inside register user....", role)

  const roleExists = await Role.findOne({ role })

  if (roleExists) {
    res.status(400)
    throw new Error('Role already exists')
  }

  const roleCreate = await Role.create({
    role
  })
  //console.log(">>>>>>>>>> Role is --- ", roleCreate)
  if (roleCreate) {
    res.status(201).json({
      role: roleCreate,
    })
  } else {
    res.status(400)
    throw new Error('Invalid Role data')
  }
})

//2. READ
// @desc    Get DebitNote Record by ID
// @route   GET /api/role/:id
// @access  Private
const getRoleById = asyncHandler(async (req, res) => {
  console.log("2. Inside getRoleById function ------------>")
  const role = await Role.findById(req.params.id)

  if (role) {
    console.log("2. Inside getRoleById function ------------>", role)
     res.json(role)
  } else {
     res.status(404)
     throw new Error('Record Not Found')
  }
})


//3. UPDATE

// @desc    Update Role Record
// @route   PUT /api/role/:id
// @access  Private
const updateRole = asyncHandler(async (req, res) => {
	console.log("Inside UPDATE Role and ID is ", req.params.id)
	const role = await Role.findById(req.params.id)
	if (role) {
		try {
			
			role.role = req.body.role || role.role;
			//role.leadName = req.body.leadName || role.leadName
			
			const updatedRole = await role.save()
			console.log("Updated MODULE RECORD IS ", updatedRole)
			res.status(201).json(updatedRole)
		} catch (error) {
			console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating Role Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid Role data')
	}
});
//4. DELETE

//4. DELETE

//5. GET ALL ROLES
// @desc    Get all Module Records
// @route   GET /api/role/all
// @access  Private
const getAllRoles = asyncHandler(async (req, res) => {
  console.log(">>>>> Inside getAllRoles WITH PAGINATION--- === ", req.user._id)
  const roles = await Role.find()
  //console.log("Total Leads are ==== ", leads.length)
  //console.log("Page Number is ==== ", page)
  //console.log("Total pages are ==== ", Math.ceil(count / pageSize))
  console.log(roles)
  res.json({ roles })
  //res.json(leads)
})


/** NOTE: END:::: ALL THE BELOW FUNCTIONS ARE USED FOR "ROLE MANAGEMENT */

/** NOTE: START:::: ALL THE BELOW FUNCTIONS ARE USED FOR "MENU MANAGEMENT" */
// @desc    Create new MenuItem Record
// @route   POST /api/menuitems
// @access  Private

const createMenuItem = asyncHandler(async (req, res) => {
	//console.log("Inside create MenuItem function.....", )
	const {
    name,
    link,
    styleclass,
    hasSubMenu,
    subMenuItems
	} = req.body;
	
	const menuItem = new MenuItem({
		name,
    link,
    styleclass,
    hasSubMenu,
    subMenuItems
	});
	console.log(":::::::: BEFORE creating MenuItem REcord is >>>>>> ", menuItem);
	try {
		const createMenuItem = await menuItem.save();
		console.log("Created REcord is >>>>>> ", createMenuItem);
		if (createMenuItem) {
         res.status(201).json(createMenuItem)
      } else {
         res.status(400)
         throw new Error('Invalid JC data')
      }
		//res.status(201).json(createMenuItem);
    } catch (error) {
		console.log("Inside error while creating error ==== ", error)
		res.status(400)
		throw new Error('Invalid MenuItem data')
    }
});

// @desc    Get MenuItem Record by ID
// @route   GET /api/users/menuitems/:id
// @access  Private

const getMenuItemById = asyncHandler(async (req, res) => {
    console.log(">>>>> Inside get MenuItem By Id")
    const menuItem = await MenuItem.findById(req.params.id)

    if (menuItem) {
        console.log("MenuItem Record is .... ", menuItem)
        res.json(menuItem)
    } else {
        res.status(404)
        throw new Error('Record Not Found')
    }
})

// @desc    Update MenuItem Record
// @route   PUT /api/users/menuitems/:id
// @access  Private
const updateMenuItem = asyncHandler(async (req, res) => {
	console.log("Inside UPDATE MenuItem and ID is ", req.params.id)
	const menuItem = await MenuItem.findById(req.params.id)
	if (menuItem) {
		try {
			
			menuItem.name = req.body.name || menuItem.name,
      menuItem.link = req.body.link || menuItem.link,
      menuItem.styleclass = req.body.styleclass || menuItem.styleclass,
      menuItem.hasSubMenu = req.body.hasSubMenu || menuItem.hasSubMenu,
      menuItem.subMenuItems = req.body.subMenuItems || menuItem.subMenuItems
			//menuItem.leadName = req.body.leadName || menuItem.leadName
			
			const updatedMenuItem = await menuItem.save()
			console.log("Updated MODULE RECORD IS ", updatedMenuItem)
			res.status(201).json(updatedMenuItem)
		} catch (error) {
			console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating MenuItem Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid MenuItem data')
	}
});

// @desc    Delete a MenuItem Record
// @route   DELETE /api/users/menuItems/:id
// @access  Private
const deleteMenuItem = asyncHandler(async (req, res) => {
  console.log("Inside DELETE MenuItem and ID is ", req.params.id)
  const menuItem = await MenuItem.findById(req.params.id)

  if (menuItem) {
    await menuItem.remove()
    res.json({ message: 'MenuItem removed' })
  } else {
    res.status(404)
    throw new Error('MenuItem not found')
  }
})

// @desc    Get all MenuItem Records
// @route   GET /api/menuItems/all
// @access  Private
const getAllMenuItems = asyncHandler(async (req, res) => {
    console.log(">>>>> Inside getAllMenuItems WITH PAGINATION--- === ")
    const menuItems = await MenuItem.find()
    //console.log("Total Leads are ==== ", leads.length)
    //console.log("Page Number is ==== ", page)
    //console.log("Total pages are ==== ", Math.ceil(count / pageSize))
	  console.log(menuItems)
    res.json({ menuItems })
    //res.json(leads)
})

// @desc    Get all MenuItem Records
// @route   GET /api/menuitems/submenu/:id
// @access  Private
const getAllSubmenusByMenuId = asyncHandler(async (req, res) => {
  console.log(">>>>> Inside getAllSubmenusByMenuId  ")
  const menuId = req.params.id;
  console.log(">>>>> Inside getAllSubmenusByMenuId and Menu Id ", menuId)
  
  const roleMenuItems = await RoleMenuItem.find({"menuItems._id":menuId})
  console.log("Total Sub Menu Items are ==== ", roleMenuItems.length)
  let menuItems = [];
  for (const rmi of roleMenuItems) {
    //console.log("RMI is ==== ", rmi)
    for (const rmid  of rmi.menuItems) {
      //console.log("RMI ID DETAILS is ==== ", rmid._id)
      //console.log("FmenuId ==== ", menuId)
      if(rmid._id.toString() === menuId) {
        console.log("FOUND MATHCING ==== ", menuId)
        menuItems.push(rmid)
      }
    }
  }
  res.json({ menuItems })
})


// @desc    Get all Required Master Data for DebitNote Screen
// @route   GET /api/users/menuitems/masterdata
// @access  Private
const getAllMasterDataForMenu = asyncHandler(async (req, res) => {
  //console.log("6. Inside getAllMasterDataForUser function ------------>")
  const roles = await Role.find();
  const menuItems = await MenuItem.find();

    //console.log("2. Inside getAllMasterDataForDebitNote and autoIncrementedDebitNo is ",autoIncrementedDebitNo)
  res.json({ menuItems, roles })
})

/** NOTE: END:::: ALL THE BELOW FUNCTIONS ARE USED FOR "MENU MANAGEMENT" */


/** NOTE: START:::: ALL THE BELOW FUNCTIONS ARE USED FOR "ROLE MENU MANAGEMENT" */

//1. CREATE
// @desc    Create a new Role
// @route   POST /api/users/rolemenuitem
// @access  Public
const createRoleMenuItem = asyncHandler(async (req, res) => {
  const { role, menuItems } = req.body
  //console.log("Inside createRoleMenuItem....", role)
  //console.log("Inside createRoleMenuItem and menuItems....", menuItems)
  //console.log("Inside createRoleMenuItem and subMenuItems >>>> ....", subMenuItems)

  const roleMenuExists = await RoleMenuItem.findOne({ role })

  if (roleMenuExists) {
    await roleMenuExists.remove()
    //res.status(400)
    //throw new Error('RoleMenuItem already exists')
  }

  const roleMenuCreate = await RoleMenuItem.create({
    role, menuItems
  })
  //console.log(">>>>>>>>>> Role MENU ITEMS is --- ", roleMenuCreate)
  if (roleMenuCreate) {
    res.status(201).json({
      roleMenuCreate,
    })
  } else {
    //console.log("ERROR  in CREATING RECORD....")
    res.status(400)
    throw new Error('Invalid Role Menu data')
  }
})


/** NOTE: END:::: ALL THE BELOW FUNCTIONS ARE USED FOR "ROLE MENU MANAGEMENT" */


export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  getAllUsers,
  getAllMasterDataForUser,

  createRole,
  getRoleById,
  updateRole,
  getAllRoles,

  //menu item
  createMenuItem,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  getAllMasterDataForMenu,
  getAllSubmenusByMenuId,
 
  createRoleMenuItem,
}