import asyncHandler from 'express-async-handler';
import { findAllCreditNotesForADay } from '../sales/creditNoteController.js';
import { findAllDispatchesForADay } from '../sales/deliveryNoteController.js';
import { findAllInvoicesForADay } from '../sales/salesInvoiceController.js';
import { 
   findAllOrdersForADay, 
   getSOWithTargetDateApproaching,
   getSOPassedTargetDate 
} from '../sales/salesOrderController.js';
import { sendDaysSummaryMail } from './../../mails/factorySummaryMail.js';
import { 
   sendMailForSOTargetDate,
   sendMailForSOMissedTargetDate 
} from './../../mails/soTargetDateMails.js';
import { sendFactorySummarySMS } from './../../messages/factorySummarySMS.js';

export const daysSummary = async() => {
   let daysReponse = {}
   console.log("inside day's summary ".blue)
   /** Invoice Summary */
   const siResponse = await findAllInvoicesForADay();
   daysReponse['siResponse'] = siResponse;
   /** SO Summary */
   const soResponse = await findAllOrdersForADay();
   daysReponse['soResponse'] = soResponse;
   /** Credit Note Summary */
   const cnResponse = await findAllCreditNotesForADay();
   daysReponse['cnResponse'] = cnResponse;
   /** Dispatch Details */
   const ddResponse = await findAllDispatchesForADay();
   daysReponse['ddResponse'] = ddResponse;
   /** Send Mail */
   try {
      const email = await sendDaysSummaryMail(daysReponse);
      //console.log("All Well in daysSummary MAIL ....".pink)
      let sms = sendFactorySummarySMS(daysReponse);
      console.log("All Well in daysSummary SMS ....".pink)
      return true
   } catch (error) {
      console.log("Error in sending mail SMS for factory Summary....", error)
   }
   /** Send SMS */
}

export const soTargetDateAlert = async() => {
   const salesOrders = await getSOWithTargetDateApproaching();
   try {
      const email = await sendMailForSOTargetDate(salesOrders);
      console.log("All Well in soTargetDateAlert ....".pink)
      return email
   } catch (error) {
      console.log("Error in sending mail when Target Date mail is sent ....", error)
   }
}

export const soMissedTargetDateAlert = async() => {
   const salesOrders = await getSOPassedTargetDate();
   try {
      const email = await sendMailForSOMissedTargetDate(salesOrders);
      console.log("All Well in soMissedTargetDateAlert ....".pink)
      return email
   } catch (error) {
      console.log("Error in sending mail when Missed Target Date mail is sent ....", error)
   }
}
