import { sendMailOnSOCreation } from './../mails/salesOrderMails.js';
import { findSalesOrderById } from './../controllers/sales/salesOrderController.js';

export const handleOrderCreationMessage = async (eventTypeId) => {
   try {
      let sodet = await findSalesOrderById(eventTypeId)
      const email = await sendMailOnSOCreation(sodet);
      return email
   } catch (error) {
      console.log("Error in sending mail when Sales Order is Generated....")
   }
}
