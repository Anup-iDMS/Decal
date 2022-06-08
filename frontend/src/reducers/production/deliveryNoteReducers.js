import { 
	DELIVERY_NOTE_CREATE_REQUEST,
	DELIVERY_NOTE_CREATE_SUCCESS,
	DELIVERY_NOTE_CREATE_FAIL,
	DELIVERY_NOTE_CREATE_RESET,

	DELIVERY_NOTE_DETAILS_REQUEST,
	DELIVERY_NOTE_DETAILS_SUCCESS,
	DELIVERY_NOTE_DETAILS_FAIL,
	DELIVERY_NOTE_DETAILS_RESET,

	DELIVERY_NOTE_UPDATE_REQUEST,
	DELIVERY_NOTE_UPDATE_SUCCESS,
	DELIVERY_NOTE_UPDATE_FAIL,
	DELIVERY_NOTE_UPDATE_RESET,

	DELIVERY_NOTE_DELETE_REQUEST,
	DELIVERY_NOTE_DELETE_SUCCESS,
	DELIVERY_NOTE_DELETE_FAIL,
	// DELIVERY_NOTE_DELETE_RESET,

	DELIVERY_NOTE_LIST_REQUEST,
	DELIVERY_NOTE_LIST_SUCCESS,
	DELIVERY_NOTE_LIST_FAIL,
	DELIVERY_NOTE_LIST_RESET,

   DELIVERY_NOTE_MASTER_LIST_REQUEST,
   DELIVERY_NOTE_MASTER_LIST_SUCCESS,
   DELIVERY_NOTE_MASTER_LIST_FAIL,
   DELIVERY_NOTE_MASTER_LIST_RESET,
} from './../../constants/production/deliveryNoteConstants'

//1. create a deliveryNote record reducer
export const deliveryNoteCreateReducer = (state={}, action) => {
   //logger("Inside DeliveryNote create Reducer ####### ", action.type)
   switch (action.type) {
      case DELIVERY_NOTE_CREATE_REQUEST:
         return {
            loading: true,
         }
      case DELIVERY_NOTE_CREATE_SUCCESS:
         return {
            loading: false,
            success: true,
            deliveryNote: action.payload,
         }
      case DELIVERY_NOTE_CREATE_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case DELIVERY_NOTE_CREATE_RESET:
         return {}
      default:
         return state
   }
}

//2. get a single record reducer
export const deliveryNoteDetailsReducer = (state = { deliveryNote: {} }, action) => {
   //logger("Inside DeliveryNote Recucer and action is &&&&&&& ", action.type)
   switch (action.type) {
      case DELIVERY_NOTE_DETAILS_REQUEST:
         return { ...state, loading: true }
      case DELIVERY_NOTE_DETAILS_SUCCESS:
         return { loading: false, deliveryNote: action.payload }
      case DELIVERY_NOTE_DETAILS_FAIL:
         return { loading: false, error: action.payload, deliveryNote:{} }
      case DELIVERY_NOTE_DETAILS_RESET:
            return {}
      default:
         return state
   }
}


//3. update a single record reducer
export const deliveryNoteUpdateReducer = (state = { deliveryNote: {} }, action) => {
   switch (action.type) {
      case DELIVERY_NOTE_UPDATE_REQUEST:
         return { loading: true }
      case DELIVERY_NOTE_UPDATE_SUCCESS:
         return { loading: false, success: true, deliveryNote: action.payload }
      case DELIVERY_NOTE_UPDATE_FAIL:
         return { loading: false, error: action.payload }
      case DELIVERY_NOTE_UPDATE_RESET:
         return { deliveryNote: {} }
      default:
         return state
   }
}

//4. delete a single record reducer
export const deliveryNoteDeleteReducer = (state = {}, action) => {
   switch (action.type) {
      case DELIVERY_NOTE_DELETE_REQUEST:
         return { loading: true }
      case DELIVERY_NOTE_DELETE_SUCCESS:
         return { loading: false, success: true }
      case DELIVERY_NOTE_DELETE_FAIL:
         return { loading: false, error: action.payload }
      default:
         return state
   }
}

//5. get all deliveryNote records reducer
export const allDeliveryNoteListReducer = (state = { deliveryNotes: [] }, action) => {
   switch (action.type) {
      case DELIVERY_NOTE_LIST_REQUEST:
         return {
            loading: true,
         }
      case DELIVERY_NOTE_LIST_SUCCESS:
         return {
            loading: false,
            deliveryNotes: action.payload.deliveryNotes,
            pages: action.payload.pages,
            page: action.payload.page,
         }
      case DELIVERY_NOTE_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         }
      case DELIVERY_NOTE_LIST_RESET:
         return { deliveryNotes: [] }
      default:
         return state
   }
}

//6. get all DeliveryNote records reducer
export const masterDataForDeliveryNoteReducer = (state = { masterdataForDeliveryNote: {} }, action) => {
   //logger("Inside masterdataForDeliveryNoteReducer reducer ####### ", action.type)
   
   switch (action.type) {
       case DELIVERY_NOTE_MASTER_LIST_REQUEST:
       return {
         loading: true,
       }
       case DELIVERY_NOTE_MASTER_LIST_SUCCESS:
       return {
         loading: false,
         salesInvoices: action.payload.salesInvoices,
       }
       case DELIVERY_NOTE_MASTER_LIST_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case DELIVERY_NOTE_MASTER_LIST_RESET:
         return { masterdataForDeliveryNote: { } }
       default:
         return state
   }
}