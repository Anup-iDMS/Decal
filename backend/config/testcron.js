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

  const testCron = async () => {
   
   try {
      cron.schedule('30 14 * * *', () => {
         console.log('********* Mamaji running a task every day at 2:30 pm '.black);
      });
   } catch (error) {
      console.error(`Error: ${error}`.red.underline.bold)
      process.exit(1)
   }
}
 
export default testCron