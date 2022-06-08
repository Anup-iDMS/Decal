import {
  SUPPLIER_CREATE_REQUEST,
  SUPPLIER_CREATE_SUCCESS,
  SUPPLIER_CREATE_FAIL,
  SUPPLIER_CREATE_RESET,
  SUPPLIER_DETAILS_REQUEST,
  SUPPLIER_DETAILS_SUCCESS,
  SUPPLIER_DETAILS_FAIL,
  SUPPLIER_DETAILS_RESET,
  SUPPLIER_UPDATE_REQUEST,
  SUPPLIER_UPDATE_SUCCESS,
  SUPPLIER_UPDATE_FAIL,
  SUPPLIER_UPDATE_RESET,
  //  SUPPLIER_DELETE_REQUEST,
  //  SUPPLIER_DELETE_SUCCESS,
  //  SUPPLIER_DELETE_FAIL,
  SUPPLIER_LIST_REQUEST,
  SUPPLIER_LIST_SUCCESS,
  SUPPLIER_LIST_FAIL,
  SUPPLIER_LIST_RESET,
  SUPPLIER_MASTER_LIST_REQUEST,
  SUPPLIER_MASTER_LIST_SUCCESS,
  SUPPLIER_MASTER_LIST_FAIL,
  SUPPLIER_MASTER_LIST_RESET,
} from './../../constants/masters/supplierConstants.js'

export const suppliersListReducer = (state = { suppliers: [] }, action) => {
  switch (action.type) {
    case SUPPLIER_LIST_REQUEST:
      return {
        loading: true,
      }
    case SUPPLIER_LIST_SUCCESS:
      return {
        loading: false,
        suppliers: action.payload.suppliers,
        pages: action.payload.pages,
        page: action.payload.page,
      }
    case SUPPLIER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case SUPPLIER_LIST_RESET:
      return { suppliers: [] }
    default:
      return state
  }
}

export const supplierDetailsReducer = (state = { supplier: {} }, action) => {
  switch (action.type) {
    case SUPPLIER_DETAILS_REQUEST:
      return { ...state, loading: true }
    case SUPPLIER_DETAILS_SUCCESS:
      return { loading: false, supplier: action.payload }
    case SUPPLIER_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case SUPPLIER_DETAILS_RESET:
      return { supplier: {} }
    default:
      return state
  }
}

export const supplierCreateReducer = (state = {}, action) => {
  //console.log("1. Inside supplier create Reducer ####### ", action.payload)
  switch (action.type) {
    case SUPPLIER_CREATE_REQUEST:
      return {
        loading: true,
      }
    case SUPPLIER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        supplier: action.payload.supplier,
      }
    case SUPPLIER_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case SUPPLIER_CREATE_RESET:
      return {}
    default:
      return state
  }
}

//6. get all Supplier records reducer
export const masterdataForSupplierMasterReducer = (
  state = { masterdataForSupplierMaster: {} },
  action
) => {
  //logger("Inside masterdataForSupplierMasterReducer reducer ####### ", action.type)

  switch (action.type) {
    case SUPPLIER_MASTER_LIST_REQUEST:
      return {
        loading: true,
      }
    case SUPPLIER_MASTER_LIST_SUCCESS:
      return {
        loading: false,
        autoIncrementedSupplierNo: action.payload.autoIncrementedSupplierNo,
      }
    case SUPPLIER_MASTER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case SUPPLIER_MASTER_LIST_RESET:
      return { masterdataForSupplierMaster: {} }
    default:
      return state
  }
}

//3. update a single record reducer
export const supplierUpdateReducer = (state = { supplier: {} }, action) => {
  switch (action.type) {
    case SUPPLIER_UPDATE_REQUEST:
      return { loading: true }
    case SUPPLIER_UPDATE_SUCCESS:
      return { loading: false, success: true, supplier: action.payload }
    case SUPPLIER_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case SUPPLIER_UPDATE_RESET:
      return { supplier: {} }
    default:
      return state
  }
}
