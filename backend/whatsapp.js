const accountSid = 'AC5e57638985c7e38aab637f8c8f21c31b'; 
const authToken = 'bcfb2e7032cc091583ecf3ad7589353f'; 
import twilio from 'twilio';

const client = twilio(accountSid, authToken); 
 
// const message = await client.messages.create({ 
//       body: `Dear Shailesh, \n\nThe following Sales Order has been booked today. \n\nDetails are as below\n
//              *Sales Order*: SO#0021
//              *Customer*: Vega Auto Pvt Ltd.
//              *SO Amount (₹)*: 14,500.00
//              `, 
//       from: 'whatsapp:+14155238886',       
//       to: 'whatsapp:+919920197525',
//       //mediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/India_relief_location_map.jpg/284px-India_relief_location_map.jpg'
//    }) 
//    //.then(message => console.log("Message sent successfully", message.sid)) 
//    .done();

//    console.log("Message sent successfully", message)

client.messages
      .create({
         from: 'whatsapp:+14155238886',
         body: 'Hello there!',
         to: 'whatsapp:+919920197525'
       })
      .then(message => console.log(message.sid));