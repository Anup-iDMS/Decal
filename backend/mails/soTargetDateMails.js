import sendGridMail from '@sendgrid/mail';
import dotenv from 'dotenv'
import { format } from 'date-fns'
import { findAppParameterValue } from '../controllers/master/appParameterController.js';

dotenv.config()

sendGridMail.setApiKey(process.env.DECAL_TECH_EMAIL_KEY);

export const sendMailForSOTargetDate = async (salesOrders) => {
   
   let toEmail = [];
   let fromName = await findAppParameterValue("FROM_EMAIL_NAME")
   if (process.env.NODE_ENV === 'dev') {
      let toEmailValue = await findAppParameterValue("ALL_DEV_MAILS")
      toEmail = toEmailValue.split(",")
   } else if (process.env.NODE_ENV === 'production') {
      let toEmailValue = await findAppParameterValue("PRODUCTION_MAILS")
      toEmail = toEmailValue.split(",")
   }

   await sendGridMail.send(getMessage(salesOrders, toEmail, fromName));
   return true;
}

export const sendMailForSOMissedTargetDate = async (salesOrders) => {
   
   let toEmail = [];
   let fromName = await findAppParameterValue("FROM_EMAIL_NAME")
   if (process.env.NODE_ENV === 'dev') {
      let toEmailValue = await findAppParameterValue("ALL_DEV_MAILS")
      toEmail = toEmailValue.split(",")
   } else if (process.env.NODE_ENV === 'production') {
      let toEmailValue = await findAppParameterValue("PRODUCTION_MAILS")
      toEmail = toEmailValue.split(",")
   }

   await sendGridMail.send(getMessageMissedTargetDates(salesOrders, toEmail, fromName));
   return true;
}

const getMessage = (salesOrders, toEmail, fromName) => {
   return {
      to: toEmail,
      from: {
      email: process.env.FROM_EMAIL_ADDRESS,
      name: fromName
      },
      subject:  `ALERT: SO Target Date Approaching in Next 2 Days !`,
      html: getSOTargetDateDetailsEmailHTML(salesOrders),
   };
}

const getMessageMissedTargetDates = (salesOrders, toEmail, fromName) => {
   return {
      to: toEmail,
      from: {
      email: process.env.FROM_EMAIL_ADDRESS,
      name: fromName
      },
      subject:  `ALERT: SO Target Dates Missed !`,
      html: getSOTargetDateMissedDetailsEmailHTML(salesOrders),
   };
}

const getSOTargetDateDetailsEmailHTML = (salesOrders) => {
   //console.log("------------- salesOrders ================= ", salesOrders)
   let soDetails = ""
   let bodyMessage = `<b>ALERT</b>: For the following Orders, Target Date is approaching in <b>Next 2 Days</b> !`
 
   {salesOrders.map((sod, index) => (
      soDetails += `<tr>
            <td style="padding: 10px;">${(index+1)}</td>
            <td style="padding: 10px;">${sod.soNumber}</td>
            <td style="padding: 10px;">${format(new Date(sod.soDate), 'dd-MMM-yyyy')}</td>
            <td style="padding: 10px;">${sod.customer}</td>
            <td style="padding: 10px;">${sod.jcDescription}</td>
            <td style="padding: 10px;">${format(new Date(sod.soTargetDate), 'dd-MMM-yyyy')}</td>
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
         width: 100%
      }
      th {
         border: 1px solid #999;
         padding: 10px;
         text-align: center;
       }
      td {
        border: 1px solid #999;
        padding: 10px;
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
      <p class="jc">Below are the Details</p>
         <table>
            <tr>
               <th >#</th>
               <th >SO#</th>
               <th >SO Date</th>
               <th >Customer</th>
               <th >JC Description</th>
               <th >Target Date</th>
            </tr>
         ${soDetails}
         </table>
         <br></br>
         <p>Note: This is an auto generated email. Please do not reply. </p>
   </body>
   </html>`
   
}

const getSOTargetDateMissedDetailsEmailHTML = (salesOrders) => {
   //console.log("------------- salesOrders ================= ", salesOrders)
   let soDetails = ""
   let bodyMessage = `<b>ALERT</b>: Target date has been missed for the following Orders!`
 
   {salesOrders.map((sod, index) => (
      soDetails += `<tr>
            <td style="padding: 10px;">${(index+1)}</td>
            <td style="padding: 10px;">${sod.soNumber}</td>
            <td style="padding: 10px;">${format(new Date(sod.soDate), 'dd-MMM-yyyy')}</td>
            <td style="padding: 10px;">${sod.customer}</td>
            <td style="padding: 10px;">${sod.jcDescription}</td>
            <td style="padding: 10px;">${format(new Date(sod.soTargetDate), 'dd-MMM-yyyy')}</td>
            <td style="padding: 10px;">${sod.daysPassed}</td>
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
         width: 100%
      }
      th {
         border: 1px solid #999;
         padding: 1rem;
         text-align: center;
      }
      td, th {
        border: 1px solid #999;
        padding: 1rem;
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
      <p class="jc">Below are the Details</p>
         <table>
            <tr>
               <th >#</th>
               <th >SO#</th>
               <th >SO Date</th>
               <th >Customer</th>
               <th >JC Description</th>
               <th >Target Date</th>
               <th >Days Passed</th>
            </tr>
         ${soDetails}
         </table>
         <br></br>
         <p>Note: This is an auto generated email. Please do not reply. </p>
   </body>
   </html>`
   
}