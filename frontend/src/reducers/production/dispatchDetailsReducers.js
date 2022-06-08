import { 
	DISPATCH_DETAILS_CREATE_REQUEST,
	DISPATCH_DETAILS_CREATE_SUCCESS,
	DISPATCH_DETAILS_CREATE_FAIL,
	DISPATCH_DETAILS_CREATE_RESET,

	DISPATCH_DETAILS_DETAILS_REQUEST,
	DISPATCH_DETAILS_DETAILS_SUCCESS,
	DISPATCH_DETAILS_DETAILS_FAIL,
	// DISPATCH_DETAILS_DETAILS_RESET,

	DISPATCH_DETAILS_UPDATE_REQUEST,
	DISPATCH_DETAILS_UPDATE_SUCCESS,
	DISPATCH_DETAILS_UPDATE_FAIL,
	DISPATCH_DETAILS_UPDATE_RESET,

	DISPATCH_DETAILS_DELETE_REQUEST,
	DISPATCH_DETAILS_DELETE_SUCCESS,
	DISPATCH_DETAILS_DELETE_FAIL,
	// DISPATCH_DETAILS_DELETE_RESET,

	DISPATCH_DETAILS_LIST_REQUEST,
	DISPATCH_DETAILS_LIST_SUCCESS,
	DISPATCH_DETAILS_LIST_FAIL,
	DISPATCH_DETAILS_LIST_RESET,

   DISPATCH_DETAILS_MASTER_LIST_REQUEST,
   DISPATCH_DETAILS_MASTER_LIST_SUCCESS,
   DISPATCH_DETAILS_MASTER_LIST_FAIL,
   DISPATCH_DETAILS_MASTER_LIST_RESET,
} from './../../constants/production/dispatchDetailsConstants'

//1. Create new Dispatch Details and update Delivery Note Record
export const dispatchDetailsCreateReducer = (state = { dispatchDetails: {} }, action) => {
   switch (action.type) {
      case DISPATCH_DETAILS_CREATE_REQUEST:
         return { loading: true }
      case DISPATCH_DETAILS_CREATE_SUCCESS:
         return { loading: false, success: true, dispatchDetails: action.payload }
      case DISPATCH_DETAILS_CREATE_FAIL:
         return { loading: false, error: action.payload }
      case DISPATCH_DETAILS_CREATE_RESET:
         return { dispatchDetails: {} }
      default:
         return state
   }
}

//3. update a single record reducer
export const dispatchDetailsUpdateReducer = (state = { dispatchDetails: {} }, action) => {
   switch (action.type) {
      case DISPATCH_DETAILS_UPDATE_REQUEST:
         return { loading: true }
      case DISPATCH_DETAILS_UPDATE_SUCCESS:
         return { loading: false, success: true, dispatchDetails: action.payload }
      case DISPATCH_DETAILS_UPDATE_FAIL:
         return { loading: false, error: action.payload }
      case DISPATCH_DETAILS_UPDATE_RESET:
         return { dispatchDetails: {} }
      default:
         return state
   }
}

//5. get all dispatchDetails records reducer
export const allDispatchDetailsListReducer = (state = { dispatchDetails: [] }, action) => {
   switch (action.type) {
      case DISPATCH_DETAILS_LIST_REQUEST:
         return {
            loading: true,
         }
      case DISPATCH_DETAILS_LIST_SUCCESS:
         return {
            loading: false,
            dispatchDetails: action.payload.dispatchDetails,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case DISPATCH_DETAILS_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case DISPATCH_DETAILS_LIST_RESET:
         return { dispatchDetails: [] }
      default:
         return state
   }
}


//6. get all DispatchDetails records reducer
export const masterDataForDispatchDetailsReducer = (state = { masterdataForDispatchDetails: {} }, action) => {
   //logger("Inside masterdataForDispatchDetailsReducer reducer ####### ", action.type)
   
   switch (action.type) {
       case DISPATCH_DETAILS_MASTER_LIST_REQUEST:
       return {
         loading: true,
       }
       case DISPATCH_DETAILS_MASTER_LIST_SUCCESS:
       return {
         loading: false,
         salesInvoices: action.payload.salesInvoices,
       }
       case DISPATCH_DETAILS_MASTER_LIST_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case DISPATCH_DETAILS_MASTER_LIST_RESET:
         return { masterdataForDispatchDetails: { } }
       default:
         return state
   }
}