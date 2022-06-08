import twilio from 'twilio';
import { WA_USER_ADDRESS, getWANumber } from './moduleConstants.js';

export const sendWAMessageOnOderCreation = (salesOrder) => {
   const client = twilio(process.env.TWILIO_ACCOUNT_ID, process.env.TWILIO_ACCOUNT_TOKEN); 
   const messageSent = client.messages .create({ 
      body: `${WA_USER_ADDRESS},\n\nThe following Sales Order has been booked today.\nDetails are as below\n
             *Sales Order #*: ${salesOrder.soNumber}
             *SO Amount (₹)*: ${salesOrder.soTotalAmount}
             `, 
      from: 'whatsapp:+14155238886',
      to: `${getWANumber()}`,
      //mediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/India_relief_location_map.jpg/284px-India_relief_location_map.jpg'
   }) 
   .then(message => console.log("Message sent successfully", message.sid)) 
   .done();

   return messageSent;
}