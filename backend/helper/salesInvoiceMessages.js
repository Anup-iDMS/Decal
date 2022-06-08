import { sendMailForSalesInvoiceApproval } from './../mails/salesinvoiceMails.js';
import { findSalesInvoiceById } from './../controllers/sales/salesInvoiceController.js';



export const handleInvoiceCreationMessage = async (eventTypeId) => {
   try {
      let sidet = await findSalesInvoiceById(eventTypeId)
      const email = await sendMailForSalesInvoiceApproval(sidet);
      return email
   } catch (error) {
      console.log("Error in sending mail when Invoice is Generated....")
   }
}