export const CUSTOMER_MODULE_PREFIX_PREFIX = 'CUST'
export const SUPPLIER_MODULE_PREFIX_PREFIX = 'SUPPLIER'
export const JC_MASTER_MODULE_PREFIX_PREFIX = 'JC'
export const JC_MASTER_SCREEN_PRINT_MODULE_PREFIX_PREFIX = 'JC-SP'
export const JC_MASTER_DIGITAL_PRINT_MODULE_PREFIX_PREFIX = 'JC-DP'
export const JC_MASTER_PLOTTER_CUT_MODULE_PREFIX_PREFIX = 'JC-PC'
export const HSNSAC_MODULE_PREFIX = 'HSN'
export const SALES_ORDER_MODULE_PREFIX = 'SO'
export const SALES_INVOICE_MODULE_PREFIX = 'SI'
export const DRN_MODULE_PREFIX = 'DRN'
export const FGMI_MODULE_PREFIX = 'FGMI'
export const MACHINE_MASTER_MODULE_PREFIX = 'MACHINE'
export const JOBCARD_MODULE_PREFIX = 'JOBCARD'
export const DELIVERY_NOTE_MODULE_PREFIX = 'DELIVERY'
export const CREDIT_NOTE_MODULE_PREFIX = 'CREDIT'
export const USER_MODULE_PREFIX = 'USER'

//WhatsApp Config Parameters
export const WA_USER_ADDRESS = 'Dear Shailesh, '

export const getWANumber = () => {
  let defaultWANumber = 'whatsapp:+919920197525'
  if (process.env.NODE_ENV === 'dev') {
    defaultWANumber = 'whatsapp:+919920197525'
  } else if (process.env.NODE_ENV === 'qa') {
    defaultWANumber = 'whatsapp:+919920674826'
  } else if (process.env.NODE_ENV === 'production') {
    defaultWANumber = 'whatsapp:+919920674826'
  }
  return defaultWANumber
}

//export const ytdNetSalesFirstQuarter2122 = 6562906.80;
export const ytdNetSalesFirstQuarter2122 = 6562907
