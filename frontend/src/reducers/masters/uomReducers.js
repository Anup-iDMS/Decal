import { 
	UOM_CREATE_REQUEST,
	UOM_CREATE_SUCCESS,
	UOM_CREATE_FAIL,
	UOM_CREATE_RESET,

	UOM_DETAILS_REQUEST,
	UOM_DETAILS_SUCCESS,
	UOM_DETAILS_FAIL,
	// UOM_DETAILS_RESET,

	UOM_UPDATE_REQUEST,
	UOM_UPDATE_SUCCESS,
	UOM_UPDATE_FAIL,
	UOM_UPDATE_RESET,

	UOM_DELETE_REQUEST,
	UOM_DELETE_SUCCESS,
	UOM_DELETE_FAIL,
	// UOM_DELETE_RESET,

	UOM_LIST_REQUEST,
	UOM_LIST_SUCCESS,
	UOM_LIST_FAIL,
	UOM_LIST_RESET,

} from './../../constants/masters/uomConstants';

//1. create a uom record reducer
export const uomCreateReducer = (state={}, action) => {
   //logger("Inside UOM create Reducer ####### ", action.type)
   switch (action.type) {
      case UOM_CREATE_REQUEST:
         return {
            loading: true,
         }
      case UOM_CREATE_SUCCESS:
         return {
            loading: false,
            success: true,
            uom: action.payload,
         }
      case UOM_CREATE_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case UOM_CREATE_RESET:
         return {}
      default:
         return state
   }
}

//2. get a single record reducer
export const uomDetailsReducer = (state = { uom: {} }, action) => {
   //logger("Inside UOM Recucer and action is &&&&&&& ", action.type)
   switch (action.type) {
      case UOM_DETAILS_REQUEST:
         return { ...state, loading: true }
      case UOM_DETAILS_SUCCESS:
         return { loading: false, uom: action.payload }
      case UOM_DETAILS_FAIL:
         return { loading: false, error: action.payload, uom:{} }
      default:
         return state
   }
}

//3. update a single record reducer
export const uomUpdateReducer = (state = { uom: {} }, action) => {
   switch (action.type) {
      case UOM_UPDATE_REQUEST:
         return { loading: true }
      case UOM_UPDATE_SUCCESS:
         return { loading: false, success: true, uom: action.payload }
      case UOM_UPDATE_FAIL:
         return { loading: false, error: action.payload }
      case UOM_UPDATE_RESET:
         return { uom: {} }
      default:
         return state
   }
}

//4. delete a single record reducer
export const uomDeleteReducer = (state = {}, action) => {
   switch (action.type) {
      case UOM_DELETE_REQUEST:
         return { loading: true }
      case UOM_DELETE_SUCCESS:
         return { loading: false, success: true }
      case UOM_DELETE_FAIL:
         return { loading: false, error: action.payload }
      default:
         return state
   }
}

//5. get all uom records reducer
export const allUOMListReducer = (state = { uoms: [] }, action) => {
   switch (action.type) {
      case UOM_LIST_REQUEST:
         return {
            loading: true,
         }
      case UOM_LIST_SUCCESS:
         return {
            loading: false,
            uoms: action.payload,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case UOM_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case UOM_LIST_RESET:
         return { uoms: [] }
      default:
         return state
   }
}
