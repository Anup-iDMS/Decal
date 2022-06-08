import axios from 'axios'
import { logout } from './../masters/userActions'
import { logger } from './../../util/ConsoleHelper';

import { 
	PRODUCT_CATEGORY_CREATE_REQUEST,
	PRODUCT_CATEGORY_CREATE_SUCCESS,
	PRODUCT_CATEGORY_CREATE_FAIL,
	// PRODUCT_CATEGORY_CREATE_RESET,

	PRODUCT_CATEGORY_DETAILS_REQUEST,
	PRODUCT_CATEGORY_DETAILS_SUCCESS,
	PRODUCT_CATEGORY_DETAILS_FAIL,
	// PRODUCT_CATEGORY_DETAILS_RESET,

	PRODUCT_CATEGORY_UPDATE_REQUEST,
	PRODUCT_CATEGORY_UPDATE_SUCCESS,
	PRODUCT_CATEGORY_UPDATE_FAIL,
	// PRODUCT_CATEGORY_UPDATE_RESET,

	PRODUCT_CATEGORY_DELETE_REQUEST,
	PRODUCT_CATEGORY_DELETE_SUCCESS,
	PRODUCT_CATEGORY_DELETE_FAIL,
	// PRODUCT_CATEGORY_DELETE_RESET,

	PRODUCT_CATEGORY_LIST_REQUEST,
	PRODUCT_CATEGORY_LIST_SUCCESS,
	PRODUCT_CATEGORY_LIST_FAIL,
	// PRODUCT_CATEGORY_LIST_RESET,

} from './../../constants/masters/prodCatConstants';

//1. create a ProdCat record action
export const createProdCategory = (prodCat) => async(dispatch, getState) => {
   //console .log("1. INside create ProdCategory of action ----", prodCat)
   try {
     dispatch({
       type: PRODUCT_CATEGORY_CREATE_REQUEST,
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
     //console .log("2. INside create ProdCategory action Before inserting data  ----")
     const { data } = await axios.post('/api/appdata/prodcat', prodCat, config)
     //console .log("3. Inside create ProdCategory action and data inserted is ==== ", data)
     dispatch({
       type: PRODUCT_CATEGORY_CREATE_SUCCESS,
       payload: data,
     })
     //console .log("4. INside create ProdCategory Acion AFTER DISPATCH data  ----")
   } catch (error) {
    console .log("3. Inside MACHINE MASTER Action and Error Ocureed   ----")
    const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
      
    console .log("3. Inside MACHINE MASTER and Error Message is   ---- ", message)
    dispatch({
      type: PRODUCT_CATEGORY_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })  
  }
}

//2. get a single record action
export const getProdCategoryDetails = (id) => async (dispatch, getState) => {
   try {
     //console .log("1. +++ inside a function to get ProdCategory details +++++")
     dispatch({ type: PRODUCT_CATEGORY_DETAILS_REQUEST })
     //logger("2. ()()() inside prodCat Details BEFORE GETTING prodCat details ********* ")
     const {
       userLogin: { userInfo },
     } = getState()
     //logger("3. ()()() inside ProdCategory Details BEFORE GETTING ProdCategory details ********* ")
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     //logger("4. ()()() inside listProdCategoryDetails BEFORE GETTING ProdCategory details ********* ")
     const { data } = await axios.get(`/api/appdata/prodcat/${id}`, config)
     //logger("***** inside listProdCategoryDetails and details are ********* ",data)
     dispatch({
       type: PRODUCT_CATEGORY_DETAILS_SUCCESS,
       payload: data,
     })
   } catch (error) {
     //logger("Action file --- Error in getting data --------> ", error)
     dispatch({
       type: PRODUCT_CATEGORY_DETAILS_FAIL,
       payload:
         error.response && error.response.data.message
           ? error.response.data.message
           : error.message
       
     })
   }
}

//3. update a single record action
export const updateProdCategory = (prodCat) => async (dispatch, getState) => {
   try {
     dispatch({
       type: PRODUCT_CATEGORY_UPDATE_REQUEST,
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
       `/api/appdata/prodcat/${prodCat._id}`,
       prodCat,
       config
     )
 
     dispatch({
       type: PRODUCT_CATEGORY_UPDATE_SUCCESS,
       payload: data,
     })
     dispatch({ type: PRODUCT_CATEGORY_DETAILS_SUCCESS, payload: data })
   } catch (error) {
     const message =
       error.response && error.response.data.message
         ? error.response.data.message
         : error.message
     if (message === 'Not authorized, token failed') {
       dispatch(logout())
     }
     dispatch({
       type: PRODUCT_CATEGORY_UPDATE_FAIL,
       payload: message,
     })
   }
}

//4. delete a single record action
export const deleteProdCategory = (id) => async (dispatch, getState) => {
   try {
     dispatch({
       type: PRODUCT_CATEGORY_DELETE_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     await axios.delete(`/api/appdata/prodcat/${id}`, config)
 
     dispatch({
       type: PRODUCT_CATEGORY_DELETE_SUCCESS,
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
       type: PRODUCT_CATEGORY_DELETE_FAIL,
       payload: message,
     })
   }
}

//5. get all prodCat records
export const listAllProdCats = (pageNumber = '') => async (dispatch, getState) => {
   try {
     dispatch({
       type: PRODUCT_CATEGORY_LIST_REQUEST,
     })
 
     const {
       userLogin: { userInfo },
     } = getState()
 
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo.token}`,
       },
     }
 
     const { data } = await axios.get(`/api/appdata/prodcat`, config)

     dispatch({
       type: PRODUCT_CATEGORY_LIST_SUCCESS,
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
       type: PRODUCT_CATEGORY_LIST_FAIL,
       payload: message,
     })
   }
}

