import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,

  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,

  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_RESET,

  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_RESET,

  USER_MASTER_DATA_REQUEST,
  USER_MASTER_DATA_SUCCESS,
  USER_MASTER_DATA_FAIL,
  USER_MASTER_DATA_RESET,

  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,

  /** ROLE MANAGEMENT CONSTANTS */
  ROLE_CREATE_REQUEST,
	ROLE_CREATE_SUCCESS,
	ROLE_CREATE_FAIL,
	ROLE_CREATE_RESET,

	ROLE_DETAILS_REQUEST,
	ROLE_DETAILS_SUCCESS,
	ROLE_DETAILS_FAIL,
	ROLE_DETAILS_RESET,

	ROLE_UPDATE_REQUEST,
	ROLE_UPDATE_SUCCESS,
	ROLE_UPDATE_FAIL,
	ROLE_UPDATE_RESET,

	ROLE_DELETE_REQUEST,
	ROLE_DELETE_SUCCESS,
	ROLE_DELETE_FAIL,
	ROLE_DELETE_RESET,

	ROLE_LIST_REQUEST,
	ROLE_LIST_SUCCESS,
	ROLE_LIST_FAIL,
	ROLE_LIST_RESET,
  /** MENU MANAGEMENT */
  MENU_CREATE_REQUEST,
	MENU_CREATE_SUCCESS,
	MENU_CREATE_FAIL,
	MENU_CREATE_RESET,

	MENU_DETAILS_REQUEST,
	MENU_DETAILS_SUCCESS,
	MENU_DETAILS_FAIL,
	MENU_DETAILS_RESET,

	MENU_UPDATE_REQUEST,
	MENU_UPDATE_SUCCESS,
	MENU_UPDATE_FAIL,
	MENU_UPDATE_RESET,

	MENU_DELETE_REQUEST,
	MENU_DELETE_SUCCESS,
	MENU_DELETE_FAIL,
	MENU_DELETE_RESET,

	MENU_LIST_REQUEST,
	MENU_LIST_SUCCESS,
	MENU_LIST_FAIL,
	MENU_LIST_RESET,

  SUBMENU_LIST_REQUEST,
  SUBMENU_LIST_SUCCESS,
  SUBMENU_LIST_FAIL,
  SUBMENU_LIST_RESET,
  
  MENU_MASTER_DATA_REQUEST,
  MENU_MASTER_DATA_SUCCESS,
  MENU_MASTER_DATA_FAIL,
  MENU_MASTER_DATA_RESET
  
} from './../../constants/masters/userConstants'

//1. create a user record reducer
export const userCreateReducer = (state={}, action) => {
  //logger("Inside User create Reducer ####### ", action.type)
  switch (action.type) {
     case USER_REGISTER_REQUEST:
        return {
           loading: true,
        }
     case USER_REGISTER_SUCCESS:
        return {
           loading: false,
           success: true,
           user: action.payload,
        }
     case USER_REGISTER_FAIL:
        return {
           loading: false,
           error: action.payload,
        }
     case USER_REGISTER_RESET:
        return {}
     default:
        return state
  }
}

export const userLoginReducer = (state = {}, action) => {
  //logger("2. Inside userLoginReducer and action is ", action)
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true }
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload }
    case USER_LOGOUT:
      return {}
    default:
      return state
  }
}

export const userDetailsReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return { ...state, loading: true }
    case USER_DETAILS_SUCCESS:
      return { loading: false, user: action.payload }
    case USER_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case USER_DETAILS_RESET:
      return { user: {} }
    default:
      return state
  }
}

export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return { loading: true }
    case USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true, userInfo: action.payload }
    case USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload }
    case USER_UPDATE_PROFILE_RESET:
      return {}
    default:
      return state
  }
}

//5. get all user records reducer
export const allUserListReducer = (state = { users: [] }, action) => {
  switch (action.type) {
     case USER_LIST_REQUEST:
        return {
           loading: true,
        }
     case USER_LIST_SUCCESS:
        return {
           loading: false,
           users: action.payload,
        }
     case USER_LIST_FAIL:
        return {
           loading: false,
           error: action.payload,
        }
     case USER_LIST_RESET:
        return { users: [] }
     default:
        return state
  }
}

//6. get all User records reducer
export const masterDataForUserReducer = (state = { masterdataForUser: {} }, action) => {
  //logger("Inside masterdataForUserReducer reducer ####### ", action.type)
  
  switch (action.type) {
      case USER_MASTER_DATA_REQUEST:
      return {
        loading: true,
      }
      case USER_MASTER_DATA_SUCCESS:
      return {
        loading: false,
        roles: action.payload.roles,
        autoIncrementedUserNo: action.payload.autoIncrementedUserNo,
      }
      case USER_MASTER_DATA_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
      case USER_MASTER_DATA_RESET:
        return { masterdataForUser: { } }
      default:
        return state
  }
}

/** ROLE MANAGEMENT FUNCTIONS */
//1. create a role record reducer
export const roleCreateReducer = (state={}, action) => {
  //logger("Inside Role create Reducer ####### ", action.type)
  switch (action.type) {
    case ROLE_CREATE_REQUEST:
      return {
        loading: true,
      }
    case ROLE_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        role: action.payload,
      }
    case ROLE_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case ROLE_CREATE_RESET:
      return {}
    default:
      return state
  }
}

//2. get a single record reducer
export const roleDetailsReducer = (state = { role: {} }, action) => {
 // logger("Inside Role Recucer and action is &&&&&&& ", action.payload)
  switch (action.type) {
    case ROLE_DETAILS_REQUEST:
      return { ...state, loading: true }
    case ROLE_DETAILS_SUCCESS:
      return { loading: false, role: action.payload }
    case ROLE_DETAILS_FAIL:
      return { loading: false, error: action.payload, role:{} }
    default:
      return state
  }
}

//3. update a single record reducer
export const roleUpdateReducer = (state = { role: {} }, action) => {
  switch (action.type) {
    case ROLE_UPDATE_REQUEST:
      return { loading: true }
    case ROLE_UPDATE_SUCCESS:
      return { loading: false, success: true, role: action.payload }
    case ROLE_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case ROLE_UPDATE_RESET:
      return { role: {} }
    default:
      return state
  }
}

//4. delete a single record reducer
export const roleDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case ROLE_DELETE_REQUEST:
      return { loading: true }
    case ROLE_DELETE_SUCCESS:
      return { loading: false, success: true }
    case ROLE_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

//5. get all role records reducer
export const allRoleListReducer = (state = { roles: [] }, action) => {
  switch (action.type) {
    case ROLE_LIST_REQUEST:
      return {
        loading: true,
      }
    case ROLE_LIST_SUCCESS:
      return {
        loading: false,
        roles: action.payload.roles
      }
    case ROLE_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case ROLE_LIST_RESET:
      return { roles: [] }
    default:
      return state
  }
}

/** MENU MANAGEMENT */
//1. create a menuItem record reducer
export const menuItemCreateReducer = (state={}, action) => {
  //logger("Inside MenuItem create Reducer ####### ", action.type)
  switch (action.type) {
    case MENU_CREATE_REQUEST:
      return {
        loading: true,
      }
    case MENU_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        menuItem: action.payload,
      }
    case MENU_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case MENU_CREATE_RESET:
      return {}
    default:
      return state
  }
}

//2. get a single record reducer
export const menuItemDetailsReducer = (state = { menuItem: {} }, action) => {
  //logger("Inside MenuItem Recucer and action is &&&&&&& ", action.type)
  switch (action.type) {
    case MENU_DETAILS_REQUEST:
      return { ...state, loading: true }
    case MENU_DETAILS_SUCCESS:
      return { loading: false, menuItem: action.payload }
    case MENU_DETAILS_FAIL:
      return { loading: false, error: action.payload, menuItem:{} }
    default:
      return state
  }
}

//3. update a single record reducer
export const menuItemUpdateReducer = (state = { menuItem: {} }, action) => {
  switch (action.type) {
    case MENU_UPDATE_REQUEST:
      return { loading: true }
    case MENU_UPDATE_SUCCESS:
      return { loading: false, success: true, menuItem: action.payload }
    case MENU_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case MENU_UPDATE_RESET:
      return { menuItem: {} }
    default:
      return state
  }
}

//4. delete a single record reducer
export const menuItemDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case MENU_DELETE_REQUEST:
      return { loading: true }
    case MENU_DELETE_SUCCESS:
      return { loading: false, success: true }
    case MENU_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

//5. get all menuItem records reducer
export const allMenuItemListReducer = (state = { menuItems: [] }, action) => {
  switch (action.type) {
    case MENU_LIST_REQUEST:
      return {
        loading: true,
      }
    case MENU_LIST_SUCCESS:
      return {
        loading: false,
        menuItems: action.payload.menuItems
      }
    case MENU_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case MENU_LIST_RESET:
      return { menuItems: [] }
    default:
      return state
  }
}

//6. get all Menu records reducer
export const masterDataForMenuReducer = (state = { masterdataForMenu: {} }, action) => {
  //logger("Inside masterdataForMenuReducer reducer ####### ", action.type)
  
  switch (action.type) {
      case MENU_MASTER_DATA_REQUEST:
      return {
        loading: true,
      }
      case MENU_MASTER_DATA_SUCCESS:
      return {
        loading: false,
        roles: action.payload.roles,
        menuItems: action.payload.menuItems,
      }
      case MENU_MASTER_DATA_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
      case MENU_MASTER_DATA_RESET:
        return { masterdataForMenu: { } }
      default:
        return state
  }
}

//7. get all submenuItem records reducer
export const allSubMenuItemListReducer = (state = { menuItems: [] }, action) => {
  switch (action.type) {
    case SUBMENU_LIST_REQUEST:
      return {
        loading: true,
      }
    case SUBMENU_LIST_SUCCESS:
      return {
        loading: false,
        menuItems: action.payload.menuItems
      }
    case SUBMENU_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case SUBMENU_LIST_RESET:
      return { menuItems: [] }
    default:
      return state
  }
}