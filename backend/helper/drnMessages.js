import { sendMailForDRNApproval } from './../mails/applicationMails.js';
import { findDRNById } from './../controllers/drn/drnController.js';



export const handleDRNCreationMessage = async (eventTypeId) => {
  try {
      let drndet = await findDRNById(eventTypeId)
      const email = await sendMailForDRNApproval(drndet, "P");
      return email
  } catch (error) {
      console.log("Error in sending mail when DRN is Generated....")
  }
}


export const handleDRNRejectionMessage = async (eventTypeId) => {
   try {
      let drndet = await findDRNById(eventTypeId)
      const email = await sendMailForDRNApproval(drndet, "R");
      return email
   } catch (error) {
      console.log("Error in sending mail when DRN is Rejecetd....")
   }
}