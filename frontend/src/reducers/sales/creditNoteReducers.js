import { 
	CREDIT_NOTE_CREATE_REQUEST,
	CREDIT_NOTE_CREATE_SUCCESS,
	CREDIT_NOTE_CREATE_FAIL,
	CREDIT_NOTE_CREATE_RESET,

	CREDIT_NOTE_DETAILS_REQUEST,
	CREDIT_NOTE_DETAILS_SUCCESS,
	CREDIT_NOTE_DETAILS_FAIL,
	// CREDIT_NOTE_DETAILS_RESET,

	CREDIT_NOTE_UPDATE_REQUEST,
	CREDIT_NOTE_UPDATE_SUCCESS,
	CREDIT_NOTE_UPDATE_FAIL,
	CREDIT_NOTE_UPDATE_RESET,

	CREDIT_NOTE_DELETE_REQUEST,
	CREDIT_NOTE_DELETE_SUCCESS,
	CREDIT_NOTE_DELETE_FAIL,
	// CREDIT_NOTE_DELETE_RESET,

	CREDIT_NOTE_LIST_REQUEST,
	CREDIT_NOTE_LIST_SUCCESS,
	CREDIT_NOTE_LIST_FAIL,
	CREDIT_NOTE_LIST_RESET,

   CREDIT_NOTE_MASTER_LIST_REQUEST,
   CREDIT_NOTE_MASTER_LIST_SUCCESS,
   CREDIT_NOTE_MASTER_LIST_FAIL,
   CREDIT_NOTE_MASTER_LIST_RESET,

   CREDIT_NOTE_OPEN_LIST_REQUEST, 
   CREDIT_NOTE_OPEN_LIST_SUCCESS,
   CREDIT_NOTE_OPEN_LIST_FAIL,
   CREDIT_NOTE_OPEN_LIST_RESET,

   CREDIT_NOTE_APPROVED_LIST_REQUEST,
   CREDIT_NOTE_APPROVED_LIST_SUCCESS,
   CREDIT_NOTE_APPROVED_LIST_FAIL,
   CREDIT_NOTE_APPROVED_LIST_RESET,

   CREDIT_NOTE_WITH_TAX_LIST_REQUEST,
   CREDIT_NOTE_WITH_TAX_LIST_SUCCESS,
   CREDIT_NOTE_WITH_TAX_LIST_FAIL,
   CREDIT_NOTE_WITH_TAX_LIST_RESET,

} from '../../constants/sales/creditNoteConstants';

//1. create a creditNote record reducer
export const creditNoteCreateReducer = (state={}, action) => {
   //logger("Inside CreditNote create Reducer ####### ", action.type)
   switch (action.type) {
      case CREDIT_NOTE_CREATE_REQUEST:
         return {
            loading: true,
         }
      case CREDIT_NOTE_CREATE_SUCCESS:
         return {
            loading: false,
            success: true,
            creditNote: action.payload,
         }
      case CREDIT_NOTE_CREATE_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case CREDIT_NOTE_CREATE_RESET:
         return {}
      default:
         return state
   }
}

//2. get a single record reducer
export const creditNoteDetailsReducer = (state = { creditNote: {} }, action) => {
   //logger("Inside CreditNote Recucer and action is &&&&&&& ", action.type)
   switch (action.type) {
      case CREDIT_NOTE_DETAILS_REQUEST:
         return { ...state, loading: true }
      case CREDIT_NOTE_DETAILS_SUCCESS:
         return { loading: false, creditNote: action.payload }
      case CREDIT_NOTE_DETAILS_FAIL:
         return { loading: false, error: action.payload, creditNote:{} }
      default:
         return state
   }
}


//3. update a single record reducer
export const creditNoteUpdateReducer = (state = { creditNote: {} }, action) => {
   switch (action.type) {
      case CREDIT_NOTE_UPDATE_REQUEST:
         return { loading: true }
      case CREDIT_NOTE_UPDATE_SUCCESS:
         return { loading: false, success: true, creditNote: action.payload }
      case CREDIT_NOTE_UPDATE_FAIL:
         return { loading: false, error: action.payload }
      case CREDIT_NOTE_UPDATE_RESET:
         return { creditNote: {} }
      default:
         return state
   }
}

//4. delete a single record reducer
export const creditNoteDeleteReducer = (state = {}, action) => {
   switch (action.type) {
      case CREDIT_NOTE_DELETE_REQUEST:
         return { loading: true }
      case CREDIT_NOTE_DELETE_SUCCESS:
         return { loading: false, success: true }
      case CREDIT_NOTE_DELETE_FAIL:
         return { loading: false, error: action.payload }
      default:
         return state
   }
}

//5. get all creditNote records reducer
export const allCreditNoteListReducer = (state = { creditNotes: [] }, action) => {
   switch (action.type) {
      case CREDIT_NOTE_LIST_REQUEST:
         return {
            loading: true,
         }
      case CREDIT_NOTE_LIST_SUCCESS:
         return {
            loading: false,
            creditNotes: action.payload.creditNotes,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case CREDIT_NOTE_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case CREDIT_NOTE_LIST_RESET:
         return { creditNotes: [] }
      default:
         return state
   }
}

//6. get all CreditNote records reducer
export const masterDataForCreditNoteReducer = (state = { masterdataForCreditNote: {} }, action) => {
   //logger("Inside masterdataForCreditNoteReducer reducer ####### ", action.type)
   
   switch (action.type) {
       case CREDIT_NOTE_MASTER_LIST_REQUEST:
       return {
         loading: true,
       }
       case CREDIT_NOTE_MASTER_LIST_SUCCESS:
       return {
         loading: false,
         autoIncrementedCreditNo: action.payload.autoIncrementedCreditNo,
         customers: action.payload.customers,
       }
       case CREDIT_NOTE_MASTER_LIST_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case CREDIT_NOTE_MASTER_LIST_RESET:
         return { masterdataForCreditNote: {} }
       default:
         return state
   }
}

//5.1 get all creditNote records reducer
export const allCreditNoteWithTaxListReducer = (state = { creditNotes: [] }, action) => {
   switch (action.type) {
      case CREDIT_NOTE_WITH_TAX_LIST_REQUEST:
         return {
            loading: true,
         }
      case CREDIT_NOTE_WITH_TAX_LIST_SUCCESS:
         return {
            loading: false,
            creditNotes: action.payload.creditNotes,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case CREDIT_NOTE_WITH_TAX_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case CREDIT_NOTE_WITH_TAX_LIST_RESET:
         return { creditNotes: [] }
      default:
         return state
   }
}