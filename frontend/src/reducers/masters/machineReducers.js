import { 
	MACHINE_MASTER_CREATE_REQUEST,
	MACHINE_MASTER_CREATE_SUCCESS,
	MACHINE_MASTER_CREATE_FAIL,
	MACHINE_MASTER_CREATE_RESET,

	MACHINE_MASTER_DETAILS_REQUEST,
	MACHINE_MASTER_DETAILS_SUCCESS,
	MACHINE_MASTER_DETAILS_FAIL,
	// MACHINE_MASTER_DETAILS_RESET,

	MACHINE_MASTER_UPDATE_REQUEST,
	MACHINE_MASTER_UPDATE_SUCCESS,
	MACHINE_MASTER_UPDATE_FAIL,
	MACHINE_MASTER_UPDATE_RESET,

	MACHINE_MASTER_DELETE_REQUEST,
	MACHINE_MASTER_DELETE_SUCCESS,
	MACHINE_MASTER_DELETE_FAIL,
	// MACHINE_MASTER_DELETE_RESET,

	MACHINE_MASTER_LIST_REQUEST,
	MACHINE_MASTER_LIST_SUCCESS,
	MACHINE_MASTER_LIST_FAIL,
	MACHINE_MASTER_LIST_RESET,

   // MACHINE_MASTER_MASTER_LIST_REQUEST,
   // MACHINE_MASTER_MASTER_LIST_SUCCESS,
   // MACHINE_MASTER_MASTER_LIST_FAIL,
   // MACHINE_MASTER_MASTER_LIST_RESET

} from './../../constants/masters/machineConstants';

//1. create a machineMaster record reducer
export const machineMasterCreateReducer = (state={}, action) => {
   //logger("Inside MachineMaster create Reducer ####### ", action.type)
   switch (action.type) {
      case MACHINE_MASTER_CREATE_REQUEST:
         return {
            loading: true,
         }
      case MACHINE_MASTER_CREATE_SUCCESS:
         return {
            loading: false,
            success: true,
            machineMaster: action.payload,
         }
      case MACHINE_MASTER_CREATE_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case MACHINE_MASTER_CREATE_RESET:
         return {}
      default:
         return state
   }
}

//2. get a single record reducer
export const machineMasterDetailsReducer = (state = { machineMaster: {} }, action) => {
   //logger("Inside MachineMaster Recucer and action is &&&&&&& ", action.type)
   switch (action.type) {
      case MACHINE_MASTER_DETAILS_REQUEST:
         return { ...state, loading: true }
      case MACHINE_MASTER_DETAILS_SUCCESS:
         return { loading: false, machineMaster: action.payload }
      case MACHINE_MASTER_DETAILS_FAIL:
         return { loading: false, error: action.payload, machineMaster:{} }
      default:
         return state
   }
}

//3. update a single record reducer
export const machineMasterUpdateReducer = (state = { machineMaster: {} }, action) => {
   switch (action.type) {
      case MACHINE_MASTER_UPDATE_REQUEST:
         return { loading: true }
      case MACHINE_MASTER_UPDATE_SUCCESS:
         return { loading: false, success: true, machineMaster: action.payload }
      case MACHINE_MASTER_UPDATE_FAIL:
         return { loading: false, error: action.payload }
      case MACHINE_MASTER_UPDATE_RESET:
         return { machineMaster: {} }
      default:
         return state
   }
}

//4. delete a single record reducer
export const machineMasterDeleteReducer = (state = {}, action) => {
   switch (action.type) {
      case MACHINE_MASTER_DELETE_REQUEST:
         return { loading: true }
      case MACHINE_MASTER_DELETE_SUCCESS:
         return { loading: false, success: true }
      case MACHINE_MASTER_DELETE_FAIL:
         return { loading: false, error: action.payload }
      default:
         return state
   }
}

//5. get all machineMaster records reducer
export const allMachineMasterListReducer = (state = { machineMasters: [] }, action) => {
   switch (action.type) {
      case MACHINE_MASTER_LIST_REQUEST:
         return {
            loading: true,
         }
      case MACHINE_MASTER_LIST_SUCCESS:
         return {
            loading: false,
            machineMasters: action.payload,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case MACHINE_MASTER_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case MACHINE_MASTER_LIST_RESET:
         return { machineMasters: [] }
      default:
         return state
   }
}
