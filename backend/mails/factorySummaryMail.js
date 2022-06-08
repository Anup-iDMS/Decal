import sendGridMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { format } from 'date-fns'
import { findAppParameterValue } from '../controllers/master/appParameterController.js';


dotenv.config()

sendGridMail.setApiKey(process.env.DECAL_TECH_EMAIL_KEY);

export const sendDaysSummaryMail = async (daysReponse) => {
   let toEmail = [];
   let fromName = await findAppParameterValue("FROM_EMAIL_NAME")
   console.log("inside sendDaysSummaryMail and response got is ", daysReponse)
   if (process.env.NODE_ENV === 'dev') {
      let toEmailValue = await findAppParameterValue("ALL_DEV_MAILS")
      toEmail = toEmailValue.split(",")//['nikhil@idmsinfotech.com', 'moharil.nikhil@gmail.com'];
   } else if (process.env.NODE_ENV === 'production') {
      let toEmailValue = await findAppParameterValue("PRODUCTION_MAILS")
      toEmail = toEmailValue.split(",")//['nikhil@idmsinfotech.com', 'pradip@decaltech.in', 'anup@idmsinfotech.com', 'monika@idmsinfotech.com', 'shailesh@idmsinfotech.com', 'shailesh@decaltech.in'];
   }

   await sendGridMail.send(getMessage(daysReponse, fromName, toEmail));
   return true;
}

const getMessage = (daysReponse, fromName, toEmailValue) => {
   console.log("TO EMAIL VALUE IS -----> ", toEmailValue)
   return {
      to: toEmailValue,
      from: {
         email: process.env.FROM_EMAIL_ADDRESS,
         name: fromName
      },
      subject: `Information: A Day\'s Summary Report! Date - ${format(new Date(), 'dd-MMM-yyyy')}` ,//
      html: getSummaryDetailsEmailHtml(daysReponse),
   };
}

const getSummaryDetailsEmailHtml = (daysReponse) => {
   console.log("inside getSummaryDetailsEmailHtml -----> ".blue)
   let issuedetails = ""
   
   let bodyMessage = `Below is Day\s Summary`

   return `<!doctype html>
   <html lang="en">
    <head>
     <meta charset="UTF-8">
     <meta name="Generator" content="EditPlus®">
     <meta name="Author" content="">
     <meta name="Keywords" content="">
     <meta name="Description" content="">
     <title>Information: A Day's Summary.</title>
     <style>
      body{
         font-family:"Arial"
      }
      .maindiv {
         border: 2px solid #ea1a15!important;
         margin-top: 5%;
         margin-left: 5%;
         margin-Right: 5%;
      }
      .content {
         width: 90%;
         border: 0px solid black;
         margin-left: 3%;
         margin-Right: 3%;
         margin-top: 3%;
         margin-bottom: 3%;
      }
      .pl {
         padding-left: 2%;
      }
      .tc {
         text-align: center;
      }
      .mainbg {
         background-color: #f4f1f0;
      }
      
      table {
         border-collapse: collapse;
         width: 100%;
      }

      td, th {
        border: 1px solid #999;
        text-align: left;
        padding: 10px;
      }

      .noborder {
         border: 0px solid black;
      }

   </style>

   </head>
 <body>
    <table>
      <tr>
          <td colspan="12" class="mainbg"><h4 class="tc">A Day's Summary: ${format(new Date(), 'dd-MMM-yyyy')}</h4></td>
      </tr>
      <tr>
          <td colspan="12" ></td>
       </tr>
      <tr>
          <td colspan="12" class="noborder">
            <p>Dear Recipient, </p>
            <p>Below is today's summary</p>
          </td>
      </tr>
      <tr>
         <td colspan="4" class="mainbg noborder">
            <table>
               <tr>
                  <th colspan="2" class="tc">Orders Booked</th>
               </tr>
               <tr>
                  <td colspan="1">Total # of Orders Booked</td>
                  <td colspan="1">${daysReponse['soResponse'].ordersCount}</td>
               </tr>
               <tr>
                  <td colspan="1">Booked Value (Rs.)</td>
                  <td colspan="1">${(daysReponse['soResponse'].totalSOAmount).toFixed(2)}</td>
               </tr>
            </table>
         </td>
         <td colspan="4" class="mainbg noborder">
            <table>
               <tr>
                  <th colspan="2" class="tc">Invoices Generated</th>
               </tr>
               <tr>
                  <td colspan="1">Total # of Invoices Generated</td>
                  <td colspan="1">${daysReponse['siResponse'].invoicesCount}</td>
               </tr>
               <tr>
                  <td colspan="1">Invoice Amt W/O Tax (Rs.)</td>
                  <td colspan="1">${(daysReponse['siResponse'].invoicesAmountWithoutTax).toFixed(2)}</td>
               </tr>
            </table>
          </td>
          <td colspan="4" class="mainbg noborder">
            <table>
               <tr>
                  <th colspan="2" class="tc">Credit Notes Generated</th>
               </tr>
               <tr>
                  <td colspan="1">Total # of Credit Notes Generated</td>
                  <td colspan="1">${daysReponse['cnResponse'].creditNotesCount}</td>
               </tr>
               <tr>
                  <td colspan="1">Credit Amt W/O Tax (Rs.)</td>
                  <td colspan="1">${(daysReponse['cnResponse'].totalCNAmountWithoutTax).toFixed(2)}</td>
               </tr>
            </table>
          </td>
      </tr>
      <tr>
         <td colspan="4" class="mainbg noborder">
            <table>
               <tr>
                  <th colspan="2" class="tc">Dispatch Details</th>
               </tr>
               <tr>
                  <td colspan="1">Total # of Dispatches</td>
                  <td colspan="1">${daysReponse['ddResponse'].dispatchesCount}</td>
               </tr>
            </table>
         </td>
         <td colspan="4" class="mainbg noborder"></td>
         <td colspan="4" class="mainbg noborder"></td>
      </tr>
      <tr>
         <td colspan="12" class="noborder">
           <p>Thanks & Regards, </p>
           <p>IDMS Support Team</p>
         </td>
      </tr>
      <tr>
         <td colspan="12" class="noborder">
            <p>Note: This is an auto generated email. Please do not reply. </p>
         </td>
      </tr>
    </table>
   
 </body>
</html>`
   
}

