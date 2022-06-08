import express from 'express';
import {
  authUser,
  registerUser,
  getUsers,
  getUserProfile,
  updateUserProfile,
  getUserById,
  getAllUsers,
  getAllMasterDataForUser,

  createRole,
  getRoleById,
  updateRole,
  getAllRoles,

  //menu items
  createMenuItem,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  getAllMasterDataForMenu,
  getAllSubmenusByMenuId,

  createRoleMenuItem,
} from '../../controllers/master/userController.js';
import { protect, admin, superAdmin } from '../../middleware/authMiddleware.js';



const router = express.Router();

/** ROLE MANAGEMENT ROUTES */
router
  .route('/role/all')
  .get(protect, getAllRoles); //GET /api/users/role/all

router
  .route('/role/:id')
  .get(protect, getRoleById) //GET /api/users/role/:id
  .put(protect, updateRole) //PUT /api/users/role/:id

router
  .route('/role')
  .post(createRole);

/** MENU MANAGEMENT ROUTES */
router
  .route('/menuitems/masterdata')
  .get(protect, getAllMasterDataForMenu) //GET /api/users/menuitems/masterdata

router
  .route('/menuitems/submenu/:id')
  .get(protect, getAllSubmenusByMenuId) //GET /api/users/menuitems/submenu
  

router
  .route('/menuitems/all')
  .get(protect, getAllMenuItems); //GET /api/users/menuitems/all

router
  .route('/menuitems/:id')
  .get(protect, getMenuItemById) //GET /api/users/menuitems/:id
  .put(protect, updateMenuItem) //PUT /api/users/menuitems/:id
  .delete(protect, deleteMenuItem) //PUT /api/users/menuitems/:id

router
  .route('/menuitems')
  .post(protect, createMenuItem);

  /** ROLE-MENU MANAGEMENT ROUTES */

router.post('/rolemenuitem', createRoleMenuItem);

/** USER MANAGEMENT ROUTES */
router
  .route('/')
  .post(protect, registerUser) //POST /api/users
  .get(protect, admin, getUsers);

router
  .route('/profile')
  .get(protect, getUserProfile)

router.post('/login', authUser); //POST /api/users

router
  .route("/all")
  .get(protect, getAllUsers) //GET /api/users/all

router
  .route('/masterdata')
  .get(protect, getAllMasterDataForUser) //GET /api/users/masterdata

router
  .route('/:id')
  .get(getUserById) //GET /api/users/:id
  .put(updateUserProfile) //PUT /api/users/:id


export default router;

