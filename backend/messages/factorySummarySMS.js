import dotenv from 'dotenv';
import unirest from "unirest";
import { format } from 'date-fns'
import { findAppParameterValue } from '../controllers/master/appParameterController.js';

dotenv.config()

var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

req.headers({
   "authorization": process.env.DECAL_TECH_SMS_KEY
});

export const sendFactorySummarySMS = async (daysReponse) => {
   let fromName = await findAppParameterValue("FROM_EMAIL_NAME")
   let summaryPhone = "9920197525" 

   if (process.env.NODE_ENV === 'production') {
      summaryPhone = await findAppParameterValue("MGMT_PHONE")
   }

   console.log("!!!!!! Inside sendFactorySummarySMS and summaryPhone is ::::::::::::: ", summaryPhone)
   let message = `DTPL - Summary Report!\nDate - ${format(new Date(), 'dd-MMM-yyyy')}`
   message += `\nOrders: ${daysReponse['soResponse'].ordersCount}`
   message += `\nValue (Rs.): ${daysReponse['soResponse'].totalSOAmount}`
   message += `\nInvoices: ${daysReponse['siResponse'].invoicesCount}`
   message += `\nInvoice Amt: ${daysReponse['siResponse'].invoicesAmountWithoutTax}`
   message += `\nCredit Notes: ${daysReponse['cnResponse'].creditNotesCount}`
   message += `\nCredit Note Amt: ${daysReponse['cnResponse'].totalCNAmountWithoutTax}`
   message += `\nDispatches: ${daysReponse['ddResponse'].dispatchesCount}`
   console.log("!!!!!! Inside sendFactorySummarySMS and SMS message is ::::::::::::: ", message)

   req.form({
      "sender_id": `${fromName}`,
      "message": `${message}`,
      "route": "v3",
      "numbers": `${summaryPhone}`,
   });
   
   req.end(function (res) {
      if (res.error) {
         return false;
         throw new Error(res.error);
      }
      console.log(res.body);
   });
   return true;
}

 
