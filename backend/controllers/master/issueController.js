import asyncHandler from 'express-async-handler';
import Issue from '../../models/master/issueModel.js';
import AutoIncrement from './../../models/autoincrement/autoIncrementModel.js';
import { sendMailOnIssueReport, sendMailOnIssueUpdate } from './../../mails/reportIssueMail.js';
import { createMessageRecord } from '../message/messageController.js';

// @desc    Create new Issue Record
// @route   POST /api/issues
// @access  Private

const createIssue = asyncHandler(async (req, res) => {
	console.log("Inside create Issue function start time .....", new Date().getTime())
	const {
      issueNumber,
      issueTitle,
      issueDescription,
      issueAttachment
	} = req.body;
	
	const issue = new Issue({
		company: req.user.company,
		createdBy: req.user._id,
		updatedBy: req.user._id,
      issueNumber,
      issueTitle,
      issueDescription,
      issueAttachment
	});
	//console.log(":::::::: BEFORE creating Issue REcord is >>>>>> ", issue);
	try {
		const createIssue = await issue.save();
		//console.log("Created REcord is >>>>>> ", createIssue);
		if (createIssue) {
         const aiv = await AutoIncrement.setNextId("ISSUE")
         //const issueDetails = await findIssueDetailsId(createIssue._id)
         console.log("Now creating a message queue >>>>>> ");
         const message = await createMessageRecord(
            req.user.company, 
            req.user._id, 
            req.user._id,
            "ISSUECREATE",
            createIssue._id,
            createIssue.issueNumber,
            "N",
            "MAIL"
         );
		   //const email = await sendMailOnIssueReport(issueDetails);
         console.log("After Creating a Message Record >>>>>> ", message.messageCode);
         res.status(201).json(createIssue)
      } else {
         res.status(400)
         throw new Error('Invalid JC data')
      }
		//res.status(201).json(createIssue);
    } catch (error) {
		//console.log("Inside error while creating error ==== ", error)
		res.status(400)
		throw new Error('Invalid Issue data')
    }
    console.log("Inside create Issue function END  time .....", new Date().getTime())
});

// @desc    Get Issue Record by ID
// @route   GET /api/issues/:id
// @access  Private

const getIssueById = asyncHandler(async (req, res) => {
    //console.log(">>>>> Inside get Issue By Id")
    const issue = await Issue.findById(req.params.id).populate('user','name email').populate('company').exec()
    if (issue) {
        //console.log("Issue Record is .... ", issue)
        res.json(issue)
    } else {
        res.status(404)
        throw new Error('Record Not Found')
    }
})

// @desc    Update Issue Record
// @route   PUT /api/issues/:id
// @access  Private
const updateIssue = asyncHandler(async (req, res) => {
	//console.log("Inside UPDATE Issue and ID is ", req.params.id)
	const issue = await Issue.findById(req.params.id).populate('createdBy', 'name').populate('updatedBy', 'name').populate('company', 'name')
	if (issue) {
		try {
			
			issue.updatedBy = req.user._id;
         
			issue.issueNumber = req.body.issueNumber || issue.issueNumber
			issue.issueDate = req.body.issueDate || issue.issueDate
			issue.issueTitle = req.body.issueTitle || issue.issueTitle
			issue.issueDescription = req.body.issueDescription || issue.issueDescription
			issue.issueStatus = req.body.issueStatus || issue.issueStatus

			issue.issueAttachment = req.body.issueAttachment || issue.issueAttachment
			issue.issueResolution = req.body.issueResolution || issue.issueResolution

         const updatedIssue = await issue.save()
         //console.log("issue.updatedBy.name IS ", issue.updatedBy.name)
         updatedIssue.name = issue.updatedBy.name
			//console.log("Updated MODULE RECORD IS ", updatedIssue)

         console.log("Now creating a message queue on ISSUE UPDATE >>>>>> ");
         const message = await createMessageRecord(
            req.user.company, 
            req.user._id, 
            req.user._id,
            "ISSUEUPDATE",
            updatedIssue._id,
            updatedIssue.issueNumber,
            "N",
            "MAIL"
         );

         //const issueDetails = await findIssueDetailsId(req.params.id)
         //console.log("issueDetails >>>>>> ", issueDetails);
         
         //const email = await sendMailOnIssueUpdate(issueDetails);
         //console.log("email sent on updateIssue >>>>>> ", email);

			res.status(201).json(updatedIssue)
		} catch (error) {
			//console.log("Inside error while creating error ==== ", error)
			res.status(400)
			throw new Error('Error in Updating Issue Record')
		}
	} else {
		res.status(400)
		throw new Error('Invalid Issue data')
	}
});

// @desc    Delete a Issue Record
// @route   DELETE /api/issues/:id
// @access  Private
const deleteIssue = asyncHandler(async (req, res) => {
  //console.log("Inside DELETE Issue and ID is ", req.params.id)
  const issue = await Issue.findById(req.params.id)

  if (issue) {
    await issue.remove()
    res.json({ message: 'Issue removed' })
  } else {
    res.status(404)
    throw new Error('Issue not found')
  }
})

// @desc    Get all Issue Records
// @route   GET /api/issues/all
// @access  Private
const getAllIssues = asyncHandler(async (req, res) => {
    //console.log(">>>>> Inside getAllIssues WITH PAGINATION--- === ", req.user._id)
    const pageSize = Number(req.query.pageSize) || 1000
    const page = Number(req.query.pageNumber) || 1

    const count = await Issue.countDocuments()
    //console.log("Total records count are ==== ", count)

    const issues = await Issue.find().limit(pageSize)
    .skip(pageSize * (page - 1))
    ////console.log("Total Leads are ==== ", leads.length)
    ////console.log("Page Number is ==== ", page)
    ////console.log("Total pages are ==== ", Math.ceil(count / pageSize))
	//console.log(issues)
    res.json({ issues, page, pages: Math.ceil(count / pageSize) })
    //res.json(leads)
})

// @desc    Get all Required Master Data for Issue Screen
// @route   GET /api/issues/masterdata
// @access  Private
const getAllMasterDataForIssue = asyncHandler(async (req, res) => {
	let autoIncrementedIssueNo = "";
	const autoIncrementedNo = await AutoIncrement.getNextId("ISSUE")

	if(autoIncrementedNo < 10) {
      autoIncrementedIssueNo = "TN/000"+autoIncrementedNo;
   } else if(autoIncrementedNo < 100) {
      autoIncrementedIssueNo = "TN/00"+autoIncrementedNo;
   } else if(autoIncrementedNo < 1000) {
      autoIncrementedIssueNo = "TN/0"+autoIncrementedNo;
   } else {
      autoIncrementedIssueNo = "TN/"+autoIncrementedNo;
   }

	res.json({ autoIncrementedIssueNo })
})

const findIssueDetailsId = asyncHandler(async (id) => {
   ////console.log("2. Inside getSalesInvoiceById function ------------>")
   const issueDetails = await Issue.findById(id)
                              .populate('createdBy', 'name')
                              .populate('updatedBy', 'name')
                              .populate('company', 'name')
                              .exec()

   return issueDetails;
   
})

export {
	createIssue,
	getIssueById,
	updateIssue,
	deleteIssue,
	getAllIssues,
	getAllMasterDataForIssue,
   findIssueDetailsId
}