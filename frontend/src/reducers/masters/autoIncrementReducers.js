import {
	AUTO_INCREMENT_CREATE_REQUEST,
	AUTO_INCREMENT_CREATE_SUCCESS,
	AUTO_INCREMENT_CREATE_FAIL,
	AUTO_INCREMENT_CREATE_RESET,

	AUTO_INCREMENT_DETAILS_REQUEST,
	AUTO_INCREMENT_DETAILS_SUCCESS,
	AUTO_INCREMENT_DETAILS_FAIL,
	AUTO_INCREMENT_DETAILS_RESET,

	AUTO_INCREMENT_UPDATE_REQUEST,
	AUTO_INCREMENT_UPDATE_SUCCESS,
	AUTO_INCREMENT_UPDATE_FAIL,
	AUTO_INCREMENT_UPDATE_RESET,

	AUTO_INCREMENT_DELETE_REQUEST,
	AUTO_INCREMENT_DELETE_SUCCESS,
	AUTO_INCREMENT_DELETE_FAIL,
	AUTO_INCREMENT_DELETE_RESET,

	AUTO_INCREMENT_LIST_REQUEST,
	AUTO_INCREMENT_LIST_SUCCESS,
	AUTO_INCREMENT_LIST_FAIL,
	AUTO_INCREMENT_LIST_RESET,

  AUTO_INCREMENT_MASTER_LIST_REQUEST,
  AUTO_INCREMENT_MASTER_LIST_SUCCESS,
  AUTO_INCREMENT_MASTER_LIST_FAIL,
  AUTO_INCREMENT_MASTER_LIST_RESET,
} from './../../constants/masters/autoIncrementConstants';

//1. create a autoIncrement record reducer
export const autoIncrementCreateReducer = (state={}, action) => {
  //console.log("Inside AutoIncrement create Reducer ####### ", action.type)
  switch (action.type) {
    case AUTO_INCREMENT_CREATE_REQUEST:
      return {
        loading: true,
      }
    case AUTO_INCREMENT_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        autoIncrement: action.payload,
      }
    case AUTO_INCREMENT_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case AUTO_INCREMENT_CREATE_RESET:
      return {}
    default:
      return state
  }
}

//2. get a single record reducer
export const autoIncrementDetailsReducer = (state = { autoIncrement: {} }, action) => {
  //console.log("Inside AutoIncrement Recucer and action is &&&&&&& ", action.type)
  switch (action.type) {
    case AUTO_INCREMENT_DETAILS_REQUEST:
      return { ...state, loading: true }
    case AUTO_INCREMENT_DETAILS_SUCCESS:
      return { loading: false, autoIncrement: action.payload }
    case AUTO_INCREMENT_DETAILS_FAIL:
      return { loading: false, error: action.payload, autoIncrement:{} }
    default:
      return state
  }
}

//3. update a single record reducer
export const autoIncrementUpdateReducer = (state = { autoIncrement: {} }, action) => {
  switch (action.type) {
    case AUTO_INCREMENT_UPDATE_REQUEST:
      return { loading: true }
    case AUTO_INCREMENT_UPDATE_SUCCESS:
      return { loading: false, success: true, autoIncrement: action.payload }
    case AUTO_INCREMENT_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case AUTO_INCREMENT_UPDATE_RESET:
      return { autoIncrement: {} }
    default:
      return state
  }
}

//4. delete a single record reducer
export const autoIncrementDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case AUTO_INCREMENT_DELETE_REQUEST:
      return { loading: true }
    case AUTO_INCREMENT_DELETE_SUCCESS:
      return { loading: false, success: true }
    case AUTO_INCREMENT_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

//5. get all autoIncrement records reducer
export const allAutoIncrementListReducer = (state = { autoIncrements: [] }, action) => {
  switch (action.type) {
    case AUTO_INCREMENT_LIST_REQUEST:
      return {
        loading: true,
      }
    case AUTO_INCREMENT_LIST_SUCCESS:
      return {
        loading: false,
        autoIncrements: action.payload.autoIncrements,
        pages: action.payload.pages,
        page: action.payload.page,
      }
    case AUTO_INCREMENT_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case AUTO_INCREMENT_LIST_RESET:
      return { autoIncrements: [] }
    default:
      return state
  }
}
