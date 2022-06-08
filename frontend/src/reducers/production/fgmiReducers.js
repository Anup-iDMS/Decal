import { 
	FGMI_CREATE_REQUEST,
	FGMI_CREATE_SUCCESS,
	FGMI_CREATE_FAIL,
	FGMI_CREATE_RESET,

	FGMI_DETAILS_REQUEST,
	FGMI_DETAILS_SUCCESS,
	FGMI_DETAILS_FAIL,
	// FGMI_DETAILS_RESET,

	FGMI_UPDATE_REQUEST,
	FGMI_UPDATE_SUCCESS,
	FGMI_UPDATE_FAIL,
	FGMI_UPDATE_RESET,

	FGMI_DELETE_REQUEST,
	FGMI_DELETE_SUCCESS,
	FGMI_DELETE_FAIL,
	// FGMI_DELETE_RESET,

	FGMI_LIST_REQUEST,
	FGMI_LIST_SUCCESS,
	FGMI_LIST_FAIL,
	FGMI_LIST_RESET,

   FGMI_MASTER_LIST_REQUEST,
   FGMI_MASTER_LIST_SUCCESS,
   FGMI_MASTER_LIST_FAIL,
   FGMI_MASTER_LIST_RESET,

   FGMI_BACTH_LIST_BY_JC_REQUEST,
   FGMI_BACTH_LIST_BY_JC_SUCCESS,
   FGMI_BACTH_LIST_BY_JC_FAIL,
   FGMI_BACTH_LIST_BY_JC_RESET,

   //FGM Correction
   FGMI_CORRECTION_UPDATE_REQUEST,
   FGMI_CORRECTION_UPDATE_SUCCESS,
   FGMI_CORRECTION_UPDATE_FAIL,
   FGMI_CORRECTION_UPDATE_RESET

} from './../../constants/production/fgmiConstants';

//1. create a fgmi record reducer
export const fgmiCreateReducer = (state={}, action) => {
   //logger("Inside FGMI create Reducer ####### ", action.type)
   switch (action.type) {
      case FGMI_CREATE_REQUEST:
         return {
            loading: true,
         }
      case FGMI_CREATE_SUCCESS:
         return {
            loading: false,
            success: true,
            fgmi: action.payload,
         }
      case FGMI_CREATE_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case FGMI_CREATE_RESET:
         return {}
      default:
         return state
   }
}

//2. get a single record reducer
export const fgmiDetailsReducer = (state = { fgmi: {} }, action) => {
   //logger("Inside FGMI Recucer and action is &&&&&&& ", action.type)
   switch (action.type) {
      case FGMI_DETAILS_REQUEST:
         return { ...state, loading: true }
      case FGMI_DETAILS_SUCCESS:
         return { loading: false, fgmi: action.payload }
      case FGMI_DETAILS_FAIL:
         return { loading: false, error: action.payload, fgmi:{} }
      default:
         return state
   }
}

//3. update a single record reducer
export const fgmiUpdateReducer = (state = { fgmi: {} }, action) => {
   switch (action.type) {
      case FGMI_UPDATE_REQUEST:
         return { loading: true }
      case FGMI_UPDATE_SUCCESS:
         return { loading: false, success: true, fgmi: action.payload }
      case FGMI_UPDATE_FAIL:
         return { loading: false, error: action.payload }
      case FGMI_UPDATE_RESET:
         return { fgmi: {} }
      default:
         return state
   }
}

//4. delete a single record reducer
export const fgmiDeleteReducer = (state = {}, action) => {
   switch (action.type) {
      case FGMI_DELETE_REQUEST:
         return { loading: true }
      case FGMI_DELETE_SUCCESS:
         return { loading: false, success: true }
      case FGMI_DELETE_FAIL:
         return { loading: false, error: action.payload }
      default:
         return state
   }
}

//5. get all fgmi records reducer
export const allFGMIListReducer = (state = { fgmis: [] }, action) => {
   switch (action.type) {
      case FGMI_LIST_REQUEST:
         return {
            loading: true,
         }
      case FGMI_LIST_SUCCESS:
         return {
            loading: false,
            fgmis: action.payload.fgmis,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case FGMI_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case FGMI_LIST_RESET:
         return { fgmis: [] }
      default:
         return state
   }
}
 
//6. get all fgmi records reducer
export const masterDataForFGMIReducer = (state = { masterdataForFGMI: {} }, action) => {
   //logger("Inside masterdataForFGMIReducer reducer ####### ", action.type)
   
   switch (action.type) {
       case FGMI_MASTER_LIST_REQUEST:
       return {
         loading: true,
       }
       case FGMI_MASTER_LIST_SUCCESS:
       return {
         loading: false,
         jcMasters: action.payload.jcMasters,
         autoIncrementedFGMINo: action.payload.autoIncrementedFGMINo,
       }
       case FGMI_MASTER_LIST_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case FGMI_MASTER_LIST_RESET:
         return { masterdataForFGMI: { } }
       default:
         return state
   }
}

//7. get all fgmi records reducer
export const allFGMIBatchesByJCListReducer = (state = { fgmis: [] }, action) => {
   switch (action.type) {
      case FGMI_BACTH_LIST_BY_JC_REQUEST:
         return {
            loading: true,
         }
      case FGMI_BACTH_LIST_BY_JC_SUCCESS:
         return {
            loading: false,
            fgmis: action.payload.fgmis
         }
      case FGMI_BACTH_LIST_BY_JC_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case FGMI_BACTH_LIST_BY_JC_RESET:
         return { fgmis: [] }
      default:
         return state
   }
}

//8. update a single record reducer
export const fgmiUpdateFGMICorrectionReducer = (state = { fgmi: {} }, action) => {
   switch (action.type) {
      case FGMI_CORRECTION_UPDATE_REQUEST:
         return { loading: true }
      case FGMI_CORRECTION_UPDATE_SUCCESS:
         return { loading: false, success: true, fgmi: action.payload }
      case FGMI_CORRECTION_UPDATE_FAIL:
         return { loading: false, error: action.payload }
      case FGMI_CORRECTION_UPDATE_RESET:
         return { fgmi: {} }
      default:
         return state
   }
}