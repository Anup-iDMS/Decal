/**
 * These asterisks are part of the crontab syntax to represent different units of time:
  * * * * * *
  | | | | | |
  | | | | | day of week
  | | | | month
  | | | day of month
  | | hour
  | minute
  second ( optional )
 */

import cron from 'node-cron';
import { 
   daysSummary, 
   soTargetDateAlert,
   soMissedTargetDateAlert 
} from './../controllers/communication/communicationController.js';

const createEmailCron = async () => {

   try {
      cron.schedule('05 16 * * *', async () => { //
         let daysReponse = await daysSummary();
      });
      cron.schedule('10 16 * * *', async () => { //
         let response = await soMissedTargetDateAlert();
      });
      cron.schedule('15 16 * * *', async () => { //
         let email = await soTargetDateAlert();
      });

   } catch (error) {
      console.error(`Error: ${error}`.red.underline.bold)
      process.exit(1)
   }
}

export default createEmailCron