import { 
	JOB_CARD_CREATE_REQUEST,
	JOB_CARD_CREATE_SUCCESS,
	JOB_CARD_CREATE_FAIL,
	JOB_CARD_CREATE_RESET,

	JOB_CARD_DETAILS_REQUEST,
	JOB_CARD_DETAILS_SUCCESS,
	JOB_CARD_DETAILS_FAIL,
	// JOB_CARD_DETAILS_RESET,

	JOB_CARD_UPDATE_REQUEST,
	JOB_CARD_UPDATE_SUCCESS,
	JOB_CARD_UPDATE_FAIL,
	JOB_CARD_UPDATE_RESET,

	JOB_CARD_DELETE_REQUEST,
	JOB_CARD_DELETE_SUCCESS,
	JOB_CARD_DELETE_FAIL,
	// JOB_CARD_DELETE_RESET,

	JOB_CARD_LIST_REQUEST,
	JOB_CARD_LIST_SUCCESS,
	JOB_CARD_LIST_FAIL,
	JOB_CARD_LIST_RESET,

   JOB_CARD_MASTER_LIST_REQUEST,
   JOB_CARD_MASTER_LIST_SUCCESS,
   JOB_CARD_MASTER_LIST_FAIL,
   JOB_CARD_MASTER_LIST_RESET,
   
   YIELD_REPORT_REQUEST,
   YIELD_REPORT_SUCCESS,
   YIELD_REPORT_FAIL,
   YIELD_REPORT_RESET

} from './../../constants/production/jobCardConstants';

//1. create a jobCard record reducer
export const jobCardCreateReducer = (state={}, action) => {
   //logger("Inside JobCard create Reducer ####### ", action.type)
   switch (action.type) {
      case JOB_CARD_CREATE_REQUEST:
         return {
            loading: true,
         }
      case JOB_CARD_CREATE_SUCCESS:
         return {
            loading: false,
            success: true,
            jobCard: action.payload,
         }
      case JOB_CARD_CREATE_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case JOB_CARD_CREATE_RESET:
         return {}
      default:
         return state
   }
}

//2. get a single record reducer
export const jobCardDetailsReducer = (state = { jobCard: {} }, action) => {
   //logger("Inside JobCard Recucer and action is &&&&&&& ", action.type)
   switch (action.type) {
      case JOB_CARD_DETAILS_REQUEST:
         return { ...state, loading: true }
      case JOB_CARD_DETAILS_SUCCESS:
         return { loading: false, jobCard: action.payload }
      case JOB_CARD_DETAILS_FAIL:
         return { loading: false, error: action.payload, jobCard:{} }
      default:
         return state
   }
}

//3. update a single record reducer
export const jobCardUpdateReducer = (state = { jobCard: {} }, action) => {
   switch (action.type) {
      case JOB_CARD_UPDATE_REQUEST:
         return { loading: true }
      case JOB_CARD_UPDATE_SUCCESS:
         return { loading: false, success: true, jobCard: action.payload }
      case JOB_CARD_UPDATE_FAIL:
         return { loading: false, error: action.payload }
      case JOB_CARD_UPDATE_RESET:
         return { jobCard: {} }
      default:
         return state
   }
}

//4. delete a single record reducer
export const jobCardDeleteReducer = (state = {}, action) => {
   switch (action.type) {
      case JOB_CARD_DELETE_REQUEST:
         return { loading: true }
      case JOB_CARD_DELETE_SUCCESS:
         return { loading: false, success: true }
      case JOB_CARD_DELETE_FAIL:
         return { loading: false, error: action.payload }
      default:
         return state
   }
}

//5. get all jobCard records reducer
export const allJobCardListReducer = (state = { jobCards: [] }, action) => {
   switch (action.type) {
      case JOB_CARD_LIST_REQUEST:
         return {
            loading: true,
         }
      case JOB_CARD_LIST_SUCCESS:
         return {
            loading: false,
            jobCards: action.payload.jobCards,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case JOB_CARD_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case JOB_CARD_LIST_RESET:
         return { jobCards: [] }
      default:
         return state
   }
}
 
//6. get all job card records reducer
export const masterDataForJobCardReducer = (state = { masterdataForJobCard: {} }, action) => {
   //logger("Inside masterdataForJobCardReducer reducer ####### ", action.type)
   
   switch (action.type) {
       case JOB_CARD_MASTER_LIST_REQUEST:
       return {
         loading: true,
       }
       case JOB_CARD_MASTER_LIST_SUCCESS:
       return {
         loading: false,
         jcMasters: action.payload.jcMasters,
         autoIncrementedJobCardNo: action.payload.autoIncrementedJobCardNo,
       }
       case JOB_CARD_MASTER_LIST_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case JOB_CARD_MASTER_LIST_RESET:
         return { masterdataForJobCard: { } }
       default:
         return state
   }
}

//7. get yield report records reducer
export const yieldReportReducer = (state = { jobCards: [] }, action) => {
   //logger("Inside yieldReportReducer reducer ####### ", action.type)
   
   switch (action.type) {
       case YIELD_REPORT_REQUEST:
       return {
         loading: true,
       }
       case YIELD_REPORT_SUCCESS:
       return {
         loading: false,
         jobCards: action.payload.jobCards,
       }
       case YIELD_REPORT_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case YIELD_REPORT_RESET:
         return { jobCards: { } }
       default:
         return state
   }
}