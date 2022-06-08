import axios from 'axios'
import { logout } from './../masters/userActions'
import { logger } from './../../util/ConsoleHelper';

import { 
	PRODUCT_CODE_CREATE_REQUEST,
	PRODUCT_CODE_CREATE_SUCCESS,
	PRODUCT_CODE_CREATE_FAIL,
	// PRODUCT_CODE_CREATE_RESET,

	PRODUCT_CODE_DETAILS_REQUEST,
	PRODUCT_CODE_DETAILS_SUCCESS,
	PRODUCT_CODE_DETAILS_FAIL,
	// PRODUCT_CODE_DETAILS_RESET,

	PRODUCT_CODE_UPDATE_REQUEST,
	PRODUCT_CODE_UPDATE_SUCCESS,
	PRODUCT_CODE_UPDATE_FAIL,
	// PRODUCT_CODE_UPDATE_RESET,

	PRODUCT_CODE_DELETE_REQUEST,
	PRODUCT_CODE_DELETE_SUCCESS,
	PRODUCT_CODE_DELETE_FAIL,
	// PRODUCT_CODE_DELETE_RESET,

	PRODUCT_CODE_LIST_REQUEST,
	PRODUCT_CODE_LIST_SUCCESS,
	PRODUCT_CODE_LIST_FAIL,
  
  PRODUCT_CODE_MASTER_DATA_REQUEST,
  PRODUCT_CODE_MASTER_DATA_SUCCESS,
  PRODUCT_CODE_MASTER_DATA_FAIL,
	// PRODUCT_CODE_LIST_RESET,

} from './../../constants/masters/prodCodeConstants';

//1. create a ProdCat record action
export const createProductCode = (prodCat) => async(dispatch, getState) => {
   //console .log("1. INside create ProductCode of action ----", prodCat)
   try {
     dispatch({
       type: PRODUCT_CODE_CREATE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState();
 
     const config = {
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
     //console .log("2. INside create ProductCode action Before inserting data  ----")
     const { data } = await axios.post('/api/appdata/prodcode', prodCat, config)
     //console .log("3. Inside create ProductCode action and data inserted is ==== ", data)
     dispatch({
       type: PRODUCT_CODE_CREATE_SUCCESS,
       payload: data,
     })
     //console .log("4. INside create ProductCode Acion AFTER DISPATCH data  ----")
   } catch (error) {
    console .log("3. Inside MACHINE MASTER Action and Error Ocureed   ----")
    const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
      
    console .log("3. Inside MACHINE MASTER and Error Message is   ---- ", message)
    dispatch({
      type: PRODUCT_CODE_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })  
  }
}

//2. get a single record action
export const getProductCodeDetails = (id) => async (dispatch, getState) => {
   try {
     //console .log("1. +++ inside a function to get ProductCode details +++++")
     dispatch({ type: PRODUCT_CODE_DETAILS_REQUEST })
     //logger("2. ()()() inside prodCat Details BEFORE GETTING prodCat details ********* ")
     const {
       userLogin: { userInfo },
     } = getState()
     //logger("3. ()()() inside ProductCode Details BEFORE GETTING ProductCode details ********* ")
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     //logger("4. ()()() inside listProductCodeDetails BEFORE GETTING ProductCode details ********* ")
     const { data } = await axios.get(`/api/appdata/prodcode/${id}`, config)
     //logger("***** inside listProductCodeDetails and details are ********* ",data)
     dispatch({
       type: PRODUCT_CODE_DETAILS_SUCCESS,
       payload: data,
     })
   } catch (error) {
     //logger("Action file --- Error in getting data --------> ", error)
     dispatch({
       type: PRODUCT_CODE_DETAILS_FAIL,
       payload:
         error.response && error.response.data.message
           ? error.response.data.message
           : error.message
       
     })
   }
}

//3. update a single record action
export const updateProductCode = (prodCat) => async (dispatch, getState) => {
   try {
     dispatch({
       type: PRODUCT_CODE_UPDATE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     const { data } = await axios.put(
       `/api/appdata/prodcode/${prodCat._id}`,
       prodCat,
       config
     )
 
     dispatch({
       type: PRODUCT_CODE_UPDATE_SUCCESS,
       payload: data,
     })
     dispatch({ type: PRODUCT_CODE_DETAILS_SUCCESS, payload: data })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: PRODUCT_CODE_UPDATE_FAIL,
       payload: message,
     })
   }
}

//4. delete a single record action
export const deleteProductCode = (id) => async (dispatch, getState) => {
   try {
     dispatch({
       type: PRODUCT_CODE_DELETE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     await axios.delete(`/api/appdata/prodcode/${id}`, config)
 
     dispatch({
       type: PRODUCT_CODE_DELETE_SUCCESS,
     })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: PRODUCT_CODE_DELETE_FAIL,
       payload: message,
     })
   }
}

//5. get all prodCat records
export const listAllProdCodes = (pageNumber = '') => async (dispatch, getState) => {
   try {
     dispatch({
       type: PRODUCT_CODE_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     const { data } = await axios.get(`/api/appdata/prodcode`, config)

     dispatch({
       type: PRODUCT_CODE_LIST_SUCCESS,
       payload: data,
     })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: PRODUCT_CODE_LIST_FAIL,
       payload: message,
     })
   }
}

//6. get all all master data for Product Code records
export const getAllMasterDataForProductCode = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_CODE_MASTER_DATA_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    //logger("2. Here inside Action to get master data for JC .............")
    const { data } = await axios.get(`/api/appdata/prodcode/masterdata`, config)
    //logger("3.~~~~~~~~~~~~~~~~~~~ Here inside customersList.............", data)
    dispatch({
      type: PRODUCT_CODE_MASTER_DATA_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: PRODUCT_CODE_MASTER_DATA_FAIL,
      payload: message,
    })
  }
}