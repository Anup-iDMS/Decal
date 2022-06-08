const environment = "qa"
export const logger = (data) => {
   if (environment === 'production' || environment === 'qa') return;
   console.log(data);
}