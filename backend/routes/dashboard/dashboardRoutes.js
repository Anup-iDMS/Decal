import express from 'express';
import { 
   getDashboardData, 
   getDashboardChartData,
   getProductionDashboard,
   getQADashboard,
   getSalesDashboard,
   getPPMDashboardData
} from '../../controllers/dashboard/dashboardController.js';
import { protect, admin } from '../../middleware/authMiddleware.js'


const router = express.Router();

router
   .route('/ppm')
   .get(protect, getPPMDashboardData) //GET /api/dashboard/ppm

router
   .route('/charts')
   .get(protect, getDashboardChartData) //GET /api/dashboard/charts

router
   .route('/production')
   .get(protect, getProductionDashboard) //GET /api/dashboard/production

router
.route('/qa')
.get(protect, getQADashboard) //GET /api/dashboard/qa

router
   .route('/sales')
   .get(protect, getSalesDashboard) //GET /api/dashboard/sales

router
   .route('/')
   .get(protect, getDashboardData) //GET /api/dashboard

export default router;