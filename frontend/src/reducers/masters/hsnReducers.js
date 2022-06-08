import { 
	HSN_CREATE_REQUEST,
	HSN_CREATE_SUCCESS,
	HSN_CREATE_FAIL,
	HSN_CREATE_RESET,

	HSN_DETAILS_REQUEST,
	HSN_DETAILS_SUCCESS,
	HSN_DETAILS_FAIL,
	// HSN_DETAILS_RESET,

	HSN_UPDATE_REQUEST,
	HSN_UPDATE_SUCCESS,
	HSN_UPDATE_FAIL,
	HSN_UPDATE_RESET,

	HSN_DELETE_REQUEST,
	HSN_DELETE_SUCCESS,
	HSN_DELETE_FAIL,
	// HSN_DELETE_RESET,

	HSN_LIST_REQUEST,
	HSN_LIST_SUCCESS,
	HSN_LIST_FAIL,
	HSN_LIST_RESET,

   // HSN_MASTER_LIST_REQUEST,
   // HSN_MASTER_LIST_SUCCESS,
   // HSN_MASTER_LIST_FAIL,
   // HSN_MASTER_LIST_RESET

} from '../../constants/masters/hsnConstants';

//1. create a hsnsac record reducer
export const hsnCreateReducer = (state={}, action) => {
   //logger("Inside HSN create Reducer ####### ", action.type)
   switch (action.type) {
      case HSN_CREATE_REQUEST:
         return {
            loading: true,
         }
      case HSN_CREATE_SUCCESS:
         return {
            loading: false,
            success: true,
            hsnsac: action.payload,
         }
      case HSN_CREATE_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case HSN_CREATE_RESET:
         return {}
      default:
         return state
   }
}

//2. get a single record reducer
export const hsnDetailsReducer = (state = { hsnsac: {} }, action) => {
   //logger("Inside HSN Recucer and action is &&&&&&& ", action.type)
   switch (action.type) {
      case HSN_DETAILS_REQUEST:
         return { ...state, loading: true }
      case HSN_DETAILS_SUCCESS:
         return { loading: false, hsnsac: action.payload }
      case HSN_DETAILS_FAIL:
         return { loading: false, error: action.payload, hsnsac:{} }
      default:
         return state
   }
}

//3. update a single record reducer
export const hsnUpdateReducer = (state = { hsnsac: {} }, action) => {
   switch (action.type) {
      case HSN_UPDATE_REQUEST:
         return { loading: true }
      case HSN_UPDATE_SUCCESS:
         return { loading: false, success: true, hsnsac: action.payload }
      case HSN_UPDATE_FAIL:
         return { loading: false, error: action.payload }
      case HSN_UPDATE_RESET:
         return { hsnsac: {} }
      default:
         return state
   }
}

//4. delete a single record reducer
export const hsnDeleteReducer = (state = {}, action) => {
   switch (action.type) {
      case HSN_DELETE_REQUEST:
         return { loading: true }
      case HSN_DELETE_SUCCESS:
         return { loading: false, success: true }
      case HSN_DELETE_FAIL:
         return { loading: false, error: action.payload }
      default:
         return state
   }
}

//5. get all hsn records reducer
export const allHSNListReducer = (state = { hsnsacCodes: [] }, action) => {
   switch (action.type) {
      case HSN_LIST_REQUEST:
         return {
            loading: true,
         }
      case HSN_LIST_SUCCESS:
         return {
            loading: false,
            hsnsacCodes: action.payload.hsnsacCodes,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case HSN_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case HSN_LIST_RESET:
         return { hsnsacCodes: [] }
      default:
         return state
   }
}
