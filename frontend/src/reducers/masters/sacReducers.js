import { 
	SAC_CREATE_REQUEST,
	SAC_CREATE_SUCCESS,
	SAC_CREATE_FAIL,
	SAC_CREATE_RESET,

	SAC_DETAILS_REQUEST,
	SAC_DETAILS_SUCCESS,
	SAC_DETAILS_FAIL,
	// SAC_DETAILS_RESET,

	SAC_UPDATE_REQUEST,
	SAC_UPDATE_SUCCESS,
	SAC_UPDATE_FAIL,
	SAC_UPDATE_RESET,

	SAC_DELETE_REQUEST,
	SAC_DELETE_SUCCESS,
	SAC_DELETE_FAIL,
	// SAC_DELETE_RESET,

	SAC_LIST_REQUEST,
	SAC_LIST_SUCCESS,
	SAC_LIST_FAIL,
	SAC_LIST_RESET,

   // SAC_MASTER_LIST_REQUEST,
   // SAC_MASTER_LIST_SUCCESS,
   // SAC_MASTER_LIST_FAIL,
   // SAC_MASTER_LIST_RESET

} from '../../constants/masters/sacConstants';

//1. create a sac record reducer
export const sacCreateReducer = (state={}, action) => {
   //logger("Inside HSN create Reducer ####### ", action.type)
   switch (action.type) {
      case SAC_CREATE_REQUEST:
         return {
            loading: true,
         }
      case SAC_CREATE_SUCCESS:
         return {
            loading: false,
            success: true,
            sac: action.payload,
         }
      case SAC_CREATE_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case SAC_CREATE_RESET:
         return {}
      default:
         return state
   }
}

//2. get a single record reducer
export const sacDetailsReducer = (state = { sac: {} }, action) => {
   //logger("Inside HSN Recucer and action is &&&&&&& ", action.type)
   switch (action.type) {
      case SAC_DETAILS_REQUEST:
         return { ...state, loading: true }
      case SAC_DETAILS_SUCCESS:
         return { loading: false, sac: action.payload }
      case SAC_DETAILS_FAIL:
         return { loading: false, error: action.payload, sac:{} }
      default:
         return state
   }
}

//3. update a single record reducer
export const sacUpdateReducer = (state = { sac: {} }, action) => {
   switch (action.type) {
      case SAC_UPDATE_REQUEST:
         return { loading: true }
      case SAC_UPDATE_SUCCESS:
         return { loading: false, success: true, sac: action.payload }
      case SAC_UPDATE_FAIL:
         return { loading: false, error: action.payload }
      case SAC_UPDATE_RESET:
         return { sac: {} }
      default:
         return state
   }
}

//4. delete a single record reducer
export const sacDeleteReducer = (state = {}, action) => {
   switch (action.type) {
      case SAC_DELETE_REQUEST:
         return { loading: true }
      case SAC_DELETE_SUCCESS:
         return { loading: false, success: true }
      case SAC_DELETE_FAIL:
         return { loading: false, error: action.payload }
      default:
         return state
   }
}

//5. get all sac records reducer
export const allSACListReducer = (state = { sacCodes: [] }, action) => {
   switch (action.type) {
      case SAC_LIST_REQUEST:
         return {
            loading: true,
         }
      case SAC_LIST_SUCCESS:
         return {
            loading: false,
            sacCodes: action.payload.sacCodes,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case SAC_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case SAC_LIST_RESET:
         return { sacCodes: [] }
      default:
         return state
   }
}
