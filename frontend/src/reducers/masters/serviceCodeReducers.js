import { 
	SERVICE_CODE_CREATE_REQUEST,
	SERVICE_CODE_CREATE_SUCCESS,
	SERVICE_CODE_CREATE_FAIL,
	SERVICE_CODE_CREATE_RESET,

	SERVICE_CODE_DETAILS_REQUEST,
	SERVICE_CODE_DETAILS_SUCCESS,
	SERVICE_CODE_DETAILS_FAIL,
	// SERVICE_CODE_DETAILS_RESET,

	SERVICE_CODE_UPDATE_REQUEST,
	SERVICE_CODE_UPDATE_SUCCESS,
	SERVICE_CODE_UPDATE_FAIL,
	SERVICE_CODE_UPDATE_RESET,

	SERVICE_CODE_DELETE_REQUEST,
	SERVICE_CODE_DELETE_SUCCESS,
	SERVICE_CODE_DELETE_FAIL,
	// SERVICE_CODE_DELETE_RESET,

	SERVICE_CODE_LIST_REQUEST,
	SERVICE_CODE_LIST_SUCCESS,
	SERVICE_CODE_LIST_FAIL,
	SERVICE_CODE_LIST_RESET,

   SERVICE_CODE_MASTER_DATA_REQUEST,
   SERVICE_CODE_MASTER_DATA_SUCCESS,
   SERVICE_CODE_MASTER_DATA_FAIL,
   SERVICE_CODE_MASTER_DATA_RESET,

} from './../../constants/masters/serviceCodeConstants';

//1. create a serviceCode record reducer
export const serviceCodeCreateReducer = (state={}, action) => {
   //logger("Inside ServiceCode create Reducer ####### ", action.type)
   switch (action.type) {
      case SERVICE_CODE_CREATE_REQUEST:
         return {
            loading: true,
         }
      case SERVICE_CODE_CREATE_SUCCESS:
         return {
            loading: false,
            success: true,
            serviceCode: action.payload,
         }
      case SERVICE_CODE_CREATE_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case SERVICE_CODE_CREATE_RESET:
         return {}
      default:
         return state
   }
}

//2. get a single record reducer
export const serviceCodeDetailsReducer = (state = { serviceCode: {} }, action) => {
   //logger("Inside ServiceCode Recucer and action is &&&&&&& ", action.type)
   switch (action.type) {
      case SERVICE_CODE_DETAILS_REQUEST:
         return { ...state, loading: true }
      case SERVICE_CODE_DETAILS_SUCCESS:
         return { loading: false, serviceCode: action.payload }
      case SERVICE_CODE_DETAILS_FAIL:
         return { loading: false, error: action.payload, serviceCode:{} }
      default:
         return state
   }
}

//3. update a single record reducer
export const serviceCodeUpdateReducer = (state = { serviceCode: {} }, action) => {
   switch (action.type) {
      case SERVICE_CODE_UPDATE_REQUEST:
         return { loading: true }
      case SERVICE_CODE_UPDATE_SUCCESS:
         return { loading: false, success: true, serviceCode: action.payload }
      case SERVICE_CODE_UPDATE_FAIL:
         return { loading: false, error: action.payload }
      case SERVICE_CODE_UPDATE_RESET:
         return { serviceCode: {} }
      default:
         return state
   }
}

//4. delete a single record reducer
export const serviceCodeDeleteReducer = (state = {}, action) => {
   switch (action.type) {
      case SERVICE_CODE_DELETE_REQUEST:
         return { loading: true }
      case SERVICE_CODE_DELETE_SUCCESS:
         return { loading: false, success: true }
      case SERVICE_CODE_DELETE_FAIL:
         return { loading: false, error: action.payload }
      default:
         return state
   }
}

//5. get all serviceCode records reducer
export const allServiceCodeListReducer = (state = { serviceCodes: [] }, action) => {
   switch (action.type) {
      case SERVICE_CODE_LIST_REQUEST:
         return {
            loading: true,
         }
      case SERVICE_CODE_LIST_SUCCESS:
         return {
            loading: false,
            serviceCodes: action.payload,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case SERVICE_CODE_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case SERVICE_CODE_LIST_RESET:
         return { serviceCodes: [] }
      default:
         return state
   }
}

//6. get all Master Data for Service Code records reducer
export const masterDataForServiceCodeReducer = (state = { masterdataForServiceCode: {} }, action) => {
   switch (action.type) {
       case SERVICE_CODE_MASTER_DATA_REQUEST:
       return {
         loading: true,
       }
       case SERVICE_CODE_MASTER_DATA_SUCCESS:
       return {
         loading: false,
         sacs: action.payload.sacs,
         autoIncrementeServiceCodeNo: action.payload.autoIncrementeServiceCodeNo,
       }
       case SERVICE_CODE_MASTER_DATA_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case SERVICE_CODE_MASTER_DATA_RESET:
         return { masterdataForServiceCode: { } }
       default:
         return state
   }
 }