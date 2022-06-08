import {
	ISSUE_CREATE_REQUEST,
	ISSUE_CREATE_SUCCESS,
	ISSUE_CREATE_FAIL,
	ISSUE_CREATE_RESET,

	ISSUE_DETAILS_REQUEST,
	ISSUE_DETAILS_SUCCESS,
	ISSUE_DETAILS_FAIL,
	ISSUE_DETAILS_RESET,

	ISSUE_UPDATE_REQUEST,
	ISSUE_UPDATE_SUCCESS,
	ISSUE_UPDATE_FAIL,
	ISSUE_UPDATE_RESET,

	ISSUE_DELETE_REQUEST,
	ISSUE_DELETE_SUCCESS,
	ISSUE_DELETE_FAIL,
	ISSUE_DELETE_RESET,

	ISSUE_LIST_REQUEST,
	ISSUE_LIST_SUCCESS,
	ISSUE_LIST_FAIL,
	ISSUE_LIST_RESET,

  ISSUE_MASTER_LIST_REQUEST,
  ISSUE_MASTER_LIST_SUCCESS,
  ISSUE_MASTER_LIST_FAIL,
  ISSUE_MASTER_LIST_RESET,
} from './../../constants/masters/issueConstants';

//1. create a issue record reducer
export const issueCreateReducer = (state={}, action) => {
  //logger("Inside Issue create Reducer ####### ", action.type)
  switch (action.type) {
    case ISSUE_CREATE_REQUEST:
      return {
        loading: true,
      }
    case ISSUE_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        issue: action.payload,
      }
    case ISSUE_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case ISSUE_CREATE_RESET:
      return {}
    default:
      return state
  }
}

//2. get a single record reducer
export const issueDetailsReducer = (state = { issue: {} }, action) => {
  //logger("Inside Issue Recucer and action is &&&&&&& ", action.type)
  switch (action.type) {
    case ISSUE_DETAILS_REQUEST:
      return { ...state, loading: true }
    case ISSUE_DETAILS_SUCCESS:
      return { loading: false, issue: action.payload }
    case ISSUE_DETAILS_FAIL:
      return { loading: false, error: action.payload, issue:{} }
    default:
      return state
  }
}

//3. update a single record reducer
export const issueUpdateReducer = (state = { issue: {} }, action) => {
  switch (action.type) {
    case ISSUE_UPDATE_REQUEST:
      return { loading: true }
    case ISSUE_UPDATE_SUCCESS:
      return { loading: false, success: true, issue: action.payload }
    case ISSUE_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case ISSUE_UPDATE_RESET:
      return { issue: {} }
    default:
      return state
  }
}

//4. delete a single record reducer
export const issueDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case ISSUE_DELETE_REQUEST:
      return { loading: true }
    case ISSUE_DELETE_SUCCESS:
      return { loading: false, success: true }
    case ISSUE_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

//5. get all issue records reducer
export const allIssueListReducer = (state = { issues: [] }, action) => {
  switch (action.type) {
    case ISSUE_LIST_REQUEST:
      return {
        loading: true,
      }
    case ISSUE_LIST_SUCCESS:
      return {
        loading: false,
        issues: action.payload.issues
      }
    case ISSUE_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case ISSUE_LIST_RESET:
      return { issues: [] }
    default:
      return state
  }
}

//6. get all Issue records reducer
export const masterDataForIssueReducer = (state = { masterdataForIssue: {} }, action) => {
  //logger("Inside masterdataForIssueReducer reducer ####### ", action.type)
  
  switch (action.type) {
      case ISSUE_MASTER_LIST_REQUEST:
      return {
        loading: true,
      }
      case ISSUE_MASTER_LIST_SUCCESS:
      return {
        loading: false,
        customers: action.payload.customers,
        autoIncrementedIssueNo: action.payload.autoIncrementedIssueNo,
      }
      case ISSUE_MASTER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
      case ISSUE_MASTER_LIST_RESET:
        return { masterdataForIssue: { } }
      default:
        return state
  }
}