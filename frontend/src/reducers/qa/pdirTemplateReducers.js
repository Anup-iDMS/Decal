import { 
   PDIR_TEMPLATE_CREATE_REQUEST,
	PDIR_TEMPLATE_CREATE_SUCCESS,
	PDIR_TEMPLATE_CREATE_FAIL,
	PDIR_TEMPLATE_CREATE_RESET,

	PDIR_TEMPLATE_DETAILS_REQUEST,
	PDIR_TEMPLATE_DETAILS_SUCCESS,
	PDIR_TEMPLATE_DETAILS_FAIL,
	PDIR_TEMPLATE_DETAILS_RESET,

	PDIR_TEMPLATE_UPDATE_REQUEST,
	PDIR_TEMPLATE_UPDATE_SUCCESS,
	PDIR_TEMPLATE_UPDATE_FAIL,
	PDIR_TEMPLATE_UPDATE_RESET,

	PDIR_TEMPLATE_DELETE_REQUEST,
	PDIR_TEMPLATE_DELETE_SUCCESS,
	PDIR_TEMPLATE_DELETE_FAIL,
	PDIR_TEMPLATE_DELETE_RESET,

	PDIR_TEMPLATE_LIST_REQUEST,
	PDIR_TEMPLATE_LIST_SUCCESS,
	PDIR_TEMPLATE_LIST_FAIL,
	PDIR_TEMPLATE_LIST_RESET,
  
  PDIR_TEMPLATE_MASTER_LIST_REQUEST,
  PDIR_TEMPLATE_MASTER_LIST_SUCCESS,
  PDIR_TEMPLATE_MASTER_LIST_FAIL,
  PDIR_TEMPLATE_MASTER_LIST_RESET, 
 } from '../../constants/qa/pdirTemplateConstants';

//1. create a pdirTemplate record reducer
export const pdirTemplateCreateReducer = (state={}, action) => {
  //console.log("Inside PDIRTemplate create Reducer ####### ", action.type)
  switch (action.type) {
    case PDIR_TEMPLATE_CREATE_REQUEST:
      return {
        loading: true,
      }
    case PDIR_TEMPLATE_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        pdirTemplate: action.payload,
      }
    case PDIR_TEMPLATE_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case PDIR_TEMPLATE_CREATE_RESET:
      return {}
    default:
      return state
  }
}

//2. get a single record reducer
export const pdirTemplateDetailsReducer = (state = { pdirTemplate: {} }, action) => {
  //console.log("Inside PDIRTemplate Recucer and action is &&&&&&& ", action.type)
  switch (action.type) {
    case PDIR_TEMPLATE_DETAILS_REQUEST:
      return { ...state, loading: true }
    case PDIR_TEMPLATE_DETAILS_SUCCESS:
      return { loading: false, pdirTemplate: action.payload }
    case PDIR_TEMPLATE_DETAILS_FAIL:
      return { loading: false, error: action.payload, pdirTemplate:{} }
    default:
      return state
  }
}

//3. update a single record reducer
export const pdirTemplateUpdateReducer = (state = { pdirTemplate: {} }, action) => {
  switch (action.type) {
    case PDIR_TEMPLATE_UPDATE_REQUEST:
      return { loading: true }
    case PDIR_TEMPLATE_UPDATE_SUCCESS:
      return { loading: false, success: true, pdirTemplate: action.payload }
    case PDIR_TEMPLATE_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case PDIR_TEMPLATE_UPDATE_RESET:
      return { pdirTemplate: {} }
    default:
      return state
  }
}

//4. delete a single record reducer
export const pdirTemplateDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PDIR_TEMPLATE_DELETE_REQUEST:
      return { loading: true }
    case PDIR_TEMPLATE_DELETE_SUCCESS:
      return { loading: false, success: true }
    case PDIR_TEMPLATE_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

//5. get all pdirTemplate records reducer
export const allPDIRTemplateListReducer = (state = { pdirTemplates: [] }, action) => {
  switch (action.type) {
    case PDIR_TEMPLATE_LIST_REQUEST:
      return {
        loading: true,
      }
    case PDIR_TEMPLATE_LIST_SUCCESS:
      return {
        loading: false,
        pdirTemplates: action.payload.pdirTemplates,
        pages: action.payload.pages,
        page: action.payload.page,
      }
    case PDIR_TEMPLATE_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case PDIR_TEMPLATE_LIST_RESET:
      return { pdirTemplates: [] }
    default:
      return state
  }
}

//6. get all PDIRTemplate records reducer
export const masterDataForPDIRTemplateReducer = (state = { masterdataForPDIRTemplate: {} }, action) => {
  //console.log("Inside masterdataForPDIRTemplateReducer reducer ####### ", action.type)
  
  switch (action.type) {
      case PDIR_TEMPLATE_MASTER_LIST_REQUEST:
      return {
        loading: true,
      }
      case PDIR_TEMPLATE_MASTER_LIST_SUCCESS:
      return {
        loading: false,
        autoIncrementedPDIRTemplateNo: action.payload.autoIncrementedPDIRTemplateNo,
        prodCategories: action.payload.prodCategories,
        prodCodes: action.payload.prodCodes,
        inspectionparams: action.payload.inspectionparams,
        inspectionmethods: action.payload.inspectionmethods,
      }
      case PDIR_TEMPLATE_MASTER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
      case PDIR_TEMPLATE_MASTER_LIST_RESET:
        return { masterdataForPDIRTemplate: { } }
      default:
        return state
  }
}