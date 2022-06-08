/**
 * These asterisks are part of the crontab syntax to represent different units of time:
  * * * * * *
  | | | | | |
  | | | | | day of week
  | | | | month
  | | | day of month
  | | hour
  | minute
  second ( optional )
 */

import cron from 'node-cron';
import sendGridMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { findAllAwaitedMessages, updateMessage } from '../controllers/message/messageController.js';
import { handleIssueCreationMessage, handleIssueUpdateMessage } from './../helper/issueMessages.js';
import { handleOrderCreationMessage } from './../helper/bookOrderMessages.js';
import { handleDRNCreationMessage, handleDRNRejectionMessage } from './../helper/drnMessages.js';
import { handleInvoiceCreationMessage } from './../helper/salesInvoiceMessages.js';


dotenv.config()

const createCron = async () => {
   
   try {
      cron.schedule('* * * * *', async function() {
         //console.log('??????? Running Task Every 2 minutes -----'.blue, new Date().getTime())
         const undeliveredMessages = await findAllAwaitedMessages();
         for (const ud of undeliveredMessages) {
            let eventType = ud.eventType;
            switch (eventType) {
               case "ISSUECREATE": {
                  if(ud.communicationType === "MAIL") {
		               const email = await handleIssueCreationMessage(ud.eventTypeId);
                     if(email){
                        const updatedMsg = await updateMessage(ud._id)
                     }
                  }
                  else if(ud.communicationType === "WHATSAPP") {
                     //const updatedMsg = await updateMessage(ud._id)
                     ////console.log("2. Here inside case ISSUECREATE updatedMsg == ----------> ", updatedMsg.successFlag)
                  }
               }
               break;
               case "ISSUEUPDATE": {
                  if(ud.communicationType === "MAIL") {
		               const email = await handleIssueUpdateMessage(ud.eventTypeId);
                     if(email){
                        const updatedMsg = await updateMessage(ud._id)
                     }
                  }
                  else if(ud.communicationType === "WHATSAPP") {
                     //const updatedMsg = await updateMessage(ud._id)
                     ////console.log("2. Here inside case ISSUECREATE updatedMsg == ----------> ", updatedMsg.successFlag)
                  }
               }
               break;
               case "ORDERCREATE": {
                  if(ud.communicationType === "MAIL") {
                     //console.log("...inside handle orcer creation message ".green, ud.eventTypeId)
		               const email = await handleOrderCreationMessage(ud.eventTypeId);
                     if(email){
                        const updatedMsg = await updateMessage(ud._id)
                     }
                  }
                  else if(ud.communicationType === "WHATSAPP") {
                     //const updatedMsg = await updateMessage(ud._id)
                     ////console.log("2. Here inside case ISSUECREATE updatedMsg == ----------> ", updatedMsg.successFlag)
                  }
               }
               break;
               case "DRNCREATE": {
                  if(ud.communicationType === "MAIL") {
                     //console.log("...inside handle DRN creation message ".green, ud.eventTypeId)
		               const email = await handleDRNCreationMessage(ud.eventTypeId);
                     if(email){
                        const updatedMsg = await updateMessage(ud._id)
                     }
                  }
                  else if(ud.communicationType === "WHATSAPP") {
                     //const updatedMsg = await updateMessage(ud._id)
                     ////console.log("2. Here inside case ISSUECREATE updatedMsg == ----------> ", updatedMsg.successFlag)
                  }
               }
               break;
               case "DRNREJECT": {
                  if(ud.communicationType === "MAIL") {
                     //console.log("...inside handle DRN REJECTION message ".red, ud.eventTypeId)
		               const email = await handleDRNRejectionMessage(ud.eventTypeId);
                     if(email){
                        const updatedMsg = await updateMessage(ud._id)
                     }
                  }
                  else if(ud.communicationType === "WHATSAPP") {
                     //const updatedMsg = await updateMessage(ud._id)
                     ////console.log("2. Here inside case ISSUECREATE updatedMsg == ----------> ", updatedMsg.successFlag)
                  }
               }
               break;
               case "INVOICECREATE": {
                  if(ud.communicationType === "MAIL") {
                     //console.log("...inside handle Invoice creation message ".green, ud.eventTypeId)
		               const email = await handleInvoiceCreationMessage(ud.eventTypeId);
                     if(email){
                        const updatedMsg = await updateMessage(ud._id)
                     }
                  }
                  else if(ud.communicationType === "WHATSAPP") {
                     //const updatedMsg = await updateMessage(ud._id)
                     ////console.log("2. Here inside case ISSUECREATE updatedMsg == ----------> ", updatedMsg.successFlag)
                  }
               }
               break;
            
               default:
                  break;
            }
         }
         ////console.log('Inside createCron Method END TIME -----', new Date().getTime())
         ////console.log(undeliveredMessages)
      });
   } catch (error) {
      console.error(`Error: ${error}`.red.underline.bold)
      process.exit(1)
   }
}
 
export default createCron