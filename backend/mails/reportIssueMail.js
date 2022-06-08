import sendGridMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { format } from 'date-fns'
import { findAppParameterValue } from '../controllers/master/appParameterController.js';

dotenv.config()

sendGridMail.setApiKey(process.env.DECAL_TECH_EMAIL_KEY);

export const sendMailOnIssueReport = async (issue) => {
   let toEmail = [];
   let fromName = await findAppParameterValue("FROM_EMAIL_NAME")
   
   if (process.env.NODE_ENV === 'dev') {
      let toEmailValue = await findAppParameterValue("ALL_DEV_MAILS")
      toEmail = toEmailValue.split(",")//['nikhil@idmsinfotech.com', 'moharil.nikhil@gmail.com'];
   } else if (process.env.NODE_ENV === 'production') {
      let toEmailValue = await findAppParameterValue("ISSUE_CREATION_EMAIL")
      toEmail = toEmailValue.split(",")//['nikhil@idmsinfotech.com', 'pradip@decaltech.in', 'anup@idmsinfotech.com', 'monika@idmsinfotech.com', 'shailesh@idmsinfotech.com', 'shailesh@decaltech.in'];
   }

   await sendGridMail.send(getMessage(issue, fromName, toEmail));
   return true;
}

const getMessage = (issue, fromName, toEmailValue) => {
   //console.log("TO EMAIL VALUE IS -----> ", toEmailValue)
   return {
      to: toEmailValue,
      from: {
         email: process.env.FROM_EMAIL_ADDRESS,
         name: fromName
      },
      subject: 'Attention: An issue has been raised by an IDMS user !',
      text:    `Dear Support Team, The Production Team has raised an issue ${issue.issueNumber}. 
               Kindly take the further necessary action`,
      html: getIssueDetailsEmailHtml(issue),
   };
}

const getIssueDetailsEmailHtml = (issue) => {
   
   let issuedetails = ""
   
   let bodyMessage = `The application user has raised an issue ${issue.issueNumber}. 
   Kindly take the further necessary action`

   return `<!doctype html>
   <html lang="en">
    <head>
     <meta charset="UTF-8">
     <meta name="Generator" content="EditPlus®">
     <meta name="Author" content="">
     <meta name="Keywords" content="">
     <meta name="Description" content="">
     <title>Attention! An Issue has been reported by an IDMS user.</title>
     <style>
        body{
         font-family:"Arial"
      }
      table {
         border-collapse: collapse;
         width: 70%
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
      <p>Dear Support Team, </>
      <p>${bodyMessage}</p>
      <p>Below are the Issue Details</p>
         <table>
           <tr>
            <th>Issue #</th>
            <th>Module</th>
            <th>Issue Description</th>
            <th>Raised By</th>
            <th>Company</th>
           </tr>
           <tr>
            <td>${issue.issueNumber}</td>
            <td>${issue.issueTitle}</td>
            <td>${issue.issueDescription}</td>
            <td>${issue.createdBy.name}</td>
            <td>${issue.company.name}</td>
           </tr>
         </table>
         <br></br>
         <p>Thanks & Regards,</p>
         <p>${issue.createdBy.name}</p>
         <br></br>
         <p>Note: This is an auto generated email. Please do not reply. </p>
      </body>
   </html>`
   
}


export const sendMailOnIssueUpdate = async (issue) => {
   let toEmail = [];
   let fromName = await findAppParameterValue("FROM_EMAIL_NAME")
   
   if (process.env.NODE_ENV === 'dev') {
      let toEmailValue = await findAppParameterValue("ALL_DEV_MAILS")
      toEmail = toEmailValue.split(",")//['nikhil@idmsinfotech.com', 'moharil.nikhil@gmail.com'];
   } else if (process.env.NODE_ENV === 'production') {
      let toEmailValue = await findAppParameterValue("ISSUE_CREATION_EMAIL")
      toEmail = toEmailValue.split(",")//['nikhil@idmsinfotech.com', 'pradip@decaltech.in', 'anup@idmsinfotech.com', 'monika@idmsinfotech.com', 'shailesh@idmsinfotech.com', 'shailesh@decaltech.in'];
   }

   //await sendGridMail.send(getMessage(issue, fromName, toEmail));

   await sendGridMail.send(getIssueUpdatedMessage(issue, fromName, toEmail));
   return true;
}

const getIssueUpdatedMessage = (issue, fromName, toEmail) => {
   return {
      to: toEmail,
      from: {
         email: process.env.FROM_EMAIL_ADDRESS,
         name: fromName
      },
      subject: 'Attention: An issue has been updated !',
      text: `Dear Support Team, The issue ${issue.issueNumber} has been updated. 
               Kindly take a look at the issue details`,
      html: getIssueUpdatedDetailsEmailHtml(issue),
   };
}

const getIssueUpdatedDetailsEmailHtml = (issue) => {
   
   let issuedetails = ""
   
   let bodyMessage = `The application user has raised an issue ${issue.issueNumber}. 
   Kindly take a look at the issue details`

   return `<!doctype html>
   <html lang="en">
    <head>
     <meta charset="UTF-8">
     <meta name="Generator" content="EditPlus®">
     <meta name="Author" content="">
     <meta name="Keywords" content="">
     <meta name="Description" content="">
     <title>Attention! An Issue has been updated by an IDMS user.</title>
     <style>
        body{
         font-family:"Arial"
      }
      table {
         border-collapse: collapse;
         width: 70%
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
      <p>Below are the Issue Details</p>
         <table>
           <tr>
            <th>Issue #</th>
            <th>Module</th>
            <th>Issue Description</th>
            <th>Issue Resolution</th>
            <th>Status</th>
            <th>Company</th>
           </tr>
           <tr>
            <td>${issue.issueNumber}</td>
            <td>${issue.issueTitle}</td>
            <td>${issue.issueDescription}</td>
            <td>${issue.issueResolution}</td>
            <td>${issue.issueStatus}</td>
            <td>${issue.company.name}</td>
           </tr>
         </table>
         <br></br>
         <p>Thanks & Regards,</p>
         <p>${issue.updatedBy.name}</p>
         <br></br>
         <p>Note: This is an auto generated email. Please do not reply. </p>
      </body>
   </html>`
   
}