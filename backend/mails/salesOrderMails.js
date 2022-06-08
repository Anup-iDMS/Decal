import sendGridMail from '@sendgrid/mail';
import dotenv from 'dotenv'
import { format } from 'date-fns'
import { findAppParameterValue } from '../controllers/master/appParameterController.js';

dotenv.config()

sendGridMail.setApiKey(process.env.DECAL_TECH_EMAIL_KEY);

export const sendMailOnSOCreation = async (salesOrder) => {
   let toEmail = [];
   let fromName = await findAppParameterValue("FROM_EMAIL_NAME")
   //console.log("inside sendMailOnSOCreation and from name is ", fromName)
   if (process.env.NODE_ENV === 'dev') {
      let toEmailValue = await findAppParameterValue("ALL_DEV_MAILS")
      toEmail = toEmailValue.split(",")//['nikhil@idmsinfotech.com', 'moharil.nikhil@gmail.com'];
   } else if (process.env.NODE_ENV === 'production') {
      let toEmailValue = await findAppParameterValue("ISSUE_CREATION_EMAIL")
      toEmail = toEmailValue.split(",")//['nikhil@idmsinfotech.com', 'pradip@decaltech.in', 'anup@idmsinfotech.com', 'monika@idmsinfotech.com', 'shailesh@idmsinfotech.com', 'shailesh@decaltech.in'];
   }
   await sendGridMail.send(getMessage(salesOrder, fromName, toEmail));
   //await sendGridMail.send(getMessage(salesOrder));
   return true;
}

const getMessage = (salesOrder, fromName, toEmail) => {
   //let toEmail = [];
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
     subject: `A Sales Order ${salesOrder.soNumber} has been booked !`,
     text: `A Sales Order ${salesOrder.soNumber} has been booked.`,
     html: getSalesOrderDetailsEmailHtml(salesOrder),
   };
}

const getSalesOrderDetailsEmailHtml = (salesOrder) => {
   console.log("Inside getSalesOrderDetailsEmailHtml Message Function ----- ")
   let salesOrderdetails = ""
   let bodyMessage = `A Sales Order ${salesOrder.soNumber} has been booked.`

   {salesOrder.soDetails.map((salesOrderd, index) => (
      salesOrderdetails += `<tr>
            <td>${(index+1)}</td>
            <td>${salesOrderd.jcNo.jcDescription}</td>
            <td>${salesOrderd.orderedQty}</td>
            <td>${salesOrderd.soUnitRate}</td>
            <td>${salesOrderd.lineValue}</td>
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
      <p>Below are the Sales Order Details</p>
         <table>
           <tr>
            <th>SO #</th>
            <th>SO Date</th>
            <th>Customer</th>
            <th>PO#</th>
            <th>SO Value</th>
            <th>Target Dispatch Date</th>
           </tr>
           <tr>
            <td>${salesOrder.soNumber}</td>
            <td>${format(new Date(salesOrder.soDate), 'dd-MMM-yyyy')}</td>
            <td>${salesOrder.customer.custName}</td>
            <td>${salesOrder.poNumber}</td>
            <td>${salesOrder.soTotalAmount.toFixed(2)}</td>
            <td>${format(new Date(salesOrder.soTargetDate), 'dd-MMM-yyyy')}</td>
           </tr>
         </table>
         <br>
         <p class="jc">Sales Order Details</p>
         <table>
         
           <tr>
            <th >#</th>
            <th >JC Description</th>
            <th >Ordered Qty</th>
            <th >Unit Rate</th>
            <th >Line Value (₹)</th>
          </tr>
          ${salesOrderdetails}
         </table>
         <br></br>
         <p>Note: This is an auto generated email. Please do not reply. </p>
   </body>
   </html>`
}