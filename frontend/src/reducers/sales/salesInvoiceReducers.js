import { 
	SALES_INVOICE_CREATE_REQUEST,
	SALES_INVOICE_CREATE_SUCCESS,
	SALES_INVOICE_CREATE_FAIL,
	SALES_INVOICE_CREATE_RESET,

	SALES_INVOICE_DETAILS_REQUEST,
	SALES_INVOICE_DETAILS_SUCCESS,
	SALES_INVOICE_DETAILS_FAIL,
	// SALES_INVOICE_DETAILS_RESET,

	SALES_INVOICE_UPDATE_REQUEST,
	SALES_INVOICE_UPDATE_SUCCESS,
	SALES_INVOICE_UPDATE_FAIL,
	SALES_INVOICE_UPDATE_RESET,

	SALES_INVOICE_DELETE_REQUEST,
	SALES_INVOICE_DELETE_SUCCESS,
	SALES_INVOICE_DELETE_FAIL,
	// SALES_INVOICE_DELETE_RESET,

	SALES_INVOICE_LIST_REQUEST,
	SALES_INVOICE_LIST_SUCCESS,
	SALES_INVOICE_LIST_FAIL,
	SALES_INVOICE_LIST_RESET,

   SALES_INVOICE_WITH_TAX_LIST_REQUEST,
   SALES_INVOICE_WITH_TAX_LIST_SUCCESS,
   SALES_INVOICE_WITH_TAX_LIST_FAIL,
   SALES_INVOICE_WITH_TAX_LIST_RESET,

   SALES_INVOICE_MASTER_LIST_REQUEST,
   SALES_INVOICE_MASTER_LIST_SUCCESS,
   SALES_INVOICE_MASTER_LIST_FAIL,
   SALES_INVOICE_MASTER_LIST_RESET,

   SALES_INVOICE_OPEN_LIST_REQUEST, 
   SALES_INVOICE_OPEN_LIST_SUCCESS,
   SALES_INVOICE_OPEN_LIST_FAIL,
   SALES_INVOICE_OPEN_LIST_RESET,

   SALES_INVOICE_APPROVED_LIST_REQUEST,
   SALES_INVOICE_APPROVED_LIST_SUCCESS,
   SALES_INVOICE_APPROVED_LIST_FAIL,
   SALES_INVOICE_APPROVED_LIST_RESET,

   CUSTOMER_SALES_INVOICE_LIST_REQUEST,
   CUSTOMER_SALES_INVOICE_LIST_SUCCESS,
   CUSTOMER_SALES_INVOICE_LIST_FAIL,
   CUSTOMER_SALES_INVOICE_LIST_RESET,

   SI_DETAILS_LIST_REQUEST,
   SI_DETAILS_LIST_SUCCESS,
   SI_DETAILS_LIST_FAIL,
   SI_DETAILS_LIST_RESET,

   SI_DISPATCH_DETAILS_LIST_REQUEST,
   SI_DISPATCH_DETAILS_LIST_SUCCESS,
   SI_DISPATCH_DETAILS_LIST_FAIL,
   SI_DISPATCH_DETAILS_LIST_RESET,

} from '../../constants/sales/salesInvoiceConstants';

//1. create a salesInvoice record reducer
export const salesInvoiceCreateReducer = (state={}, action) => {
   //logger("Inside SalesInvoice create Reducer ####### ", action.type)
   switch (action.type) {
      case SALES_INVOICE_CREATE_REQUEST:
         return {
            loading: true,
         }
      case SALES_INVOICE_CREATE_SUCCESS:
         return {
            loading: false,
            success: true,
            salesInvoice: action.payload,
         }
      case SALES_INVOICE_CREATE_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case SALES_INVOICE_CREATE_RESET:
         return {}
      default:
         return state
   }
}

//2. get a single record reducer
export const salesInvoiceDetailsReducer = (state = { salesInvoice: {} }, action) => {
   //logger("Inside SalesInvoice Recucer and action is &&&&&&& ", action.type)
   switch (action.type) {
      case SALES_INVOICE_DETAILS_REQUEST:
         return { ...state, loading: true }
      case SALES_INVOICE_DETAILS_SUCCESS:
         return { loading: false, salesInvoice: action.payload }
      case SALES_INVOICE_DETAILS_FAIL:
         return { loading: false, error: action.payload, salesInvoice:{} }
      default:
         return state
   }
}


//3. update a single record reducer
export const salesInvoiceUpdateReducer = (state = { salesInvoice: {} }, action) => {
   switch (action.type) {
      case SALES_INVOICE_UPDATE_REQUEST:
         return { loading: true }
      case SALES_INVOICE_UPDATE_SUCCESS:
         return { loading: false, success: true, salesInvoice: action.payload }
      case SALES_INVOICE_UPDATE_FAIL:
         return { loading: false, error: action.payload }
      case SALES_INVOICE_UPDATE_RESET:
         return { salesInvoice: {} }
      default:
         return state
   }
}

//4. delete a single record reducer
export const salesInvoiceDeleteReducer = (state = {}, action) => {
   switch (action.type) {
      case SALES_INVOICE_DELETE_REQUEST:
         return { loading: true }
      case SALES_INVOICE_DELETE_SUCCESS:
         return { loading: false, success: true }
      case SALES_INVOICE_DELETE_FAIL:
         return { loading: false, error: action.payload }
      default:
         return state
   }
}

//5. get all salesInvoice records reducer
export const allSalesInvoiceListReducer = (state = { salesInvoices: [] }, action) => {
   switch (action.type) {
      case SALES_INVOICE_LIST_REQUEST:
         return {
            loading: true,
         }
      case SALES_INVOICE_LIST_SUCCESS:
         return {
            loading: false,
            salesInvoices: action.payload.salesInvoices,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case SALES_INVOICE_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case SALES_INVOICE_LIST_RESET:
         return { salesInvoices: [] }
      default:
         return state
   }
}

//5.1 get all salesInvoice records reducer
export const allSalesInvoiceWithTaxListReducer = (state = { salesInvoices: [] }, action) => {
   switch (action.type) {
      case SALES_INVOICE_WITH_TAX_LIST_REQUEST:
         return {
            loading: true,
         }
      case SALES_INVOICE_WITH_TAX_LIST_SUCCESS:
         return {
            loading: false,
            salesInvoices: action.payload.salesInvoices,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case SALES_INVOICE_WITH_TAX_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case SALES_INVOICE_WITH_TAX_LIST_RESET:
         return { salesInvoices: [] }
      default:
         return state
   }
}

//6. get all SalesInvoice records reducer
export const masterDataForSalesInvoiceReducer = (state = { masterdataForSalesInvoice: {} }, action) => {
   //logger("Inside masterdataForSalesInvoiceReducer reducer ####### ", action.type)
   
   switch (action.type) {
       case SALES_INVOICE_MASTER_LIST_REQUEST:
       return {
         loading: true,
       }
       case SALES_INVOICE_MASTER_LIST_SUCCESS:
       return {
         loading: false,
         autoIncrementedSINo: action.payload.autoIncrementedSINo,
       }
       case SALES_INVOICE_MASTER_LIST_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case SALES_INVOICE_MASTER_LIST_RESET:
         return { masterdataForSalesInvoice: {} }
       default:
         return state
   }
}

//7. get all salesInvoice records reducer
export const allSalesInvoiceListForCustomerReducer = (state = { salesInvoices: [] }, action) => {
   //logger("Reducer ",  action.payload)
   switch (action.type) {
      case CUSTOMER_SALES_INVOICE_LIST_REQUEST:
         return {
            loading: true,
         }
      case CUSTOMER_SALES_INVOICE_LIST_SUCCESS:
         return {
            loading: false,
            salesInvoices: action.payload
         }
      case CUSTOMER_SALES_INVOICE_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case CUSTOMER_SALES_INVOICE_LIST_RESET:
         return { salesInvoices: [] }
      default:
         return state
   }
}

//8. get all sales order records reducer
export const siDetailsByLineReducer = (state = { salesInvoices: [] }, action) => {
   //logger("Inside masterdataForSalesOrderReducer reducer ####### ", action.type)
   
   switch (action.type) {
       case SI_DETAILS_LIST_REQUEST:
       return {
         loading: true,
       }
       case SI_DETAILS_LIST_SUCCESS:
       return {
         loading: false,
         salesInvoices: action.payload.salesInvoices,
      }
       case SI_DETAILS_LIST_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case SI_DETAILS_LIST_RESET:
         return { salesInvoices: [] }
       default:
         return state
   }
}

//9. get all sales order records reducer
export const siDetailsByDispatchReducer = (state = { salesInvoices: [] }, action) => {
   
   switch (action.type) {
       case SI_DISPATCH_DETAILS_LIST_REQUEST:
       return {
         loading: true,
       }
       case SI_DISPATCH_DETAILS_LIST_SUCCESS:
       return {
         loading: false,
         salesInvoices: action.payload.salesInvoices,
      }
       case SI_DISPATCH_DETAILS_LIST_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case SI_DISPATCH_DETAILS_LIST_RESET:
         return { salesInvoices: [] }
       default:
         return state
   }
}