import { 
   PDIR_CREATE_REQUEST,
	PDIR_CREATE_SUCCESS,
	PDIR_CREATE_FAIL,
	PDIR_CREATE_RESET,

	PDIR_DETAILS_REQUEST,
	PDIR_DETAILS_SUCCESS,
	PDIR_DETAILS_FAIL,
	PDIR_DETAILS_RESET,

	PDIR_UPDATE_REQUEST,
	PDIR_UPDATE_SUCCESS,
	PDIR_UPDATE_FAIL,
	PDIR_UPDATE_RESET,

	PDIR_DELETE_REQUEST,
	PDIR_DELETE_SUCCESS,
	PDIR_DELETE_FAIL,
	PDIR_DELETE_RESET,

	PDIR_LIST_REQUEST,
	PDIR_LIST_SUCCESS,
	PDIR_LIST_FAIL,
	PDIR_LIST_RESET,
  
  PDIR_MASTER_LIST_REQUEST,
  PDIR_MASTER_LIST_SUCCESS,
  PDIR_MASTER_LIST_FAIL,
  PDIR_MASTER_LIST_RESET, 
 } from '../../constants/qa/pdirConstants';

//1. create a pdir record reducer
export const pdirCreateReducer = (state={}, action) => {
  //console.log("Inside PDIR create Reducer ####### ", action.type)
  switch (action.type) {
    case PDIR_CREATE_REQUEST:
      return {
        loading: true,
      }
    case PDIR_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        pdir: action.payload,
      }
    case PDIR_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case PDIR_CREATE_RESET:
      return {}
    default:
      return state
  }
}

//2. get a single record reducer
export const pdirDetailsReducer = (state = { pdir: {} }, action) => {
  //console.log("Inside PDIR Recucer and action is &&&&&&& ", action.type)
  switch (action.type) {
    case PDIR_DETAILS_REQUEST:
      return { ...state, loading: true }
    case PDIR_DETAILS_SUCCESS:
      return { loading: false, pdir: action.payload }
    case PDIR_DETAILS_FAIL:
      return { loading: false, error: action.payload, pdir:{} }
    default:
      return state
  }
}

//3. update a single record reducer
export const pdirUpdateReducer = (state = { pdir: {} }, action) => {
  switch (action.type) {
    case PDIR_UPDATE_REQUEST:
      return { loading: true }
    case PDIR_UPDATE_SUCCESS:
      return { loading: false, success: true, pdir: action.payload }
    case PDIR_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case PDIR_UPDATE_RESET:
      return { pdir: {} }
    default:
      return state
  }
}

//4. delete a single record reducer
export const pdirDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PDIR_DELETE_REQUEST:
      return { loading: true }
    case PDIR_DELETE_SUCCESS:
      return { loading: false, success: true }
    case PDIR_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

//5. get all pdir records reducer
export const allPDIRListReducer = (state = { pdirs: [] }, action) => {
  switch (action.type) {
    case PDIR_LIST_REQUEST:
      return {
        loading: true,
      }
    case PDIR_LIST_SUCCESS:
      return {
        loading: false,
        pdirs: action.payload.pdirs,
        pages: action.payload.pages,
        page: action.payload.page,
      }
    case PDIR_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case PDIR_LIST_RESET:
      return { pdirs: [] }
    default:
      return state
  }
}

//6. get all PDIR records reducer
export const masterDataForPDIRReducer = (state = { masterdataForPDIR: {} }, action) => {
  //console.log("Inside masterdataForPDIRReducer reducer ####### ", action.type)
  
  switch (action.type) {
      case PDIR_MASTER_LIST_REQUEST:
      return {
        loading: true,
      }
      case PDIR_MASTER_LIST_SUCCESS:
      return {
        loading: false,
        autoIncrementePDIRNo: action.payload.autoIncrementePDIRNo,
        prodCategories: action.payload.prodCategories,
        prodCodes: action.payload.prodCodes,
        inspectionparams: action.payload.inspectionparams,
        inspectionmethods: action.payload.inspectionmethods,
        customers: action.payload.customers,
        pdirTemplates: action.payload.pdirTemplates,
      }
      case PDIR_MASTER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
      case PDIR_MASTER_LIST_RESET:
        return { masterdataForPDIR: { } }
      default:
        return state
  }
}