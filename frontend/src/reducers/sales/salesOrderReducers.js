import { 
	SALES_ORDER_CREATE_REQUEST,
	SALES_ORDER_CREATE_SUCCESS,
	SALES_ORDER_CREATE_FAIL,
	SALES_ORDER_CREATE_RESET,

	SALES_ORDER_DETAILS_REQUEST,
	SALES_ORDER_DETAILS_SUCCESS,
	SALES_ORDER_DETAILS_FAIL,
	// SALES_ORDER_DETAILS_RESET,

	SALES_ORDER_UPDATE_REQUEST,
	SALES_ORDER_UPDATE_SUCCESS,
	SALES_ORDER_UPDATE_FAIL,
	SALES_ORDER_UPDATE_RESET,

	SALES_ORDER_DELETE_REQUEST,
	SALES_ORDER_DELETE_SUCCESS,
	SALES_ORDER_DELETE_FAIL,
	// SALES_ORDER_DELETE_RESET,

	SALES_ORDER_LIST_REQUEST,
	SALES_ORDER_LIST_SUCCESS,
	SALES_ORDER_LIST_FAIL,
	SALES_ORDER_LIST_RESET,

   SALES_ORDER_MASTER_LIST_REQUEST,
   SALES_ORDER_MASTER_LIST_SUCCESS,
   SALES_ORDER_MASTER_LIST_FAIL,
   SALES_ORDER_MASTER_LIST_RESET,

   BACK_ORDER_LIST_REQUEST,
   BACK_ORDER_LIST_SUCCESS,
   BACK_ORDER_LIST_FAIL,
   BACK_ORDER_LIST_RESET,

   SO_DETAILS_LIST_REQUEST,
   SO_DETAILS_LIST_SUCCESS,
   SO_DETAILS_LIST_FAIL,
   SO_DETAILS_LIST_RESET,

   CANCEL_SO_DETAILS_LIST_REQUEST,
   CANCEL_SO_DETAILS_LIST_SUCCESS,
   CANCEL_SO_DETAILS_LIST_FAIL,
   CANCEL_SO_DETAILS_LIST_RESET,

   BACK_ORDER_BY_JC_LIST_REQUEST,
   BACK_ORDER_BY_JC_LIST_SUCCESS,
   BACK_ORDER_BY_JC_LIST_FAIL,
   BACK_ORDER_BY_JC_LIST_RESET,

   SALES_ORDER_JC_MASTER_LIST_REQUEST,
   SALES_ORDER_JC_MASTER_LIST_SUCCESS,
   SALES_ORDER_JC_MASTER_LIST_FAIL,
   SALES_ORDER_JC_MASTER_LIST_RESET,

   OPEN_CUSTOMER_SO_LIST_REQUEST,
   OPEN_CUSTOMER_SO_LIST_SUCCESS,
   OPEN_CUSTOMER_SO_LIST_FAIL,
   OPEN_CUSTOMER_SO_LIST_RESET,

   OPEN_SALES_ORDER_REQUEST,
   OPEN_SALES_ORDER_SUCCESS,
   OPEN_SALES_ORDER_FAIL,
   OPEN_SALES_ORDER_RESET,

   CANCEL_SO_LINE_UPDATE_REQUEST,
   CANCEL_SO_LINE_UPDATE_SUCCESS,
   CANCEL_SO_LINE_UPDATE_FAIL,
   CANCEL_SO_LINE_UPDATE_RESET

} from './../../constants/sales/salesOrderConstants';

//1. create a salesOrder record reducer
export const salesOrderCreateReducer = (state={}, action) => {
   //logger("Inside SalesOrder create Reducer ####### ", action.type)
   switch (action.type) {
      case SALES_ORDER_CREATE_REQUEST:
         return {
            loading: true,
         }
      case SALES_ORDER_CREATE_SUCCESS:
         return {
            loading: false,
            success: true,
            salesOrder: action.payload,
         }
      case SALES_ORDER_CREATE_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case SALES_ORDER_CREATE_RESET:
         return {}
      default:
         return state
   }
}

//2. get a single record reducer
export const salesOrderDetailsReducer = (state = { salesOrder: {} }, action) => {
   //logger("Inside SalesOrder Recucer and action is &&&&&&& ", action.type)
   switch (action.type) {
      case SALES_ORDER_DETAILS_REQUEST:
         return { ...state, loading: true }
      case SALES_ORDER_DETAILS_SUCCESS:
         return { loading: false, salesOrder: action.payload }
      case SALES_ORDER_DETAILS_FAIL:
         return { loading: false, error: action.payload, salesOrder:{} }
      default:
         return state
   }
}

//3. update a single record reducer
export const salesOrderUpdateReducer = (state = { salesOrder: {} }, action) => {
   switch (action.type) {
      case SALES_ORDER_UPDATE_REQUEST:
         return { loading: true }
      case SALES_ORDER_UPDATE_SUCCESS:
         return { loading: false, success: true, salesOrder: action.payload }
      case SALES_ORDER_UPDATE_FAIL:
         return { loading: false, error: action.payload }
      case SALES_ORDER_UPDATE_RESET:
         return { salesOrder: {} }
      default:
         return state
   }
}

//4. delete a single record reducer
export const salesOrderDeleteReducer = (state = {}, action) => {
   switch (action.type) {
      case SALES_ORDER_DELETE_REQUEST:
         return { loading: true }
      case SALES_ORDER_DELETE_SUCCESS:
         return { loading: false, success: true }
      case SALES_ORDER_DELETE_FAIL:
         return { loading: false, error: action.payload }
      default:
         return state
   }
}

//5. get all salesOrder records reducer
export const allSalesOrderListReducer = (state = { salesOrders: [] }, action) => {
   switch (action.type) {
      case SALES_ORDER_LIST_REQUEST:
         return {
            loading: true,
         }
      case SALES_ORDER_LIST_SUCCESS:
         return {
            loading: false,
            salesOrders: action.payload.salesOrders,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case SALES_ORDER_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case SALES_ORDER_LIST_RESET:
         return { salesOrders: [] }
      default:
         return state
   }
}
 
//6. get all sales order records reducer
export const masterDataForSalesOrderReducer = (state = { masterdataForSalesOrder: {} }, action) => {
   //logger("Inside masterdataForSalesOrderReducer reducer ####### ", action.type)
   
   switch (action.type) {
       case SALES_ORDER_MASTER_LIST_REQUEST:
       return {
         loading: true,
       }
       case SALES_ORDER_MASTER_LIST_SUCCESS:
       return {
         loading: false,
         customers: action.payload.customers,
         autoIncrementedSalesOrderNo: action.payload.autoIncrementedSalesOrderNo,
       }
       case SALES_ORDER_MASTER_LIST_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case SALES_ORDER_MASTER_LIST_RESET:
         return { masterdataForSalesOrder: { } }
       default:
         return state
   }
}

//6.1 get all JC masters data
export const jcmasterDataForSalesOrderReducer = (state = { jcMasters: [] }, action) => {
   //logger("!!!!!!! ### $$$$$$ Inside jcmasterDataForSalesOrderReducer ####### ", action.state)
   
   switch (action.type) {
       case SALES_ORDER_JC_MASTER_LIST_REQUEST:
       return {
         loading: true,
       }
       case SALES_ORDER_JC_MASTER_LIST_SUCCESS:
       return {
         loading: false,
         jcMasters: action.payload.jcMasters,
       }
       case SALES_ORDER_JC_MASTER_LIST_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case SALES_ORDER_JC_MASTER_LIST_RESET:
         return { jcMasters: [] }
       default:
         return state
   }
}

//7. get all sales order records reducer
export const backOrdersBySOReducer = (state = { totalBackOrderValue: 0, salesOrders: [] }, action) => {

   
   
   switch (action.type) {
       case BACK_ORDER_LIST_REQUEST:
       return {
         loading: true,
       }
       case BACK_ORDER_LIST_SUCCESS:
       return {
         loading: false,
         salesOrders: action.payload.salesOrders,
		   totalBackOrderValue: action.payload.totalBackOrderValue,
       }
       case BACK_ORDER_LIST_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case BACK_ORDER_LIST_RESET:
         return { 
            totalBackOrderValue: 0,
            salesOrders: [] 
         }
       default:
         return state
   }
}

//8. get all sales order records reducer
export const soDetailsByLineReducer = (state = { salesOrders: [] }, action) => {
   //logger("Inside masterdataForSalesOrderReducer reducer ####### ", action.type)
   
   switch (action.type) {
       case SO_DETAILS_LIST_REQUEST:
       return {
         loading: true,
       }
       case SO_DETAILS_LIST_SUCCESS:
       return {
         loading: false,
         salesOrders: action.payload.salesOrders,
      }
       case SO_DETAILS_LIST_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case SO_DETAILS_LIST_RESET:
         return { salesOrders: [] }
       default:
         return state
   }
}

//8.1 get all sales order records reducer
export const cancelSODetailsByLineReducer = (state = { salesOrders: [] }, action) => {
   
   switch (action.type) {
       case CANCEL_SO_DETAILS_LIST_REQUEST:
       return {
         loading: true,
       }
       case CANCEL_SO_DETAILS_LIST_SUCCESS:
       return {
         loading: false,
         salesOrders: action.payload.salesOrders,
      }
       case CANCEL_SO_DETAILS_LIST_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case CANCEL_SO_DETAILS_LIST_RESET:
         return { salesOrders: [] }
       default:
         return state
   }
}

//9. get all sales order records reducer
export const backOrdersByJCReducer = (state = { totalBackOrderValue: 0, salesOrders: [] }, action) => {
   //logger("Inside backOrdersByJCReducer reducer ####### ", action.type)
   
   switch (action.type) {
       case BACK_ORDER_BY_JC_LIST_REQUEST:
       return {
         loading: true,
       }
       case BACK_ORDER_BY_JC_LIST_SUCCESS:
       return {
         loading: false,
         salesOrders: action.payload.salesOrders,
		   totalBackOrderValue: action.payload.totalBackOrderValue,
      }
       case BACK_ORDER_BY_JC_LIST_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case BACK_ORDER_BY_JC_LIST_RESET:
         return { 
            totalBackOrderValue: 0,
            salesOrders: [] 
         }
       default:
         return state
   }
}

//10. get all OPEN sales order for a customer records reducer
export const customerOpenSalesOrderListReducer = (state = { salesOrders: [] }, action) => {
   //console.log("inside customerOpenSalesOrderListReducer and action ", action)
   switch (action.type) {
       case OPEN_CUSTOMER_SO_LIST_REQUEST:
       return {
         loading: true,
       }
       case OPEN_CUSTOMER_SO_LIST_SUCCESS:
       return {
         loading: false,
         salesOrders: action.payload.salesOrders,
       }
       case OPEN_CUSTOMER_SO_LIST_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case OPEN_CUSTOMER_SO_LIST_RESET:
         return { 
            salesOrders: [] 
         }
       default:
         return state
   }
}

//11. get all sales order records reducer
export const balancedQtyBySOReducer = (state = { salesOrders: [] }, action) => {
   switch (action.type) {
       case OPEN_SALES_ORDER_REQUEST:
       return {
         loading: true,
       }
       case OPEN_SALES_ORDER_SUCCESS:
       return {
         loading: false,
         salesOrders: action.payload.salesOrders,
       }
       case OPEN_SALES_ORDER_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case OPEN_SALES_ORDER_RESET:
         return { 
            salesOrders: [] 
         }
       default:
         return state
   }
}

//12. update a single record reducer
export const salesOrderUpdateCancelQtyReducer = (state = { salesOrder: {} }, action) => {
   switch (action.type) {
      case CANCEL_SO_LINE_UPDATE_REQUEST:
         return { loading: true }
      case CANCEL_SO_LINE_UPDATE_SUCCESS:
         return { loading: false, success: true, salesOrder: action.payload }
      case CANCEL_SO_LINE_UPDATE_FAIL:
         return { loading: false, error: action.payload }
      case CANCEL_SO_LINE_UPDATE_RESET:
         return { salesOrder: {} }
      default:
         return state
   }
}