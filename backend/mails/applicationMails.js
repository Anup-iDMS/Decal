import sendGridMail from '@sendgrid/mail';
import dotenv from 'dotenv'
import { format } from 'date-fns'
import { findAppParameterValue } from '../controllers/master/appParameterController.js';

dotenv.config()

sendGridMail.setApiKey(process.env.DECAL_TECH_EMAIL_KEY);

export const sendMailForDRNApproval = async (drn, action) => {
   let toEmail = [];
   let fromName = await findAppParameterValue("FROM_EMAIL_NAME")
   if (process.env.NODE_ENV === 'dev') {
      let toEmailValue = await findAppParameterValue("ALL_DEV_MAILS")
      toEmail = toEmailValue.split(",")//['nikhil@idmsinfotech.com', 'moharil.nikhil@gmail.com'];
   } else if (process.env.NODE_ENV === 'production') {
      let toEmailValue = await findAppParameterValue("DRN_EMAIL")
      toEmail = toEmailValue.split(",")//['nikhil@idmsinfotech.com', 'pradip@decaltech.in', 'anup@idmsinfotech.com', 'monika@idmsinfotech.com', 'shailesh@idmsinfotech.com', 'shailesh@decaltech.in'];
   }
   await sendGridMail.send(getMessage(drn, action, toEmail, fromName));
   return true;
}

const getMessage = (drn, action, toEmail, fromName) => {
   // let toEmail = [];
   // if (process.env.NODE_ENV === 'dev') {
   //    toEmail = ['nikhil@idmsinfotech.com', 'moharil.nikhil@gmail.com'];
   // } else if (process.env.NODE_ENV === 'production') {
   //    toEmail = ['nikhil@idmsinfotech.com', 'quality@decaltech.in', 'pradip@decaltech.in', 'anup@idmsinfotech.com', 'monika@idmsinfotech.com', 'shailesh@idmsinfotech.com', 'shailesh@decaltech.in'];
   // }
   return {
     to: toEmail,
     from: {
      email: process.env.FROM_EMAIL_ADDRESS,
      name: fromName
    },
     subject: action==="P"?'Attention: Dispatch Request Note has been submitted for your approval'
     :'Attention: Dispatch Request Note has been Rejected',
     text: `Dear QA Team, The Production Team has submitted a Dispatch Request Note ${drn.drnNumber}. 
            Kindly take the further necessary action`,
     html: getDRNDetailsEmailHtml(drn, action),
   };
}

const getDRNDetailsEmailHtml = (drn, action) => {
   let drndetails = ""
   let bodyMessage = ""
   if(action === "P") {
      bodyMessage = `The Production Team has submitted a Dispatch Request Note ${drn.drnNumber}. Kindly check for further action.`
   } else if(action === "R") {
      bodyMessage = `The QA Team has rejected a Dispatch Request Note ${drn.drnNumber}. Kindly check for further action.`
   } 
   //console.log("Message is ", bodyMessage)
   {drn.drnDetails.map((drnd, index) => (
      drndetails = `<tr>
            <td colspan="2">${drnd.drnLineNumber}</td>
            <td colspan="2">${drnd.soNo.soNumber}</td>
            <td colspan="2">${drnd.jcNo.jcDescription}</td>
            <td colspan="2">${format(new Date(drnd.batchDate), 'dd-MMM-yyyy')}</td>
            <td colspan="2">${drnd.dispatchQty}</td>
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
         width: 80%
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
      <p>Below are the DRN Details</p>
         <table>
           <tr>
            <th colspan="3">DRN #</th>
            <th colspan="3">DRN Date</th>
            <th colspan="3">Customer</th>
            <th colspan="3">Ship State</th>
           </tr>
           <tr>
            <td colspan="3">${drn.drnNumber}</td>
            <td colspan="3">${drn.drnNumber}</td>
            <td colspan="3">${drn.customer.custName}</td>
            <td colspan="3">${drn.shipState}</td>
           </tr>
         </table>
         <br>
         <p class="jc">DRN Details</p>
         <table>
           <tr>
            <th colspan="2">#</th>
            <th colspan="2">SO#</th>
            <th colspan="2">JC Description</th>
            <th colspan="2">Batch</th>
            <th colspan="2">Dispatch Qty</th>
          </tr>
          ${drndetails}
         </table>
         <br></br>
         <p>Note: This is an auto generated email. Please do not reply. </p>
   </body>
   </html>`
   
}