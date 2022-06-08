import {
	COMPANY_CREATE_REQUEST,
	COMPANY_CREATE_SUCCESS,
	COMPANY_CREATE_FAIL,
	COMPANY_CREATE_RESET,

	COMPANY_DETAILS_REQUEST,
	COMPANY_DETAILS_SUCCESS,
	COMPANY_DETAILS_FAIL,
	COMPANY_DETAILS_RESET,

	COMPANY_UPDATE_REQUEST,
	COMPANY_UPDATE_SUCCESS,
	COMPANY_UPDATE_FAIL,
	COMPANY_UPDATE_RESET,

	COMPANY_DELETE_REQUEST,
	COMPANY_DELETE_SUCCESS,
	COMPANY_DELETE_FAIL,
	COMPANY_DELETE_RESET,

	COMPANY_LIST_REQUEST,
	COMPANY_LIST_SUCCESS,
	COMPANY_LIST_FAIL,
	COMPANY_LIST_RESET,

  COMPANY_MASTER_LIST_REQUEST,
  COMPANY_MASTER_LIST_SUCCESS,
  COMPANY_MASTER_LIST_FAIL,
  COMPANY_MASTER_LIST_RESET,
} from './../../constants/masters/companyConstants';

//1. create a company record reducer
export const companyCreateReducer = (state={}, action) => {
  //console.log("Inside Company create Reducer ####### ", action.type)
  switch (action.type) {
    case COMPANY_CREATE_REQUEST:
      return {
        loading: true,
      }
    case COMPANY_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        company: action.payload,
      }
    case COMPANY_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case COMPANY_CREATE_RESET:
      return {}
    default:
      return state
  }
}

//2. get a single record reducer
export const companyDetailsReducer = (state = { company: {} }, action) => {
  //console.log("Inside Company Recucer and action is &&&&&&& ", action.type)
  switch (action.type) {
    case COMPANY_DETAILS_REQUEST:
      return { ...state, loading: true }
    case COMPANY_DETAILS_SUCCESS:
      return { loading: false, company: action.payload }
    case COMPANY_DETAILS_FAIL:
      return { loading: false, error: action.payload, company:{} }
    default:
      return state
  }
}

//3. update a single record reducer
export const companyUpdateReducer = (state = { company: {} }, action) => {
  switch (action.type) {
    case COMPANY_UPDATE_REQUEST:
      return { loading: true }
    case COMPANY_UPDATE_SUCCESS:
      return { loading: false, success: true, company: action.payload }
    case COMPANY_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case COMPANY_UPDATE_RESET:
      return { company: {} }
    default:
      return state
  }
}

//4. delete a single record reducer
export const companyDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case COMPANY_DELETE_REQUEST:
      return { loading: true }
    case COMPANY_DELETE_SUCCESS:
      return { loading: false, success: true }
    case COMPANY_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

//5. get all company records reducer
export const allCompanyListReducer = (state = { company: [] }, action) => {
  switch (action.type) {
    case COMPANY_LIST_REQUEST:
      return {
        loading: true,
      }
    case COMPANY_LIST_SUCCESS:
      return {
        loading: false,
        company: action.payload.company,
        pages: action.payload.pages,
        page: action.payload.page,
      }
    case COMPANY_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case COMPANY_LIST_RESET:
      return { company: [] }
    default:
      return state
  }
}
