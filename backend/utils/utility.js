import Fiscal from 'fiscal';

const fiscal = new Fiscal(3);
const info = fiscal.getFiscalInfoForDate();

export const getCurrentFinancialYear = () => {
   let fiscalyear = "";
   let today = new Date();
   if ((today.getMonth() + 1) <= 3) {
     fiscalyear = (new Date().getFullYear()-1).toString().substr(-2)+
                  (new Date().getFullYear().toString().substr(-2))
                   
     //new Date().toLocaleDateString('en', {year: '2-digit'})
     //(today.getFullYear() - 1) + today.getFullYear()
   } else {
     //fiscalyear = today.getFullYear() + (today.getFullYear() + 1)
     fiscalyear = (new Date().getFullYear().toString().substr(-2))+
                  (new Date().getFullYear()+1).toString().substr(-2) 
   }
   //console.log("Inside getCurrentFinancialYear and year is ", fiscalyear)
   return fiscalyear
}

export const getFirstDayOfMonth = () => {
  let date = new Date(), y = date.getFullYear(), m = date.getMonth();
  let firstDay = new Date(y, m, 1);
  return firstDay
}

export const getLastDayOfMonth = () => {
  let date = new Date(), y = date.getFullYear(), m = date.getMonth();
  let lastDay = new Date(y, m + 1, 1);
  return lastDay
}

export const getFirstDayOfFiscalYear = () => {
  return info.fiscalYear.startDate;
}

export const getLastDayOfFiscalYear = () => {
  return info.fiscalYear.endDate;
}