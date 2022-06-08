import { 
   CUSTOMER_CREATE_REQUEST,
   CUSTOMER_CREATE_SUCCESS,
   CUSTOMER_CREATE_FAIL,
   CUSTOMER_CREATE_RESET,
   CUSTOMER_DETAILS_REQUEST,
   CUSTOMER_DETAILS_SUCCESS,
   CUSTOMER_DETAILS_FAIL,
   CUSTOMER_DETAILS_RESET,
   CUSTOMER_UPDATE_REQUEST,
   CUSTOMER_UPDATE_SUCCESS,
   CUSTOMER_UPDATE_FAIL,
   CUSTOMER_UPDATE_RESET,
  //  CUSTOMER_DELETE_REQUEST,
  //  CUSTOMER_DELETE_SUCCESS,
  //  CUSTOMER_DELETE_FAIL,
   CUSTOMER_LIST_REQUEST,
   CUSTOMER_LIST_SUCCESS,
   CUSTOMER_LIST_FAIL,
   CUSTOMER_LIST_RESET,
   CUSTOMER_MASTER_LIST_REQUEST,
   CUSTOMER_MASTER_LIST_SUCCESS,
   CUSTOMER_MASTER_LIST_FAIL,
   CUSTOMER_MASTER_LIST_RESET,
} from "./../../constants/masters/customerConstants";

export const customersListReducer = (state = { customers: [] }, action) => {
   switch (action.type) {
     case CUSTOMER_LIST_REQUEST:
       return {
         loading: true,
       }
     case CUSTOMER_LIST_SUCCESS:
       return {
         loading: false,
         customers: action.payload.customers,
         pages: action.payload.pages,
         page: action.payload.page,
       }
     case CUSTOMER_LIST_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
     case CUSTOMER_LIST_RESET:
       return { customers: [] }
     default:
       return state
  }
}

export const customerDetailsReducer = (state = { customer: {} }, action) => {
  switch (action.type) {
    case CUSTOMER_DETAILS_REQUEST:
      return { ...state, loading: true }
    case CUSTOMER_DETAILS_SUCCESS:
      return { loading: false, customer: action.payload }
    case CUSTOMER_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case CUSTOMER_DETAILS_RESET:
      return { customer: {} }
    default:
      return state
  }
}

export const customerCreateReducer = (state={}, action) => {
  //console.log("1. Inside customer create Reducer ####### ", action.payload)
  switch (action.type) {
    case CUSTOMER_CREATE_REQUEST:
      return {
        loading: true,
      }
    case CUSTOMER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        customer: action.payload.customer,
      }
    case CUSTOMER_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case CUSTOMER_CREATE_RESET:
      return {}
    default:
      return state
  }
}

//6. get all job card records reducer
export const masterdataForCustomerMasterReducer = (state = { masterdataForCustomerMaster: {} }, action) => {
  //logger("Inside masterdataForCustomerMasterReducer reducer ####### ", action.type)
  
  switch (action.type) {
      case CUSTOMER_MASTER_LIST_REQUEST:
      return {
        loading: true,
      }
      case CUSTOMER_MASTER_LIST_SUCCESS:
      return {
        loading: false,
        autoIncrementedCustomerNo: action.payload.autoIncrementedCustomerNo,
      }
      case CUSTOMER_MASTER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
      case CUSTOMER_MASTER_LIST_RESET:
        return { masterdataForCustomerMaster: { } }
      default:
        return state
  }
}

//3. update a single record reducer
export const customerUpdateReducer = (state = { customer: {} }, action) => {
  switch (action.type) {
     case CUSTOMER_UPDATE_REQUEST:
        return { loading: true }
     case CUSTOMER_UPDATE_SUCCESS:
        return { loading: false, success: true, customer: action.payload }
     case CUSTOMER_UPDATE_FAIL:
        return { loading: false, error: action.payload }
     case CUSTOMER_UPDATE_RESET:
        return { customer: {} }
     default:
        return state
  }
}