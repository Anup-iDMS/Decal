import { 
	PRODUCT_CATEGORY_CREATE_REQUEST,
	PRODUCT_CATEGORY_CREATE_SUCCESS,
	PRODUCT_CATEGORY_CREATE_FAIL,
	PRODUCT_CATEGORY_CREATE_RESET,

	PRODUCT_CATEGORY_DETAILS_REQUEST,
	PRODUCT_CATEGORY_DETAILS_SUCCESS,
	PRODUCT_CATEGORY_DETAILS_FAIL,
	// PRODUCT_CATEGORY_DETAILS_RESET,

	PRODUCT_CATEGORY_UPDATE_REQUEST,
	PRODUCT_CATEGORY_UPDATE_SUCCESS,
	PRODUCT_CATEGORY_UPDATE_FAIL,
	PRODUCT_CATEGORY_UPDATE_RESET,

	PRODUCT_CATEGORY_DELETE_REQUEST,
	PRODUCT_CATEGORY_DELETE_SUCCESS,
	PRODUCT_CATEGORY_DELETE_FAIL,
	// PRODUCT_CATEGORY_DELETE_RESET,

	PRODUCT_CATEGORY_LIST_REQUEST,
	PRODUCT_CATEGORY_LIST_SUCCESS,
	PRODUCT_CATEGORY_LIST_FAIL,
	PRODUCT_CATEGORY_LIST_RESET,

   // PRODUCT_CATEGORY_MASTER_LIST_REQUEST,
   // PRODUCT_CATEGORY_MASTER_LIST_SUCCESS,
   // PRODUCT_CATEGORY_MASTER_LIST_FAIL,
   // PRODUCT_CATEGORY_MASTER_LIST_RESET

} from './../../constants/masters/prodCatConstants';

//1. create a prodCategory record reducer
export const prodCategoryCreateReducer = (state={}, action) => {
   //logger("Inside ProdCategory create Reducer ####### ", action.type)
   switch (action.type) {
      case PRODUCT_CATEGORY_CREATE_REQUEST:
         return {
            loading: true,
         }
      case PRODUCT_CATEGORY_CREATE_SUCCESS:
         return {
            loading: false,
            success: true,
            prodCategory: action.payload,
         }
      case PRODUCT_CATEGORY_CREATE_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case PRODUCT_CATEGORY_CREATE_RESET:
         return {}
      default:
         return state
   }
}

//2. get a single record reducer
export const prodCategoryDetailsReducer = (state = { prodCategory: {} }, action) => {
   //logger("Inside ProdCategory Recucer and action is &&&&&&& ", action.type)
   switch (action.type) {
      case PRODUCT_CATEGORY_DETAILS_REQUEST:
         return { ...state, loading: true }
      case PRODUCT_CATEGORY_DETAILS_SUCCESS:
         return { loading: false, prodCategory: action.payload }
      case PRODUCT_CATEGORY_DETAILS_FAIL:
         return { loading: false, error: action.payload, prodCategory:{} }
      default:
         return state
   }
}

//3. update a single record reducer
export const prodCategoryUpdateReducer = (state = { prodCategory: {} }, action) => {
   switch (action.type) {
      case PRODUCT_CATEGORY_UPDATE_REQUEST:
         return { loading: true }
      case PRODUCT_CATEGORY_UPDATE_SUCCESS:
         return { loading: false, success: true, prodCategory: action.payload }
      case PRODUCT_CATEGORY_UPDATE_FAIL:
         return { loading: false, error: action.payload }
      case PRODUCT_CATEGORY_UPDATE_RESET:
         return { prodCategory: {} }
      default:
         return state
   }
}

//4. delete a single record reducer
export const prodCategoryDeleteReducer = (state = {}, action) => {
   switch (action.type) {
      case PRODUCT_CATEGORY_DELETE_REQUEST:
         return { loading: true }
      case PRODUCT_CATEGORY_DELETE_SUCCESS:
         return { loading: false, success: true }
      case PRODUCT_CATEGORY_DELETE_FAIL:
         return { loading: false, error: action.payload }
      default:
         return state
   }
}

//5. get all prodCategory records reducer
export const allProdCategoryListReducer = (state = { prodCats: [] }, action) => {
   switch (action.type) {
      case PRODUCT_CATEGORY_LIST_REQUEST:
         return {
            loading: true,
         }
      case PRODUCT_CATEGORY_LIST_SUCCESS:
         return {
            loading: false,
            prodCats: action.payload,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case PRODUCT_CATEGORY_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case PRODUCT_CATEGORY_LIST_RESET:
         return { prodCats: [] }
      default:
         return state
   }
}
