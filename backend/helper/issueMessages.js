import { findIssueDetailsId } from '../controllers/master/issueController.js';
import { sendMailOnIssueReport, sendMailOnIssueUpdate } from './../mails/reportIssueMail.js';

export const handleIssueCreationMessage = async (eventTypeId) => {
   try {
      const issueDetails = await findIssueDetailsId(eventTypeId)
      const email = await sendMailOnIssueReport(issueDetails);
      return email
   } catch (error) {
      console.log("Error in sending mail when Issue is Raised....")
   }
}

export const handleIssueUpdateMessage = async (eventTypeId) => {
   try {
      const issueDetails = await findIssueDetailsId(eventTypeId)
      const email = await sendMailOnIssueUpdate(issueDetails);
      return email
   } catch (error) {
      console.log("Error in sending mail when Invoice is Updated....")
   }
}