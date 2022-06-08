import { 
   ProductCategory,
   ProductCode,
   UOM,
   MachineMaster 
} from "../../models/master/appDataModel.js";

import asyncHandler from 'express-async-handler';

import { MACHINE_MASTER_MODULE_PREFIX } from "../../config/moduleConstants.js";

import AutoIncrement from '../../models/autoincrement/autoIncrementModel.js';

import { getHSNs } from './hsnController.js';

/** 1. Product Category Functions */

// @desc    1.1 Register a new Prod Category
// @route   POST /api/appdata/prodcat
// @access  Public
const createProdCategory = asyncHandler(async (req, res) => {

  const { company, user, name } = req.body
  
    const prodCatExists = await ProductCategory.findOne({ name })
  
    if (prodCatExists) {
      res.status(400)
      throw new Error('ProductCategory already exists')
    }
  
    const prodcat = await ProductCategory.create({
        company: req.user.company,
		    user: req.user._id,
        name
    })
    
    if (prodcat) {
      res.status(201).json(prodcat)
    } else {
      res.status(400)
      throw new Error('Invalid ProductCategory data')
    }
})

// @desc    Get 1.2 Product Category Record by ID
// @route   GET /api/appdata/prodcat/:id
// @access  Private

const getProdCategoryById = asyncHandler(async (req, res) => {
  const prodcat = await ProductCategory.findById(req.params.id)
                                
  if (prodcat) {
      res.json(prodcat)
  } else {
      res.status(404)
      throw new Error('Record Not Found')
  }
})

// @desc    1.3 Update Product Category Record
// @route   PUT /api/appdata/prodcat/:id
// @access  Private
const updateProdCategory = asyncHandler(async (req, res) => {
	const prodCategory = await ProductCategory.findById(req.params.id)
	if (prodCategory) {
		try {
			
      prodCategory.name = req.body.name || prodCategory.name;
      prodCategory.isActive = req.body.isActive;
      
      const updatedProdCategory = await prodCategory.save()
			res.status(201).json(updatedProdCategory)
		} catch (error) {
			console.log("Inside error while updating prod category ==== ", error)
			res.status(400)
			throw new Error('Error in Updating ProdCategory Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid ProdCategory data')
	}
});

// @desc    1.4 Delete a Product Category Record
// @route   DELETE /api/appdata/prodcat/:id
// @access  Private
const deleteProdCategory = asyncHandler(async (req, res) => {
  console.log("Inside DELETE ProdCategory and ID is ", req.params.id)
  const prodCategory = await ProductCategory.findById(req.params.id)

  if (prodCategory) {
    await prodCategory.remove()
    res.json({ message: 'ProdCategory removed' })
  } else {
    res.status(404)
    throw new Error('ProdCategory not found')
  }
})

// @desc    1.5 Get all Product Category records
// @route   GET /api/appdata/prodcat/
// @access  Private
const getProdCats = asyncHandler(async (req, res) => {
	const prodCats = await ProductCategory.find();
  return res.json(prodCats);
})

// @desc    1.6 Get all Product Categories
// @route   none: internal method used by JC Master Controller
// @access  Private
const getAllProductCategories = asyncHandler(async (req, res) => {
  
	const prodCategories = await ProductCategory.find({"isActive":true})
	return prodCategories;
})


/** 2. Product Code Routes */

// @desc    2.1 Register a new Prod Code
// @route   POST /api/appdata/prodcode
// @access  Public
const createProdCode = asyncHandler(async (req, res) => {
    const { company, user, name, hsn } = req.body
    const prodCodeExists = await ProductCode.findOne({ name })
  
    if (prodCodeExists) {
      res.status(400)
      throw new Error('ProductCode already exists')
    }
  
    const prodcode = await ProductCode.create({
      company: req.user.company,
      user: req.user._id,
      name,
      hsn
    })
    if (prodcode) {
      res.status(201).json(prodcode)
    } else {
      res.status(400)
      throw new Error('Invalid ProductCode data')
    }
})

// @desc    Get 2.2 Product Code Record by ID
// @route   GET /api/appdata/prodcode/:id
// @access  Private

const getProdCodeById = asyncHandler(async (req, res) => {
  const prodcode = await ProductCode.findById(req.params.id)
  console.log("inside get product code by id ", prodcode)                              
  if (prodcode) {
      res.json(prodcode)
  } else {
      res.status(404)
      throw new Error('Record Not Found')
  }
})

// @desc    2.3 Update Product Code Record
// @route   PUT /api/appdata/prodcode/:id
// @access  Private
const updateProdCode = asyncHandler(async (req, res) => {
	const prodCode = await ProductCode.findById(req.params.id)
	if (prodCode) {
		try {
			console.log("req.body.name == ", req.body.name)
			console.log("req.body.hsn == ", req.body.hsn)
			console.log("req.body.isActive == ", req.body.isActive)
      prodCode.name = req.body.name || prodCode.name;
      prodCode.hsn = req.body.hsn || prodCode.hsn;
      prodCode.isActive = req.body.isActive;
      console.log("Product Code === ", prodCode)
      const updatedProdCode = await prodCode.save()
      console.log("updatedProdCode ==== ", updatedProdCode)
			res.status(201).json(updatedProdCode)
		} catch (error) {
			console.log("Inside error while updating prod category ==== ", error)
			res.status(400)
			throw new Error('Error in Updating ProdCode Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid ProdCode data')
	}
});

// @desc    2.4 Delete a Product Code Record
// @route   DELETE /api/appdata/prodcode/:id
// @access  Private
const deleteProdCode = asyncHandler(async (req, res) => {
  console.log("Inside DELETE ProdCode and ID is ", req.params.id)
  const prodCode = await ProductCode.findById(req.params.id)

  if (prodCode) {
    await prodCode.remove()
    res.json({ message: 'ProdCode removed' })
  } else {
    res.status(404)
    throw new Error('ProdCode not found')
  }
})

// @desc    2.5 Get all Product Code records
// @route   GET /api/appdata/prodcode/
// @access  Private
const getProdCodes = asyncHandler(async (req, res) => {
	const prodCodes = await ProductCode.find();
  return res.json(prodCodes);
})

// @desc    2.6 Get all Product Codes
// @route   none: internal method used by JC Master Controller
// @access  Private
const getAllProductCodes = asyncHandler(async (req, res) => {
	const prodCodes = await ProductCode.find({"isActive":true})
	return prodCodes;
})

// @desc    2.7 Get all Master data required to create a Product Code record
// @route   GET /api/appdata/prodcode/masterdata
// @access  Private
const getAllMasterDataForProductCode = asyncHandler(async (req, res) => {
  const hsnCodes = await getHSNs();
  res.json({ hsnCodes });
})


/** 3. UOM Routes */

// @desc    3.1 Register a new UOM
// @route   POST /api/appdata/uom
// @access  Public
const createUOM = asyncHandler(async (req, res) => {
    const { company, user, name } = req.body
  
    const uomExists = await UOM.findOne({ name })
  
    if (uomExists) {
      res.status(400)
      throw new Error('UOM already exists')
    }
  
    const uom = await UOM.create({
      company: req.user.company,
      user: req.user._id,
      name
    })
    if (uom) {
      res.status(201).json(uom)
    } else {
      res.status(400)
      throw new Error('Invalid UOM data')
    }
})

// @desc    Get 3.2 Product Code Record by ID
// @route   GET /api/appdata/prodcode/:id
// @access  Private

const getUOMById = asyncHandler(async (req, res) => {
  const uom = await UOM.findById(req.params.id)
                                
  if (uom) {
      res.json(uom)
  } else {
      res.status(404)
      throw new Error('Record Not Found')
  }
})

// @desc    3.3 Update UOM Record
// @route   PUT /api/appdata/uom/:id
// @access  Private
const updateUOM = asyncHandler(async (req, res) => {
	const uom = await UOM.findById(req.params.id)
	if (uom) {
		try {
			
      uom.name = req.body.name || uom.name;
      uom.isActive = req.body.isActive;
      
      const updatedUOM = await uom.save()
			res.status(201).json(updatedUOM)
		} catch (error) {
			console.log("Inside error while updating UOM ==== ", error)
			res.status(400)
			throw new Error('Error in Updating UOM Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid UOM data')
	}
});

// @desc    3.4 Delete a UOM Record
// @route   DELETE /api/appdata/uom/:id
// @access  Private
const deleteUOM = asyncHandler(async (req, res) => {
  console.log("Inside DELETE UOM and ID is ", req.params.id)
  const prodCode = await UOM.findById(req.params.id)

  if (prodCode) {
    await prodCode.remove()
    res.json({ message: 'UOM removed' })
  } else {
    res.status(404)
    throw new Error('UOM not found')
  }
})

// @desc    3.5 Get all UOM records
// @route   GET /api/appdata/uom/
// @access  Private
const getUOMs = asyncHandler(async (req, res) => {
	const uoms = await UOM.find();
  return res.json(uoms);
})

// @desc    3.6 Get all UOMs
// @route   none: internal method used by JC Master Controller
// @access  Private
const getAllUOMs = asyncHandler(async (req, res) => {
	const uoms = await UOM.find({"isActive":true})
  return uoms;
})

/** 4. Machine Master Routes */

// @desc    4.1 Register a new Machine Master
// @route   POST /api/appdata/machinemaster
// @access  Public
const createMachineMaster = asyncHandler(async (req, res) => {
    const {
      company,
      name,
      isActive,
      modelNo,
      serialNo,
      purchaseDate,
    } = req.body
  
    const machineMasterExists = await MachineMaster.findOne({ name })
  
    if (machineMasterExists) {
      res.status(400)
      throw new Error('MachineMaster already exists')
    }

    let autoIncrementedMachineMasterNo = "";
    const autoIncrementedNo = await AutoIncrement.getNextId(MACHINE_MASTER_MODULE_PREFIX)

    if(autoIncrementedNo < 10) {
        autoIncrementedMachineMasterNo = "M000"+autoIncrementedNo;
    } else if(autoIncrementedNo < 100) {
        autoIncrementedMachineMasterNo = "M00"+autoIncrementedNo;
    } else if(autoIncrementedNo < 1000) {
        autoIncrementedMachineMasterNo = "M0"+autoIncrementedNo;
    } else {
        autoIncrementedMachineMasterNo = "M"+autoIncrementedNo;
    }

    const machineMaster = await MachineMaster.create({
      company: req.user.company,
		  createdBy: req.user._id,
		  updatedBy: req.user._id,
      machineCode: autoIncrementedMachineMasterNo,
      name,
      isActive,
      modelNo,
      serialNo,
      purchaseDate,
    })
    if (machineMaster) {
      const aiv = await AutoIncrement.setNextId(MACHINE_MASTER_MODULE_PREFIX)
      res.status(201).json(machineMaster)
    } else {
      res.status(400)
      throw new Error('Invalid MachineMaster data')
    }
})

// @desc    Get 4.2 MachineMaster Record by ID
// @route   GET /api/appdata/machinemaster/:id
// @access  Private

const getMachineMasterById = asyncHandler(async (req, res) => {
  const machineMaster = await MachineMaster.findById(req.params.id)
                                
  if (machineMaster) {
      res.json(machineMaster)
  } else {
      res.status(404)
      throw new Error('Record Not Found')
  }
})

// @desc    4.3 Update Machine Master Record
// @route   PUT /api/appdata/machinemaster/:id
// @access  Private
const updateMachineMaster = asyncHandler(async (req, res) => {
	console.log("Inside UPDATE MachineMaster and ID is ", req.params.id)
	const machineMaster = await MachineMaster.findById(req.params.id)
	if (machineMaster) {
		try {
			
			machineMaster.updatedBy = req.user._id;
      machineMaster.machineCode = req.body.machineCode || machineMaster.machineCode;
      machineMaster.name = req.body.name || machineMaster.name;
      machineMaster.isActive = req.body.isActive || machineMaster.isActive;
      machineMaster.modelNo = req.body.modelNo || machineMaster.modelNo;
      machineMaster.serialNo = req.body.serialNo || machineMaster.serialNo;
      machineMaster.purchaseDate = req.body.purchaseDate || machineMaster.purchaseDate;

      const updatedMachineMaster = await machineMaster.save()
			console.log("Updated JOBCARD RECORD IS ", updatedMachineMaster)
			res.status(201).json(updatedMachineMaster)
		} catch (error) {
			console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating MachineMaster Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid MachineMaster data')
	}
});

// @desc    4.4 Delete a MachineMaster Record
// @route   DELETE /api/appdata/machinemaster/:id
// @access  Private
const deleteMachineMaster = asyncHandler(async (req, res) => {
  console.log("Inside DELETE MachineMaster and ID is ", req.params.id)
  const machineMaster = await MachineMaster.findById(req.params.id)

  if (machineMaster) {
    await machineMaster.remove()
    res.json({ message: 'MachineMaster removed' })
  } else {
    res.status(404)
    throw new Error('MachineMaster not found')
  }
})

// @desc    4.5 Get all machine master records
// @route   GET /api/appdata/machinemaster/
// @access  Private
const getMachineMasters = asyncHandler(async (req, res) => {
	const machineMasters = await MachineMaster.find();
  return res.json(machineMasters);
})

// @desc    4.6 Get all Product Codes
// @route   none: internal method used by JC Master Controller
// @access  Private
const getAllMachineMasters = asyncHandler(async (req, res) => {
	const machineMasters = await MachineMaster.find();
  return machineMasters;
})

export {
  createProdCategory,
  getProdCategoryById,
  updateProdCategory,
  deleteProdCategory,
  getProdCats,
  getAllProductCategories,
  
  createProdCode,
  getProdCodeById,
  updateProdCode,
  deleteProdCode,
  getProdCodes,
  getAllProductCodes,
  getAllMasterDataForProductCode,

  createUOM,
  getUOMById,
  updateUOM,
  deleteUOM,
  getUOMs,
  getAllUOMs,

  createMachineMaster,
  getMachineMasterById,
  deleteMachineMaster,
  updateMachineMaster,
  getAllMachineMasters,
  getMachineMasters,
}