import sendGridMail from '@sendgrid/mail';
import dotenv from 'dotenv'
import { format } from 'date-fns'
import { findAppParameterValue } from '../controllers/master/appParameterController.js';

dotenv.config()

sendGridMail.setApiKey(process.env.DECAL_TECH_EMAIL_KEY);

export const sendMailForSalesInvoiceApproval = async (salesInvoice) => {
   
   let toEmail = [];
   let fromName = await findAppParameterValue("FROM_EMAIL_NAME")
   if (process.env.NODE_ENV === 'dev') {
      let toEmailValue = await findAppParameterValue("ALL_DEV_MAILS")
      toEmail = toEmailValue.split(",")//['nikhil@idmsinfotech.com', 'moharil.nikhil@gmail.com'];
   } else if (process.env.NODE_ENV === 'production') {
      let toEmailValue = await findAppParameterValue("SALES_MAILS")
      toEmail = toEmailValue.split(",")//['nikhil@idmsinfotech.com', 'pradip@decaltech.in', 'anup@idmsinfotech.com', 'monika@idmsinfotech.com', 'shailesh@idmsinfotech.com', 'shailesh@decaltech.in'];
   }

   await sendGridMail.send(getMessage(salesInvoice, toEmail, fromName));
   return true;
}

const getMessage = (salesInvoice, toEmail, fromName) => {
   // let toEmail = [];
   // if (process.env.NODE_ENV === 'dev') {
   //    toEmail = ['nikhil@idmsinfotech.com', 'moharil.nikhil@gmail.com'];
   // } else if (process.env.NODE_ENV === 'production') {
   //    toEmail = ['nikhil@idmsinfotech.com', 'pradip@decaltech.in', 'anup@idmsinfotech.com', 'monika@idmsinfotech.com', 'shailesh@idmsinfotech.com', 'shailesh@decaltech.in'];
   // }
   return {
     to: toEmail,
     from: {
      email: process.env.FROM_EMAIL_ADDRESS,
      name: fromName
     },
     subject:  `A Sales Invoice ${salesInvoice.salesInvoiceNumber} has been generated !`,
     text: `A Sales Invoice ${salesInvoice.salesInvoiceNumber} has been generated.`,
     html: getSalesInvoiceDetailsEmailHtml(salesInvoice),
   };
}

const getSalesInvoiceDetailsEmailHtml = (salesInvoice) => {
   
   let salesInvoicedetails = ""
   let bodyMessage = `A Sales Invoice ${salesInvoice.salesInvoiceNumber} has been generated.`
 
   {salesInvoice.salesInvoiceDetails.map((salesInvoiced, index) => (
      salesInvoicedetails += `<tr>
            <td>${(index+1)}</td>
            <td>${salesInvoiced.soNo.soNumber}</td>
            <td>${salesInvoiced.soNo.poNumber}</td>
            <td>${salesInvoiced.jcNo.jcDescription}</td>
            <td>${format(new Date(salesInvoiced.batchDate), 'dd-MMM-yyyy')}</td>
            <td>${salesInvoiced.dispatchQty}</td>
            <td>${salesInvoiced.salesInvoiceUnitRate}</td>
            <td>${salesInvoiced.salesInvoiceLineValue}</td>
         </tr>`  
   ))}
   return `<!doctype html>
   <html lang="en">
    <head>
     <meta charset="UTF-8">
     <meta name="Generator" content="EditPlus®">
     <meta name="Author" content="">
     <meta name="Keywords" content="">
     <meta name="Description" content="">
     <title>${bodyMessage}</title>
     <style>
        body{
         font-family:"Arial"
      }
      table {
         border-collapse: collapse;
         width: 90%
      }
      td, th {
        border: 1px solid #999;
        padding: 0.5rem;
        text-align: left;
      }
      p{
         font-size: "16px"
      }
      .jc {
         color:"red"
      }
     </style>
    </head>
    <body>
      <p>Dear Recipient, </p>
      <p>${bodyMessage}</p>
      <p>Below are the SalesInvoice Details</p>
         <table>
           <tr>
            <th>SalesInvoice #</th>
            <th>SalesInvoice Date</th>
            <th>Customer</th>
            <th>Ship State</th>
            <th>Invoice Amount</th>
           </tr>
           <tr>
            <td>${salesInvoice.salesInvoiceNumber}</td>
            <td>${format(new Date(salesInvoice.salesInvoiceDate), 'dd-MMM-yyyy')}</td>
            <td>${salesInvoice.customer.custName}</td>
            <td>${salesInvoice.shipState}</td>
            <td>${salesInvoice.salesInvoiceTotalAmount.toFixed(2)}</td>
           </tr>
         </table>
         <br>
         <p class="jc">Sales Invoice Details</p>
         <table>
         
           <tr>
            <th >#</th>
            <th >SO#</th>
            <th >PO#</th>
            <th >JC Description</th>
            <th >Batch</th>
            <th >Dispatch Qty</th>
            <th >Unit Rate</th>
            <th >Line Value (₹)</th>
          </tr>
          ${salesInvoicedetails}
         </table>
         <br></br>
         <p>Note: This is an auto generated email. Please do not reply. </p>
   </body>
   </html>`
   
}