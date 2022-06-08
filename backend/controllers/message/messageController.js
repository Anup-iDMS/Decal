import Message from '../../models/message/MessageModel.js';
import asyncHandler from 'express-async-handler';
import AutoIncrement from './../../models/autoincrement/autoIncrementModel.js';


// @desc    4.1 Register a new Message Queue
// @route   POST /api/messages
// @access  Public
const createMessage = asyncHandler(async (req, res) => {
   const {
      eventType,
      eventTypeId,
      eventTypeCode,
      successFlag,
      communicationType,
      failedCount
   } = req.body
 
   // const messageExists = await Message.findOne({ name })
 
   // if (messageExists) {
   //   res.status(400)
   //   throw new Error('Message already exists')
   // }

   let autoIncrementedMessageNo = "";
   const autoIncrementedNo = await AutoIncrement.getNextId("MESSAGEQUEUE")

   if(autoIncrementedNo < 10) {
       autoIncrementedMessageNo = "MQ000"+autoIncrementedNo;
   } else if(autoIncrementedNo < 100) {
       autoIncrementedMessageNo = "MQ00"+autoIncrementedNo;
   } else if(autoIncrementedNo < 1000) {
       autoIncrementedMessageNo = "MQ0"+autoIncrementedNo;
   } else {
       autoIncrementedMessageNo = "MQ"+autoIncrementedNo;
   }

   const message = await Message.create({
      company: req.user.company,
      createdBy: req.user._id,
      updatedBy: req.user._id,
      messageCode: autoIncrementedMessageNo,
      eventType,
      eventTypeId,
      eventTypeCode,
      communicationType,
      successFlag,
      failedCount,
   })
   if (message) {
     const aiv = await AutoIncrement.setNextId("MESSAGEQUEUE")
     res.status(201).json(message)
   } else {
     res.status(400)
     throw new Error('Invalid Message data')
   }
})

// @desc    4.1 Creates a new Message Queue
// @route   None
// @access  Public
const createMessageRecord = asyncHandler(async (
	company,
	createdBy,
	updatedBy,
	eventType,
	eventTypeId,
	eventTypeCode,
	successFlag="N",
	communicationType,
	failedCount=0) => {

   let autoIncrementedMessageNo = "";
   const autoIncrementedNo = await AutoIncrement.getNextId("MESSAGEQUEUE")

   if(autoIncrementedNo < 10) {
       autoIncrementedMessageNo = "MQ000"+autoIncrementedNo;
   } else if(autoIncrementedNo < 100) {
       autoIncrementedMessageNo = "MQ00"+autoIncrementedNo;
   } else if(autoIncrementedNo < 1000) {
       autoIncrementedMessageNo = "MQ0"+autoIncrementedNo;
   } else {
       autoIncrementedMessageNo = "MQ"+autoIncrementedNo;
   }

   const message = await Message.create({
      company,
      createdBy,
      updatedBy,
      messageCode: autoIncrementedMessageNo,
      eventType,
      eventTypeId,
      eventTypeCode,
      communicationType,
      successFlag,
      failedCount,
   })
   if (message) {
     const aiv = await AutoIncrement.setNextId("MESSAGEQUEUE")
     return message;
   } else {
     throw new Error('Invalid Message data')
   }
})

// @desc    Get all Message Records
// @route   GET /api/messages/all
// @access  Private
const getAllMessages = asyncHandler(async (req, res) => {
   let findQuery = {"successFlag":"N"};
   const messages = await Message.find(findQuery)
   res.json({ messages })
})

// @desc    Get all Message Records
// @route   None Internal
// @access  Private
const findAllAwaitedMessages = asyncHandler(async (req, res) => {
   let findQuery = {"successFlag":"N"};
   const messages = await Message.find(findQuery)
   return messages;
})

// @desc    Update Message Record
// @route   None
// @access  Private
const updateMessage = asyncHandler(async (id) => {
	console.log("Inside UPDATE SAC and ID is ", id)
	const message = await Message.findById(id)
	if (message) {
		try {
         message.successFlag = "Y";
			const updatedMessage = await message.save()
			//console.log("????????????????? Updated Message RECORD IS ", updatedMessage)
			return updatedMessage
		} catch (error) {
			console.log("Inside updateMessage while creating error ==== ", error)
			throw new Error('Error in Updating Message Record')
		}
	} else {
		throw new Error('Invalid Message data')
	}
});


export {
	createMessage,
   createMessageRecord,
   getAllMessages,
   findAllAwaitedMessages,
   updateMessage
}