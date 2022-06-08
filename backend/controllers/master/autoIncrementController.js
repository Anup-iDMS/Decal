import asyncHandler from 'express-async-handler';
import AutoIncrement from './../../models/autoincrement/autoIncrementModel.js';

// @desc    Create new AutoIncrement Record
// @route   POST /api/autoIncrement
// @access  Private

const createAutoIncrement = asyncHandler(async (req, res) => {
	//console.log("Inside create AutoIncrement function.....", )
	const {
		module,
      moduleName,
      autoIncrementValue
	} = req.body;
	
	const autoIncrement = new AutoIncrement({
		module,
      moduleName,
		autoIncrementValue
	});
	console.log(":::::::: BEFORE creating AutoIncrement REcord is >>>>>> ", autoIncrement);
	try {
		const createAutoIncrement = await autoIncrement.save();
		console.log("Created REcord is >>>>>> ", createAutoIncrement);
		if (createAutoIncrement) {
         res.status(201).json(createAutoIncrement)
      } else {
         res.status(400)
         throw new Error('Invalid JC data')
      }
		//res.status(201).json(createAutoIncrement);
    } catch (error) {
		console.log("Inside error while creating error ==== ", error)
		res.status(400)
		throw new Error('Invalid AutoIncrement data')
    }
});

// @desc    Get AutoIncrement Record by ID
// @route   GET /api/autoIncrement/:id
// @access  Private

const getAutoIncrementById = asyncHandler(async (req, res) => {
   console.log(">>>>> Inside get AutoIncrement By Id")
   const autoIncrement = await AutoIncrement.findById(req.params.id).populate('user','name email').populate('company').exec()
   if (autoIncrement) {
       console.log("AutoIncrement Record is .... ", autoIncrement)
       res.json(autoIncrement)
   } else {
       res.status(404)
       throw new Error('Record Not Found')
   }
})

// @desc    Update AutoIncrement Record
// @route   PUT /api/modules/:id
// @access  Private
const updateAutoIncrement = asyncHandler(async (req, res) => {
	console.log("Inside UPDATE AutoIncrement and ID is ", req.params.id)
	const autoIncrement = await AutoIncrement.findById(req.params.id)
	if (autoIncrement) {
		try {
			
			autoIncrement.module = req.body.module || module.module
			autoIncrement.moduleName = req.body.moduleName || module.moduleName
			autoIncrement.autoIncrementValue = req.body.autoIncrementValue || module.autoIncrementValue
			//module.leadName = 
			
			const updatedAutoIncrement = await autoIncrement.save()
			console.log("Updated MODULE RECORD IS ", updatedAutoIncrement)
			res.status(201).json(updatedAutoIncrement)
		} catch (error) {
			console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating AutoIncrement Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid AutoIncrement data')
	}
});

// @desc    Delete a AutoIncrement Record
// @route   DELETE /api/modules/:id
// @access  Private
const deleteAutoIncrement = asyncHandler(async (req, res) => {
   console.log("Inside DELETE AutoIncrement and ID is ", req.params.id)
   const autoIncrement = await AutoIncrement.findById(req.params.id)
 
   if (autoIncrement) {
     await autoIncrement.remove()
     res.json({ message: 'AutoIncrement removed' })
   } else {
     res.status(404)
     throw new Error('AutoIncrement not found')
   }
})

// @desc    Get all AutoIncrement Records
// @route   GET /api/modules/all
// @access  Private
const getAllAutoIncrements = asyncHandler(async (req, res) => {
   console.log(">>>>> Inside getAllAutoIncrements WITH PAGINATION--- === ", req.user._id)
   const pageSize = Number(req.query.pageSize) || 10
   const page = Number(req.query.pageNumber) || 1

   const count = await AutoIncrement.countDocuments()
   console.log("Total records count are ==== ", count)

   const autoIncrements = await AutoIncrement.find().sort({moduleName:1})
   .skip(pageSize * (page - 1))
   //console.log("Total Leads are ==== ", leads.length)
   //console.log("Page Number is ==== ", page)
   //console.log("Total pages are ==== ", Math.ceil(count / pageSize))
   //console.log(autoIncrements)
   res.json({ autoIncrements, page, pages: Math.ceil(count / pageSize) })
   //res.json(leads)
})

export {
   createAutoIncrement,
   getAutoIncrementById,
   updateAutoIncrement,
   deleteAutoIncrement,
   getAllAutoIncrements
}