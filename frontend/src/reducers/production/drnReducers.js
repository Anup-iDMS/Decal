import { 
	DRN_CREATE_REQUEST,
	DRN_CREATE_SUCCESS,
	DRN_CREATE_FAIL,
	DRN_CREATE_RESET,

	DRN_DETAILS_REQUEST,
	DRN_DETAILS_SUCCESS,
	DRN_DETAILS_FAIL,
	// DRN_DETAILS_RESET,

	DRN_UPDATE_REQUEST,
	DRN_UPDATE_SUCCESS,
	DRN_UPDATE_FAIL,
	DRN_UPDATE_RESET,

	DRN_DELETE_REQUEST,
	DRN_DELETE_SUCCESS,
	DRN_DELETE_FAIL,
	// DRN_DELETE_RESET,

	DRN_LIST_REQUEST,
	DRN_LIST_SUCCESS,
	DRN_LIST_FAIL,
	DRN_LIST_RESET,

   DRN_MASTER_LIST_REQUEST,
   DRN_MASTER_LIST_SUCCESS,
   DRN_MASTER_LIST_FAIL,
   DRN_MASTER_LIST_RESET,

   DRN_OPEN_LIST_REQUEST, 
   DRN_OPEN_LIST_SUCCESS,
   DRN_OPEN_LIST_FAIL,
   DRN_OPEN_LIST_RESET,

   DRN_APPROVED_LIST_REQUEST,
   DRN_APPROVED_LIST_SUCCESS,
   DRN_APPROVED_LIST_FAIL,
   DRN_APPROVED_LIST_RESET,

   DRN_REJECTED_LIST_REQUEST,
   DRN_REJECTED_LIST_SUCCESS,
   DRN_REJECTED_LIST_FAIL,
   DRN_REJECTED_LIST_RESET

} from '../../constants/production/drnConstants';

//1. create a drn record reducer
export const drnCreateReducer = (state={}, action) => {
   //logger("Inside DRN create Reducer ####### ", action.type)
   switch (action.type) {
      case DRN_CREATE_REQUEST:
         return {
            loading: true,
         }
      case DRN_CREATE_SUCCESS:
         return {
            loading: false,
            success: true,
            drn: action.payload,
         }
      case DRN_CREATE_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case DRN_CREATE_RESET:
         return {}
      default:
         return state
   }
}

//2. get a single record reducer
export const drnDetailsReducer = (state = { drn: {} }, action) => {
   //logger("Inside DRN Recucer and action is &&&&&&& ", action.type)
   switch (action.type) {
      case DRN_DETAILS_REQUEST:
         return { ...state, loading: true }
      case DRN_DETAILS_SUCCESS:
         return { loading: false, drn: action.payload }
      case DRN_DETAILS_FAIL:
         return { loading: false, error: action.payload, drn:{} }
      default:
         return state
   }
}


//3. update a single record reducer
export const drnUpdateReducer = (state = { drn: {} }, action) => {
   switch (action.type) {
      case DRN_UPDATE_REQUEST:
         return { loading: true }
      case DRN_UPDATE_SUCCESS:
         return { loading: false, success: true, drn: action.payload }
      case DRN_UPDATE_FAIL:
         return { loading: false, error: action.payload }
      case DRN_UPDATE_RESET:
         return { drn: {} }
      default:
         return state
   }
}

//4. delete a single record reducer
export const drnDeleteReducer = (state = {}, action) => {
   switch (action.type) {
      case DRN_DELETE_REQUEST:
         return { loading: true }
      case DRN_DELETE_SUCCESS:
         return { loading: false, success: true }
      case DRN_DELETE_FAIL:
         return { loading: false, error: action.payload }
      default:
         return state
   }
}

//5. get all drn records reducer
export const allDRNListReducer = (state = { drns: [] }, action) => {
   switch (action.type) {
      case DRN_LIST_REQUEST:
         return {
            loading: true,
         }
      case DRN_LIST_SUCCESS:
         return {
            loading: false,
            drns: action.payload.drns,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case DRN_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case DRN_LIST_RESET:
         return { drns: [] }
      default:
         return state
   }
}

//6. get all DRN records reducer
export const masterDataForDRNReducer = (state = { masterdataForDRN: {} }, action) => {
   //logger("Inside masterdataForDRNReducer reducer ####### ", action.type)
   
   switch (action.type) {
       case DRN_MASTER_LIST_REQUEST:
       return {
         loading: true,
       }
       case DRN_MASTER_LIST_SUCCESS:
       return {
         loading: false,
         customers: action.payload.customers,
         autoIncrementedDRNNo: action.payload.autoIncrementedDRNNo,
       }
       case DRN_MASTER_LIST_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case DRN_MASTER_LIST_RESET:
         return { masterdataForDRN: { } }
       default:
         return state
   }
}

/** Below functions are for DRN Approval */

//7. get all drn records reducer
export const allOpenDRNListReducer = (state = { loading: true, drns: [] }, action) => {
   switch (action.type) {
      case DRN_OPEN_LIST_REQUEST:
         return {
            loading: true,
         }
      case DRN_OPEN_LIST_SUCCESS:
         return {
            loading: false,
            drns: action.payload.drns,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case DRN_OPEN_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case DRN_OPEN_LIST_RESET:
         return { drns: [] }
      default:
         return state
   }
}

//8. get all "Approved" drn records reducer
export const allApprovedDRNListReducer = (state = { loading: true, drns: [] }, action) => {
   switch (action.type) {
      case DRN_APPROVED_LIST_REQUEST:
         return {
            loading: true,
         }
      case DRN_APPROVED_LIST_SUCCESS:
         return {
            loading: false,
            drns: action.payload.drns,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case DRN_APPROVED_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case DRN_APPROVED_LIST_RESET:
         return { drns: [] }
      default:
         return state
   }
}

//9. get all "Rejected" drn records reducer
export const allRejectedDRNListReducer = (state = { loading: true, drns: [] }, action) => {
   switch (action.type) {
      case DRN_REJECTED_LIST_REQUEST:
         return {
            loading: true,
         }
      case DRN_REJECTED_LIST_SUCCESS:
         return {
            loading: false,
            drns: action.payload.drns,
         }
      case DRN_REJECTED_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case DRN_REJECTED_LIST_RESET:
         return { drns: [] }
      default:
         return state
   }
}