import { 
	PRODUCT_CODE_CREATE_REQUEST,
	PRODUCT_CODE_CREATE_SUCCESS,
	PRODUCT_CODE_CREATE_FAIL,
	PRODUCT_CODE_CREATE_RESET,

	PRODUCT_CODE_DETAILS_REQUEST,
	PRODUCT_CODE_DETAILS_SUCCESS,
	PRODUCT_CODE_DETAILS_FAIL,
	// PRODUCT_CODE_DETAILS_RESET,

	PRODUCT_CODE_UPDATE_REQUEST,
	PRODUCT_CODE_UPDATE_SUCCESS,
	PRODUCT_CODE_UPDATE_FAIL,
	PRODUCT_CODE_UPDATE_RESET,

	PRODUCT_CODE_DELETE_REQUEST,
	PRODUCT_CODE_DELETE_SUCCESS,
	PRODUCT_CODE_DELETE_FAIL,
	// PRODUCT_CODE_DELETE_RESET,

	PRODUCT_CODE_LIST_REQUEST,
	PRODUCT_CODE_LIST_SUCCESS,
	PRODUCT_CODE_LIST_FAIL,
	PRODUCT_CODE_LIST_RESET,

   PRODUCT_CODE_MASTER_DATA_REQUEST,
   PRODUCT_CODE_MASTER_DATA_SUCCESS,
   PRODUCT_CODE_MASTER_DATA_FAIL,
   PRODUCT_CODE_MASTER_DATA_RESET,

} from './../../constants/masters/prodCodeConstants';

//1. create a productCode record reducer
export const productCodeCreateReducer = (state={}, action) => {
   //logger("Inside ProductCode create Reducer ####### ", action.type)
   switch (action.type) {
      case PRODUCT_CODE_CREATE_REQUEST:
         return {
            loading: true,
         }
      case PRODUCT_CODE_CREATE_SUCCESS:
         return {
            loading: false,
            success: true,
            productCode: action.payload,
         }
      case PRODUCT_CODE_CREATE_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case PRODUCT_CODE_CREATE_RESET:
         return {}
      default:
         return state
   }
}

//2. get a single record reducer
export const productCodeDetailsReducer = (state = { productCode: {} }, action) => {
   //logger("Inside ProductCode Recucer and action is &&&&&&& ", action.type)
   switch (action.type) {
      case PRODUCT_CODE_DETAILS_REQUEST:
         return { ...state, loading: true }
      case PRODUCT_CODE_DETAILS_SUCCESS:
         return { loading: false, productCode: action.payload }
      case PRODUCT_CODE_DETAILS_FAIL:
         return { loading: false, error: action.payload, productCode:{} }
      default:
         return state
   }
}

//3. update a single record reducer
export const productCodeUpdateReducer = (state = { productCode: {} }, action) => {
   switch (action.type) {
      case PRODUCT_CODE_UPDATE_REQUEST:
         return { loading: true }
      case PRODUCT_CODE_UPDATE_SUCCESS:
         return { loading: false, success: true, productCode: action.payload }
      case PRODUCT_CODE_UPDATE_FAIL:
         return { loading: false, error: action.payload }
      case PRODUCT_CODE_UPDATE_RESET:
         return { productCode: {} }
      default:
         return state
   }
}

//4. delete a single record reducer
export const productCodeDeleteReducer = (state = {}, action) => {
   switch (action.type) {
      case PRODUCT_CODE_DELETE_REQUEST:
         return { loading: true }
      case PRODUCT_CODE_DELETE_SUCCESS:
         return { loading: false, success: true }
      case PRODUCT_CODE_DELETE_FAIL:
         return { loading: false, error: action.payload }
      default:
         return state
   }
}

//5. get all productCode records reducer
export const allProductCodeListReducer = (state = { productCodes: [] }, action) => {
   switch (action.type) {
      case PRODUCT_CODE_LIST_REQUEST:
         return {
            loading: true,
         }
      case PRODUCT_CODE_LIST_SUCCESS:
         return {
            loading: false,
            productCodes: action.payload,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case PRODUCT_CODE_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case PRODUCT_CODE_LIST_RESET:
         return { productCodes: [] }
      default:
         return state
   }
}

//6. get all jcMaster records reducer
export const masterDataForProductCodeReducer = (state = { masterdataForProductCode: {} }, action) => {
   //logger("Inside masterDataForProductCodeReducer reducer ####### ", action.type)
   //logger("Inside JCMaster All List Reducer action.payload ####### ", action.payload)
   switch (action.type) {
       case PRODUCT_CODE_MASTER_DATA_REQUEST:
       return {
         loading: true,
       }
       case PRODUCT_CODE_MASTER_DATA_SUCCESS:
       return {
         loading: false,
         hsnCodes: action.payload.hsnCodes,
       }
       case PRODUCT_CODE_MASTER_DATA_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case PRODUCT_CODE_MASTER_DATA_RESET:
         return { masterdataForProductCode: { } }
       default:
         return state
   }
 }