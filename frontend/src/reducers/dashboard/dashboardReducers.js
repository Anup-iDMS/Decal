//1. Dashboard Data reducer
import { 
   DASHBOARD_DETAILS_REQUEST,
   DASHBOARD_DETAILS_SUCCESS,
   DASHBOARD_DETAILS_FAIL,
   DASHBOARD_DETAILS_RESET,
   DASHBOARD_CHART_REQUEST,
   DASHBOARD_CHART_SUCCESS,
   DASHBOARD_CHART_FAIL,
   DASHBOARD_CHART_RESET,
   PRODUCTION_CHART_REQUEST,
   PRODUCTION_CHART_SUCCESS,
   PRODUCTION_CHART_FAIL,
   PRODUCTION_CHART_RESET,
   QA_DASHBOARD_REQUEST,
   QA_DASHBOARD_SUCCESS,
   QA_DASHBOARD_FAIL,
   QA_DASHBOARD_RESET,
   SALES_DASHBOARD_REQUEST,
   SALES_DASHBOARD_SUCCESS,
   SALES_DASHBOARD_FAIL,
   SALES_DASHBOARD_RESET,
   PPM_DASHBOARD_REQUEST,
   PPM_DASHBOARD_SUCCESS,
   PPM_DASHBOARD_FAIL,
   PPM_DASHBOARD_RESET,
} from './../../constants/dashboard/dashboardConstants';

export const dashboardDataReducer = (state = { dashboardData: {} }, action) => {
   //logger("Inside dashboardDataReducer reducer ####### ", action.type)
   
   switch (action.type) {
       case DASHBOARD_DETAILS_REQUEST:
       return {
         loading: true,
       }
       case DASHBOARD_DETAILS_SUCCESS:
       return {
         loading: false,
         ytdNetSale: action.payload.ytdNetSale,
         mtdNetSale: action.payload.mtdNetSale,
         mtdCreditNote: action.payload.mtdCreditNote,
         ytdCreditNote: action.payload.ytdCreditNote,
         soValue: action.payload.soValue,
         dispatchValue: action.payload.dispatchValue,
         soBalanceValue: action.payload.soBalanceValue,
         monthlySalesData: action.payload.monthlySalesData,
         monthlySalesOrderData: action.payload.monthlySalesOrderData,
       }
       case DASHBOARD_DETAILS_FAIL:
       return {
         loading: false,
         error: action.payload,
       }
       case DASHBOARD_DETAILS_RESET:
         return { dashboardData: {} }
       default:
         return state
   }
}

export const dashboardChartDataReducer = (state = { dashboardData: {} }, action) => {
  //logger("Inside dashboardDataReducer reducer ####### ", action.type)
  
  switch (action.type) {
      case DASHBOARD_CHART_REQUEST:
      return {
        loading: true,
      }
      case DASHBOARD_CHART_SUCCESS:
      return {
        loading: false,
        customerSalesOrderData: action.payload.customerSalesOrderData,
        topOrderedJCData: action.payload.topOrderedJCData,
      }
      case DASHBOARD_CHART_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
      case DASHBOARD_CHART_RESET:
        return { dashboardData: {} }
      default:
        return state
  }
}


export const dashboardProductionDataReducer = (state = { dashboardData: {} }, action) => {

  switch (action.type) {
    case PRODUCTION_CHART_REQUEST:
    return {
      loading: true,
    }
    case PRODUCTION_CHART_SUCCESS:
    return {
      loading: false,
      fgmiInventoryData: action.payload.fgmiInventoryData,
    }
    case PRODUCTION_CHART_FAIL:
    return {
      loading: false,
      error: action.payload,
    }
    case PRODUCTION_CHART_RESET:
      return { dashboardData: {} }
    default:
      return state
  }
}

export const dashboardSalesDataReducer = (state = { dashboardData: {} }, action) => {

  switch (action.type) {
    case SALES_DASHBOARD_REQUEST:
    return {
      loading: true,
    }
    case SALES_DASHBOARD_SUCCESS:
    return {
      loading: false,
      pendingcount: action.payload.pendingcount,
      mothlyRejectedCount: action.payload.mothlyRejectedCount,
      monthlyRejectedDRNCountData: action.payload.monthlyRejectedDRNCountData,
    }
    case SALES_DASHBOARD_FAIL:
    return {
      loading: false,
      error: action.payload,
    }
    case SALES_DASHBOARD_RESET:
      return { dashboardData: {} }
    default:
      return state
  }
}

export const dashboardQADataReducer = (state = { dashboardData: {} }, action) => {

  switch (action.type) {
      case QA_DASHBOARD_REQUEST:
      return {
        loading: true,
      }
      case QA_DASHBOARD_SUCCESS:
      return {
        loading: false,
        pendingcount: action.payload.pendingcount,
        mothlyRejectedCount: action.payload.mothlyRejectedCount,
        monthlyRejectedDRNCountData: action.payload.monthlyRejectedDRNCountData,
      }
      case QA_DASHBOARD_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
      case QA_DASHBOARD_RESET:
        return { dashboardData: {} }
      default:
        return state
  }
}

export const ppmDashboardDataReducer = (state = { dashboardData: {} }, action) => {
  //logger("Inside ppmDashboardDataReducer reducer ####### ", action.type)
  
  switch (action.type) {
      case PPM_DASHBOARD_REQUEST:
      return {
        loading: true,
      }
      case PPM_DASHBOARD_SUCCESS:
      return {
        loading: false,
        actualPPMData: action.payload.actualPPMData,
        correctedPPMData: action.payload.correctedPPMData,
        monthlyPPMSalesData: action.payload.monthlyPPMSalesData,
        monthlyPPMCreditData: action.payload.monthlyPPMCreditData,
      }
      case PPM_DASHBOARD_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
      case PPM_DASHBOARD_RESET:
        return { dashboardData: {} }
      default:
        return state
  }
}