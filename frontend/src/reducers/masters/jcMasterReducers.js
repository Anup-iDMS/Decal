import {
	JC_CREATE_REQUEST,
	JC_CREATE_SUCCESS,
	JC_CREATE_FAIL,
	JC_CREATE_RESET,

	JC_DETAILS_REQUEST,
	JC_DETAILS_SUCCESS,
	JC_DETAILS_FAIL,
	// JC_DETAILS_RESET,

	JC_UPDATE_REQUEST,
	JC_UPDATE_SUCCESS,
	JC_UPDATE_FAIL,
	JC_UPDATE_RESET,

	JC_DELETE_REQUEST,
	JC_DELETE_SUCCESS,
	JC_DELETE_FAIL,
	// JC_DELETE_RESET,

	JC_LIST_REQUEST,
	JC_LIST_SUCCESS,
	JC_LIST_FAIL,
	JC_LIST_RESET,

  JC_ALL_LIST_REQUEST,
  JC_ALL_LIST_SUCCESS,
  JC_ALL_LIST_FAIL,
  JC_ALL_LIST_RESET,

  JC_MASTER_LIST_REQUEST,
  JC_MASTER_LIST_SUCCESS,
  JC_MASTER_LIST_FAIL,
  JC_MASTER_LIST_RESET,

  JC_MASTER_CUSTOMER_LIST_REQUEST,
  JC_MASTER_CUSTOMER_LIST_SUCCESS,
  JC_MASTER_CUSTOMER_LIST_FAIL,
  JC_MASTER_CUSTOMER_LIST_RESET,

  JC_MASTER_CUSTOMER_PO_LIST_REQUEST,
  JC_MASTER_CUSTOMER_PO_LIST_SUCCESS,
  JC_MASTER_CUSTOMER_PO_LIST_FAIL,
  JC_MASTER_CUSTOMER_PO_LIST_RESET,

  JC_MASTER_REPORT_REQUEST,
  JC_MASTER_REPORT_SUCCESS,
  JC_MASTER_REPORT_FAIL,
  JC_MASTER_REPORT_RESET,

} from './../../constants/masters/jcMasterConstants';

//1. create a jcMaster record reducer
export const jcMasterCreateReducer = (state={}, action) => {
  //logger("Inside JCMaster create Reducer ####### ", action.type)
  switch (action.type) {
    case JC_CREATE_REQUEST:
      return {
        loading: true,
      }
    case JC_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        jcMaster: action.payload,
      }
    case JC_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case JC_CREATE_RESET:
      return {}
    default:
      return state
  }
}

//2. get a single record reducer
export const jcMasterDetailsReducer = (state = { module: {} }, action) => {
  //logger("Inside JCMaster Recucer and action is &&&&&&& ", action.type)
  switch (action.type) {
    case JC_DETAILS_REQUEST:
      return { ...state, loading: true }
    case JC_DETAILS_SUCCESS:
      return { loading: false, module: action.payload }
    case JC_DETAILS_FAIL:
      return { loading: false, error: action.payload, module:{} }
    default:
      return state
  }
}

//3. update a single record reducer
export const jcMasterUpdateReducer = (state = { jcMaster: {} }, action) => {
  switch (action.type) {
    case JC_UPDATE_REQUEST:
      return { loading: true }
    case JC_UPDATE_SUCCESS:
      return { loading: false, success: true, jcMaster: action.payload }
    case JC_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case JC_UPDATE_RESET:
      return { jcMaster: {} }
    default:
      return state
  }
}

//4. delete a single record reducer
export const jcMasterDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case JC_DELETE_REQUEST:
      return { loading: true }
    case JC_DELETE_SUCCESS:
      return { loading: false, success: true }
    case JC_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

//5. get all jcMaster records reducer
export const jcMastersListReducer = (state = { loading: true, jcMasters: [] }, action) => {
 switch (action.type) {
  case JC_ALL_LIST_REQUEST:
    return {
       loading: true,
     }
  case JC_ALL_LIST_SUCCESS:
    return {
       loading: false,
       jcMasters: action.payload,
    }
  case JC_ALL_LIST_FAIL:
    return {
       loading: false,
       error: action.payload,
    }
  case JC_ALL_LIST_RESET:
    return { jcMasters: [] }
  default:
    return state
 }
}


//5.1 get all jcMaster records reducer
export const allJCMastersListReducer = (state = { loading: true, jcmasters: [] }, action) => {
  switch (action.type) {
    case JC_LIST_REQUEST:
      return {
        loading: true,
      }
    case JC_LIST_SUCCESS:
      return {
        loading: false,
        jcmasters: action.payload.modules,
        pages: action.payload.pages,
        page: action.payload.page,
      }
    case JC_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case JC_LIST_RESET:
      return { jcmasters: [] }
    default:
      return state
  }
}

//5.2 get all jcMaster records for report reducer
export const jcMastersReportReducer = (state = { loading: true, jcMasters: [] }, action) => {
  switch (action.type) {
   case JC_MASTER_REPORT_REQUEST:
     return {
        loading: true,
      }
   case JC_MASTER_REPORT_SUCCESS:
     return {
        loading: false,
        jcMasters: action.payload,
     }
   case JC_MASTER_REPORT_FAIL:
     return {
        loading: false,
        error: action.payload,
     }
   case JC_MASTER_REPORT_RESET:
     return { jcMasters: [] }
   default:
     return state
  }
 }

//6. get all jcMaster records reducer
export const masterDataForJCReducer = (state = { masterdataForJC: {} }, action) => {
  //logger("Inside masterDataForJCReducer reducer ####### ", action.type)
  //logger("Inside JCMaster All List Reducer action.payload ####### ", action.payload)
  switch (action.type) {
      case JC_MASTER_LIST_REQUEST:
      return {
        loading: true,
      }
      case JC_MASTER_LIST_SUCCESS:
      return {
        loading: false,
        prodCategories: action.payload.prodCategories,
        prodCodes: action.payload.prodCodes,
        uoms: action.payload.uoms,
        machineMasters: action.payload.machineMasters,
        customers: action.payload.customers,
        autoIncValues: action.payload.autoIncValues,
      }
      case JC_MASTER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
      case JC_MASTER_LIST_RESET:
        return { masterdataForJC: { } }
      default:
        return state
  }
}

//7. get all customer specific JCs
export const allCustomerJCListReducer = (state = { customerJCs: [] }, action) => {
  //logger("Inside allCustomerJCListReducer ####### ", action.type)
  //logger("Inside allCustomerJCListReducer action.payload ####### ", action.payload)
  switch (action.type) {
    case JC_MASTER_CUSTOMER_LIST_REQUEST:
      return {
        loading: true,
      }
    case JC_MASTER_CUSTOMER_LIST_SUCCESS:
      return {
        loading: false,
        success: true,
        customerJCs: action.payload,
      }
    case JC_MASTER_CUSTOMER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case JC_MASTER_CUSTOMER_LIST_RESET:
      return { customerJCs: [] }
    default:
      return state
  }
}

//9. get all customer specific JC POs
export const allCustomerJCPOListReducer = (state = { customerPOData: {} }, action) => {
  //logger("Inside allCustomerJCPOListReducer ####### ", action.type)
  //logger("Inside allCustomerJCPOListReducer action.payload ####### ", action.payload)
  switch (action.type) {
    case JC_MASTER_CUSTOMER_PO_LIST_REQUEST:
      return {
        loading: true,
      }
    case JC_MASTER_CUSTOMER_PO_LIST_SUCCESS:
      return {
        loading: false,
        success: true,
        customerJCs: action.payload.customerJCs,
        customerJCIDs: action.payload.customerJCIDs,
      }
    case JC_MASTER_CUSTOMER_PO_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case JC_MASTER_CUSTOMER_PO_LIST_RESET:
      return { customerPOData: [] }
    default:
      return state
  }
}
