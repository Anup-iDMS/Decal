import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import back from './layout/back'
import front from './layout/front'

// React Notification
import 'react-notifications/lib/notifications.css'
import { NotificationContainer } from 'react-notifications'

/** Login Screen */
import LoginScreen from './screens/unlogged/LoginScreen'

/** Dashboard Screen */
import DashboardScreen from './screens/dashboard/DashboardScreen'
import ChartDashboardScreen from './screens/dashboard/ChartDashboardScreen'
import ProductionDashboardScreen from './screens/dashboard/ProductionDashboardScreen'
import QADashboardScreen from './screens/dashboard/QADashboardScreen'
import SalesDashboardScreen from './screens/dashboard/SalesDashboardScreen'
import PPMDashboardScreen from './screens/dashboard/PPMDashboardScreen'

/** Customer Master Screens */
import CreateCustomerScreen from './screens/customermaster/CreateCustomerScreen'
import EditCustomerScreen from './screens/customermaster/EditCustomerScreen'
import CustomerMasterListScreen from './screens/customermaster/CustomerMasterListScreen'

// Supplier Master Screens
import SupplierMasterList from './screens/suppliermaster/SupplierMasterList.js'
import CreateSupplierScreen from './screens/suppliermaster/CreateSupplierScreen.js'
import EditSupplierScreen from './screens/suppliermaster/EditSupplierScreen.js'

/** JC Master Screens */
import JCMasterListScreen from './screens/jcmaster/JCMasterListScreen'
import CreateJCMasterScreen from './screens/jcmaster/CreateJCMasterScreen'
import BulkJCUploadScreen from './screens/jcmaster/BulkJCUploadScreen'
import EditJCMasterScreen from './screens/jcmaster/EditJCMasterScreen'
import JCMasterReportListScreen from './screens/jcmaster/JCMasterReportListScreen'

/** HSN Master Screens */
import HSNCreateScreen from './screens/hsnsac/HSNCreateScreen'
import HSNEditScreen from './screens/hsnsac/HSNEditScreen'
import HSNListScreen from './screens/hsnsac/HSNListScreen'
/** SAC Master Screens */
import SACCreateScreen from './screens/hsnsac/SACCreateScreen'
import SACEditScreen from './screens/hsnsac/SACEditScreen'
import SACListScreen from './screens/hsnsac/SACListScreen'

/* Machine Master Screen */
import MachineMasterCreateScreen from './screens/machinemaster/MachineMasterCreateScreen'
import MachineMasterEditScreen from './screens/machinemaster/MachineMasterEditScreen'
import MachineMasterListScreen from './screens/machinemaster/MachineMasterListScreen'

/** Product Code Master Screen */
import ProductCodeListScreen from './screens/productcode/ProductCodeListScreen'
import ProductCodeEditScreen from './screens/productcode/ProductCodeEditScreen'
import ProductCodeCreateScreen from './screens/productcode/ProductCodeCreateScreen'

/** Product Category Master Screen */
import ProductCategoryListScreen from './screens/productcategory/ProductCategoryListScreen'
import ProductCategoryEditScreen from './screens/productcategory/ProductCategoryEditScreen'
import ProductCategoryCreateScreen from './screens/productcategory/ProductCategoryCreateScreen'

/** UOM Screen */
import UOMListScreen from './screens/uom/UOMListScreen'
import UOMEditScreen from './screens/uom/UOMEditScreen'
import UOMCreateScreen from './screens/uom/UOMCreateScreen'

/** Sales Order Screens */
import SalesOrderListScreen from './screens/sales/SalesOrderListScreen'
import SalesOrderCreateScreen from './screens/sales/SalesOrderCreateScreen'
import SalesOrderEditScreen from './screens/sales/SalesOrderEditScreen'
import SalesOrderConfirmationScreen from './screens/sales/SalesOrderConfirmationScreen'
import SalesOrderViewScreen from './screens/sales/SalesOrderViewScreen'
import SalesOrderCancelScreen from './screens/sales/SalesOrderCancelScreen'
import OpenSalesOrdersListScreen from './screens/sales/OpenSalesOrdersListScreen'
/** Sales Order Reports Screens */
import BackOrdersBySOReportScreen from './screens/sales/reports/BackOrdersBySOReportScreen'
import SODetailsByLineReportScreen from './screens/sales/reports/SODetailsByLineReportScreen'
import CancelSODetailsByLineReportScreen from './screens/sales/reports/CancelSODetailsByLineReportScreen'
import BackOrdersByJCReportScreen from './screens/sales/reports/BackOrdersByJCReportScreen'

/** Job Card Input Screens */
import JobCardInputListScreen from './screens/production/JobCardInputListScreen'
import JobCardInputCreateScreen from './screens/production/JobCardInputCreateScreen'
import JobCardInputEditScreen from './screens/production/JobCardInputEditScreen'

/** Job Card Output Screens */
import JobCardOutputListScreen from './screens/production/JobCardOutputListScreen'
import JobCardOutputCreateScreen from './screens/production/JobCardOutputCreateScreen'
import JobCardOutputEditScreen from './screens/production/JobCardOutputEditScreen'

/** FGMI Screens */
import FGMIListScreen from './screens/production/FGMIListScreen'
import FGMICreateScreen from './screens/production/FGMICreateScreen'
import FGMIEditScreen from './screens/production/FGMIEditScreen'
import FGMICorrectionScreen from './screens/production/FGMICorrectionScreen'

/** Delivery Request Note (DRN) Screens */
import DRNListScreen from './screens/production/DRNListScreen'
import DRNCreateScreen from './screens/production/DRNCreateScreen'
import DRNEditScreen from './screens/production/DRNEditScreen'

/** Delivery Request Note Approval (DRN) Screens */
import DRNApprovalListScreen from './screens/qa/DRNApprovalListScreen'
import DRNApprovalCreateScreen from './screens/qa/DRNApprovalCreateScreen'
import DRNApprovalEditScreen from './screens/qa/DRNApprovalEditScreen'
import RejectedDRNListScreen from './screens/sales/reports/RejectedDRNListScreen'

/** Tax Invoice Approval Screens */
import InvoiceApprovalListScreen from './screens/sales/InvoiceApprovalListScreen'
import InvoiceApprovalEditScreen from './screens/sales/InvoiceApprovalEditScreen'

/** Approved Tax Invoices Screens */
import SalesInvoiceListScreen from './screens/sales/SalesInvoiceListScreen'
import SalesInvoiceWithTaxListScreen from './screens/sales/SalesInvoiceWithTaxListScreen'
import SalesInvoiceEditScreen from './screens/sales/SalesInvoiceEditScreen'

/** Tax Invoice Reports Screens */
import SIDetailsByLineReportScreen from './screens/sales/reports/SIDetailsByLineReportScreen'
import SIDetailsByDispatchScreen from './screens/sales/reports/SIDetailsByDispatchScreen'

/** Utility Screens */
import UtilitySettingsScreen from './screens/utility/UtilitySettingsScreen'
import ConfigurationScreen from './screens/utility/ConfigurationScreen'
import AppConfigurationScreen from './screens/utility/AppConfigurationScreen'

/** Delivery Note Screens */
import DeliveryNoteListScreen from './screens/production/DeliveryNoteListScreen'
import DeliveryNoteCreateScreen from './screens/production/DeliveryNoteCreateScreen'
import DeliveryNoteEditScreen from './screens/production/DeliveryNoteEditScreen'

/** Dispatch Details Screens */
import DispatchDetailsListScreen from './screens/production/DispatchDetailsListScreen'
import DispatchDetailsCreateScreen from './screens/production/DispatchDetailsCreateScreen'
import DispatchDetailsEditScreen from './screens/production/DispatchDetailsEditScreen'
import ASNScreen from './screens/production/ASNScreen'

/** Debit Note Entry Screen */
import CreditNoteListScreen from './screens/sales/CreditNoteListScreen'
import CreditNoteEditScreen from './screens/sales/CreditNoteEditScreen'
import CreditNotePrintScreen from './screens/sales/CreditNotePrintScreen'
import CreditNoteCreateScreen from './screens/sales/CreditNoteCreateScreen'

/** User Management Screen */
import UserListScreen from './screens/user/UserListScreen'
import UserEditScreen from './screens/user/UserEditScreen'
import UserCreateScreen from './screens/user/UserCreateScreen'

/** Role Management Screen */
import RoleListScreen from './screens/user/RoleListScreen'
import RoleEditScreen from './screens/user/RoleEditScreen'
import RoleCreateScreen from './screens/user/RoleCreateScreen'

/** Menu Management Screen */
import MenuListScreen from './screens/user/MenuListScreen'
import MenuEditScreen from './screens/user/MenuEditScreen'
import MenuCreateScreen from './screens/user/MenuCreateScreen'
import SubMenuItemDisplayScreen from './screens/user/SubMenuItemDisplayScreen'
import AppMgmtSubMenuItemDisplayScreen from './screens/user/AppMgmtSubMenuItemDisplayScreen'

/** Issue Screens */
import IssueCreateScreen from './screens/issuemaster/IssueCreateScreen'
import IssueEditScreen from './screens/issuemaster/IssueEditScreen'
import IssueListScreen from './screens/issuemaster/IssueListScreen'

/** Auto Increment Screens */
import AutoIncrementListScreen from './screens/autoincrement/AutoIncrementListScreen'
import AutoIncrementEditScreen from './screens/autoincrement/AutoIncrementEditScreen'
import AutoIncrementCreateScreen from './screens/autoincrement/AutoIncrementCreateScreen'

/** Company Master Screens */
import CompanyMasterListScreen from './screens/companymaster/CompanyMasterListScreen'
import CompanyMasterEditScreen from './screens/companymaster/CompanyMasterEditScreen'

/** PDIR Config Screens */
import PDIRConfigScreen from './screens/qa/PDIRConfigScreen'
import InspectionParameterEditScreen from './screens/qa/InspectionParameterEditScreen'
import InspectionParameterCreateScreen from './screens/qa/InspectionParameterCreateScreen'
import InspectionMethodCreateScreen from './screens/qa/InspectionMethodCreateScreen'
import InspectionMethodEditScreen from './screens/qa/InspectionMethodEditScreen'
import PDIRTemplateCreateScreen from './screens/qa/PDIRTemplateCreateScreen'
import PDIRTemplateEditScreen from './screens/qa/PDIRTemplateEditScreen'
import PDIRListScreen from './screens/qa/PDIRListScreen'
import PDIRCreateScreen from './screens/qa/PDIRCreateScreen'
import PDIREditScreen from './screens/qa/PDIREditScreen'
import PDIRPrintScreen from './screens/qa/PDIRPrintScreen'
import PDIRReportScreen from './screens/qa/PDIRReportScreen'
/** Yield Report Screen */
import YieldReportScreen from './screens/qa/reports/YieldReportScreen'
import PPMLevelPrintReportScreen from './screens/qa/PPMLevelPrintReportScreen'
/** Service Master */
import ServiceMasterListScreen from './screens/servicemaster/ServiceMasterListScreen'
import CreateServiceMasterScreen from './screens/servicemaster/CreateServiceMasterScreen'
import EditServiceMasterScreen from './screens/servicemaster/EditServiceMasterScreen'

/** Credit Note with Tax Report */
import CreditNoteWithTaxListScreen from './screens/sales/reports/CreditNoteWithTaxListScreen'

/** Application Parameters Screens */
import AppParametersListScreen from './screens/appmanagement/AppParametersListScreen'
import AppParametersEditScreen from './screens/appmanagement/AppParametersEditScreen'
import AppParametersCreateScreen from './screens/appmanagement/AppParametersCreateScreen'
/** PPM Report Correction Screen */
import PPMReportCorrectionScreen from './screens/qa/PPMReportCorrectionScreen'

/** Service Code Screens */
import ServiceCodeListScreen from './screens/servicecode/ServiceCodeListScreen'
import ServiceCodeEditScreen from './screens/servicecode/ServiceCodeEditScreen'
import ServiceCodeCreateScreen from './screens/servicecode/ServiceCodeCreateScreen'

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      <Layout>
        <Component {...props}></Component>
      </Layout>
    )}
  />
)

const App = () => {
  return (
    <Router>
      {/* Login Screens */}
      <AppRoute path='/' exact layout={front} component={LoginScreen} />
      <AppRoute path='/login' exact layout={front} component={LoginScreen} />

      {/* Dashboard Screens */}
      <AppRoute path='/home' exact layout={back} component={DashboardScreen} />
      <AppRoute
        path='/chartdashboard'
        exact
        layout={back}
        component={ChartDashboardScreen}
      />
      <AppRoute
        path='/proddashboard'
        exact
        layout={back}
        component={ProductionDashboardScreen}
      />
      <AppRoute
        path='/salesdashboard'
        exact
        layout={back}
        component={SalesDashboardScreen}
      />
      <AppRoute
        path='/qadashboard'
        exact
        layout={back}
        component={QADashboardScreen}
      />
      <AppRoute
        path='/ppm'
        exact
        layout={back}
        component={PPMDashboardScreen}
      />

      {/* Customer Master Screens */}
      <AppRoute
        path='/customerlist'
        exact
        layout={back}
        component={CustomerMasterListScreen}
      />
      <AppRoute
        path='/customerlist/:pageNumber'
        exact
        layout={back}
        component={CustomerMasterListScreen}
      />
      <AppRoute
        path='/createcustomer'
        exact
        layout={back}
        component={CreateCustomerScreen}
      />
      <AppRoute
        path='/customers/:id/edit'
        exact
        layout={back}
        component={EditCustomerScreen}
      />
      <AppRoute
        path='/customers'
        exact
        layout={back}
        component={CreateCustomerScreen}
      />

      {/* Supplier Master Screens */}
      <AppRoute
        path='/supplierlist'
        exact
        layout={back}
        component={SupplierMasterList}
      />
      <AppRoute
        path='/supplierlist/:pageNumber'
        exact
        layout={back}
        component={SupplierMasterList}
      />
      <AppRoute
        path='/createsupplier'
        exact
        layout={back}
        component={CreateSupplierScreen}
      />
      <AppRoute
        path='/suppliers'
        exact
        layout={back}
        component={CreateSupplierScreen}
      />
      <AppRoute
        path='/suppliers/:id/edit'
        exact
        layout={back}
        component={EditSupplierScreen}
      />

      {/* JC Master Screens */}
      <AppRoute
        path='/jcmasterlist'
        exact
        layout={back}
        component={JCMasterListScreen}
      />
      <AppRoute
        path='/jcmasterlist/:pageNumber'
        exact
        layout={back}
        component={JCMasterListScreen}
      />
      <AppRoute
        path='/jcmasters/:id/edit'
        exact
        layout={back}
        component={EditJCMasterScreen}
      />
      <AppRoute
        path='/createjc'
        exact
        layout={back}
        component={CreateJCMasterScreen}
      />
      <AppRoute
        path='/bulkjcupload'
        exact
        layout={back}
        component={BulkJCUploadScreen}
      />
      <AppRoute
        path='/jcmastersreport'
        exact
        layout={back}
        component={JCMasterReportListScreen}
      />

      {/* HSN Master Screens */}
      <AppRoute path='/hsnlist' exact layout={back} component={HSNListScreen} />
      <AppRoute
        path='/hsnlist/:pageNumber'
        exact
        layout={back}
        component={HSNListScreen}
      />
      <AppRoute
        path='/hsnsac/:id/edit'
        exact
        layout={back}
        component={HSNEditScreen}
      />
      <AppRoute
        path='/hsnsac'
        exact
        layout={back}
        component={HSNCreateScreen}
      />

      {/* SAC Master Screens */}
      <AppRoute path='/saclist' exact layout={back} component={SACListScreen} />
      <AppRoute
        path='/saclist/:pageNumber'
        exact
        layout={back}
        component={SACListScreen}
      />
      <AppRoute
        path='/sac/:id/edit'
        exact
        layout={back}
        component={SACEditScreen}
      />
      <AppRoute path='/sac' exact layout={back} component={SACCreateScreen} />

      {/* Machine Master Screens */}
      <AppRoute
        path='/machinelist'
        exact
        layout={back}
        component={MachineMasterCreateScreen}
      />
      <AppRoute
        path='/machinelist/:pageNumber'
        exact
        layout={back}
        component={MachineMasterCreateScreen}
      />
      <AppRoute
        path='/machine/:id/edit'
        exact
        layout={back}
        component={HSNEditScreen}
      />
      <AppRoute
        path='/machine'
        exact
        layout={back}
        component={HSNCreateScreen}
      />

      {/* Product Code Screens */}
      <AppRoute
        path='/productcodelist'
        exact
        layout={back}
        component={ProductCodeListScreen}
      />
      <AppRoute
        path='/productcodelist/:pageNumber'
        exact
        layout={back}
        component={ProductCodeListScreen}
      />
      <AppRoute
        path='/productcode/:id/edit'
        exact
        layout={back}
        component={ProductCodeEditScreen}
      />
      <AppRoute
        path='/productcode'
        exact
        layout={back}
        component={ProductCodeCreateScreen}
      />

      {/* Service Code Screens */}
      <AppRoute
        path='/servicecodelist'
        exact
        layout={back}
        component={ServiceCodeListScreen}
      />
      <AppRoute
        path='/servicecodelist/:pageNumber'
        exact
        layout={back}
        component={ServiceCodeListScreen}
      />
      <AppRoute
        path='/servicecode/:id/edit'
        exact
        layout={back}
        component={ServiceCodeEditScreen}
      />
      <AppRoute
        path='/servicecode'
        exact
        layout={back}
        component={ServiceCodeCreateScreen}
      />

      {/* Product Category Screens */}
      <AppRoute
        path='/productcategorylist'
        exact
        layout={back}
        component={ProductCategoryListScreen}
      />
      <AppRoute
        path='/productcategorylist/:pageNumber'
        exact
        layout={back}
        component={ProductCategoryListScreen}
      />
      <AppRoute
        path='/productcategory/:id/edit'
        exact
        layout={back}
        component={ProductCategoryEditScreen}
      />
      <AppRoute
        path='/productcategory'
        exact
        layout={back}
        component={ProductCategoryCreateScreen}
      />

      {/* UOM Screens */}
      <AppRoute path='/uomlist' exact layout={back} component={UOMListScreen} />
      <AppRoute
        path='/uomlist/:pageNumber'
        exact
        layout={back}
        component={UOMListScreen}
      />
      <AppRoute
        path='/uom/:id/edit'
        exact
        layout={back}
        component={UOMEditScreen}
      />
      <AppRoute path='/uom' exact layout={back} component={UOMCreateScreen} />

      {/* Company Master Screens */}
      <AppRoute
        path='/companylist'
        exact
        layout={back}
        component={CompanyMasterListScreen}
      />
      <AppRoute
        path='/companylist/:pageNumber'
        exact
        layout={back}
        component={CompanyMasterListScreen}
      />
      <AppRoute
        path='/company/:id/edit'
        exact
        layout={back}
        component={CompanyMasterEditScreen}
      />

      {/* Auto Increment Screens */}
      <AppRoute
        path='/autoincrementlist'
        exact
        layout={back}
        component={AutoIncrementListScreen}
      />
      <AppRoute
        path='/autoincrementlist/:pageNumber'
        exact
        layout={back}
        component={AutoIncrementListScreen}
      />
      <AppRoute
        path='/autoincrement/:id/edit'
        exact
        layout={back}
        component={AutoIncrementEditScreen}
      />
      <AppRoute
        path='/autoincrement'
        exact
        layout={back}
        component={AutoIncrementCreateScreen}
      />

      {/* Sales Order Screens */}
      <AppRoute
        path='/salesorderslist'
        exact
        layout={back}
        component={SalesOrderListScreen}
      />
      <AppRoute
        path='/salesorderslist/:pageNumber'
        exact
        layout={back}
        component={SalesOrderListScreen}
      />
      <AppRoute
        path='/bookorder'
        exact
        layout={back}
        component={SalesOrderCreateScreen}
      />
      <AppRoute
        path='/salesorders/:id/edit'
        exact
        layout={back}
        component={SalesOrderEditScreen}
      />
      <AppRoute
        path='/salesorders/:id/confirm'
        exact
        layout={back}
        component={SalesOrderConfirmationScreen}
      />
      <AppRoute
        path='/salesorders/:id/view'
        exact
        layout={back}
        component={SalesOrderViewScreen}
      />
      <AppRoute
        path='/salesorders/:id/cancel'
        exact
        layout={back}
        component={SalesOrderCancelScreen}
      />
      <AppRoute
        path='/openorderslist'
        exact
        layout={back}
        component={OpenSalesOrdersListScreen}
      />
      {/* Sales Order Reports Screens */}
      <AppRoute
        path='/sodetails'
        exact
        layout={back}
        component={SODetailsByLineReportScreen}
      />
      <AppRoute
        path='/cancelsodetails'
        exact
        layout={back}
        component={CancelSODetailsByLineReportScreen}
      />
      <AppRoute
        path='/backorder'
        exact
        layout={back}
        component={BackOrdersBySOReportScreen}
      />
      <AppRoute
        path='/backorderbyjc'
        exact
        layout={back}
        component={BackOrdersByJCReportScreen}
      />

      {/* Job Card Input Screens */}
      <AppRoute
        path='/jobcardinputlist'
        exact
        layout={back}
        component={JobCardInputListScreen}
      />
      <AppRoute
        path='/jobcardinputlist/:pageNumber'
        exact
        layout={back}
        component={JobCardInputListScreen}
      />
      <AppRoute
        path='/jobcardinput'
        exact
        layout={back}
        component={JobCardInputCreateScreen}
      />
      <AppRoute
        path='/jobcardinput/:id/edit'
        exact
        layout={back}
        component={JobCardInputEditScreen}
      />
      <AppRoute
        path='/yield'
        exact
        layout={back}
        component={YieldReportScreen}
      />
      <AppRoute
        path='/ppmlevelreportprint'
        exact
        layout={front}
        component={PPMLevelPrintReportScreen}
      />

      {/* Job Card Output Screens */}
      <AppRoute
        path='/jobcardoutputlist'
        exact
        layout={back}
        component={JobCardOutputListScreen}
      />
      <AppRoute
        path='/jobcardoutputlist/:pageNumber'
        exact
        layout={back}
        component={JobCardOutputListScreen}
      />
      <AppRoute
        path='/jobcardoutput'
        exact
        layout={back}
        component={JobCardOutputCreateScreen}
      />
      <AppRoute
        path='/jobcardoutput/:id/edit'
        exact
        layout={back}
        component={JobCardOutputEditScreen}
      />

      {/* FGMI Screens */}
      <AppRoute
        path='/fgmilist'
        exact
        layout={back}
        component={FGMIListScreen}
      />
      <AppRoute
        path='/fgmilist/:pageNumber'
        exact
        layout={back}
        component={FGMIListScreen}
      />
      <AppRoute path='/fgmi' exact layout={back} component={FGMICreateScreen} />
      <AppRoute
        path='/fgmi/:id/edit'
        exact
        layout={back}
        component={FGMIEditScreen}
      />
      <AppRoute
        path='/fgcorrection'
        exact
        layout={back}
        component={FGMICorrectionScreen}
      />

      {/* DRN Screens */}
      <AppRoute path='/drnlist' exact layout={back} component={DRNListScreen} />
      <AppRoute
        path='/drnlist/:pageNumber'
        exact
        layout={back}
        component={DRNListScreen}
      />
      <AppRoute path='/drn' exact layout={back} component={DRNCreateScreen} />
      <AppRoute
        path='/drn/:id/edit/:action'
        exact
        layout={back}
        component={DRNEditScreen}
      />
      <AppRoute
        path='/rejecteddrns'
        exact
        layout={back}
        component={RejectedDRNListScreen}
      />

      {/* DRN Approval Screens */}
      <AppRoute
        path='/drnapprovallist'
        exact
        layout={back}
        component={DRNApprovalListScreen}
      />
      <AppRoute
        path='/drnapprovallist/:pageNumber'
        exact
        layout={back}
        component={DRNApprovalListScreen}
      />
      <AppRoute
        path='/drnapproval'
        exact
        layout={back}
        component={DRNApprovalCreateScreen}
      />
      <AppRoute
        path='/drnapproval/:id/edit'
        exact
        layout={back}
        component={DRNApprovalEditScreen}
      />

      {/* Invoice Approval Screens */}
      <AppRoute
        path='/invoiceapprovallist'
        exact
        layout={back}
        component={InvoiceApprovalListScreen}
      />
      <AppRoute
        path='/invoiceapprovallist/:pageNumber'
        exact
        layout={back}
        component={InvoiceApprovalListScreen}
      />
      <AppRoute
        path='/invoiceapproval/:id/edit'
        exact
        layout={back}
        component={InvoiceApprovalEditScreen}
      />

      {/* Approved Tax Invocies Screens */}
      <AppRoute
        path='/taxinvoicelist'
        exact
        layout={back}
        component={SalesInvoiceListScreen}
      />
      <AppRoute
        path='/taxinvoicelist/:pageNumber'
        exact
        layout={back}
        component={SalesInvoiceListScreen}
      />
      <AppRoute
        path='/invoicewithtaxlist'
        exact
        layout={back}
        component={SalesInvoiceWithTaxListScreen}
      />
      <AppRoute
        path='/invoicewithtaxlist/:pageNumber'
        exact
        layout={back}
        component={SalesInvoiceWithTaxListScreen}
      />
      <AppRoute
        path='/taxinvoice/:id/edit'
        exact
        layout={front}
        component={SalesInvoiceEditScreen}
      />

      {/* Tax Invocie Reports Screens */}
      <AppRoute
        path='/invoicedetails'
        exact
        layout={back}
        component={SIDetailsByLineReportScreen}
      />
      <AppRoute
        path='/invoicedispatchdetails'
        exact
        layout={back}
        component={SIDetailsByDispatchScreen}
      />

      {/* Settings Screens */}
      <AppRoute
        path='/settings'
        exact
        layout={back}
        component={UtilitySettingsScreen}
      />
      <AppRoute
        path='/configuration'
        exact
        layout={back}
        component={AppConfigurationScreen}
      />

      {/* Delivery Note Screens */}
      <AppRoute
        path='/deliverynotelist'
        exact
        layout={back}
        component={DeliveryNoteListScreen}
      />
      <AppRoute
        path='/deliverynotelist/:pageNumber'
        exact
        layout={back}
        component={DeliveryNoteListScreen}
      />
      <AppRoute
        path='/deliverynote'
        exact
        layout={back}
        component={DeliveryNoteCreateScreen}
      />
      <AppRoute
        path='/deliverynote/:id/edit'
        exact
        layout={back}
        component={DeliveryNoteEditScreen}
      />

      {/* Dispatch Details Screens */}
      <AppRoute
        path='/dispatchdetailslist'
        exact
        layout={back}
        component={DispatchDetailsListScreen}
      />
      <AppRoute
        path='/dispatchdetailslist/:pageNumber'
        exact
        layout={back}
        component={DispatchDetailsListScreen}
      />
      <AppRoute
        path='/dispatchdetails'
        exact
        layout={back}
        component={DispatchDetailsCreateScreen}
      />
      <AppRoute
        path='/dispatchdetails/:id/edit'
        exact
        layout={back}
        component={DispatchDetailsEditScreen}
      />
      <AppRoute
        path='/dispatchdetails/:id/print'
        exact
        layout={front}
        component={ASNScreen}
      />

      {/* Credit Note Screens */}
      <AppRoute
        path='/creditnotelist'
        exact
        layout={back}
        component={CreditNoteListScreen}
      />
      <AppRoute
        path='/creditnotelist/:pageNumber'
        exact
        layout={back}
        component={CreditNoteListScreen}
      />
      <AppRoute
        path='/creditnote'
        exact
        layout={back}
        component={CreditNoteCreateScreen}
      />
      <AppRoute
        path='/creditnote/:id/edit'
        exact
        layout={back}
        component={CreditNoteEditScreen}
      />
      <AppRoute
        path='/creditnote/:id/print'
        exact
        layout={front}
        component={CreditNotePrintScreen}
      />
      <AppRoute
        path='/creditnotereport'
        exact
        layout={back}
        component={CreditNoteWithTaxListScreen}
      />

      {/** User Management Screen */}
      <AppRoute
        path='/userlist'
        exact
        layout={back}
        component={UserListScreen}
      />
      <AppRoute
        path='/userlist/:pageNumber'
        exact
        layout={back}
        component={UserListScreen}
      />
      <AppRoute path='/user' exact layout={back} component={UserCreateScreen} />
      <AppRoute
        path='/user/:id/edit'
        exact
        layout={back}
        component={UserEditScreen}
      />

      {/** Role Management Screen */}
      <AppRoute
        path='/rolelist'
        exact
        layout={back}
        component={RoleListScreen}
      />
      <AppRoute
        path='/rolelist/:pageNumber'
        exact
        layout={back}
        component={RoleListScreen}
      />
      <AppRoute path='/role' exact layout={back} component={RoleCreateScreen} />
      <AppRoute
        path='/role/:id/edit'
        exact
        layout={back}
        component={RoleEditScreen}
      />

      {/** Menu Management Screen */}
      <AppRoute
        path='/menulist'
        exact
        layout={back}
        component={MenuListScreen}
      />
      <AppRoute
        path='/menulist/:pageNumber'
        exact
        layout={back}
        component={MenuListScreen}
      />
      <AppRoute path='/menu' exact layout={back} component={MenuCreateScreen} />
      <AppRoute
        path='/menu/:id/edit'
        exact
        layout={back}
        component={MenuEditScreen}
      />
      <AppRoute
        path='/menu/:id/select'
        exact
        layout={back}
        component={SubMenuItemDisplayScreen}
      />
      <AppRoute
        path='/appmenu/:id/select'
        exact
        layout={back}
        component={AppMgmtSubMenuItemDisplayScreen}
      />

      {/* Issue Screens */}
      <AppRoute
        path='/issuelist'
        exact
        layout={back}
        component={IssueListScreen}
      />
      <AppRoute
        path='/issuelist/:pageNumber'
        exact
        layout={back}
        component={IssueListScreen}
      />
      <AppRoute
        path='/issue'
        exact
        layout={back}
        component={IssueCreateScreen}
      />
      <AppRoute
        path='/issue/:id/edit'
        exact
        layout={back}
        component={IssueEditScreen}
      />

      {/* PDIR Config Screens */}
      <AppRoute
        path='/pdirconfig'
        exact
        layout={back}
        component={PDIRConfigScreen}
      />
      <AppRoute
        path='/inspectionparameter'
        exact
        layout={back}
        component={InspectionParameterCreateScreen}
      />
      <AppRoute
        path='/inspectionparameter/:id/edit'
        exact
        layout={back}
        component={InspectionParameterEditScreen}
      />
      <AppRoute
        path='/inspectionmethod'
        exact
        layout={back}
        component={InspectionMethodCreateScreen}
      />
      <AppRoute
        path='/inspectionmethod/:id/edit'
        exact
        layout={back}
        component={InspectionMethodEditScreen}
      />
      <AppRoute
        path='/pdirtemplate'
        exact
        layout={back}
        component={PDIRTemplateCreateScreen}
      />
      <AppRoute
        path='/pdirtemplate/:id/edit'
        exact
        layout={back}
        component={PDIRTemplateEditScreen}
      />
      <AppRoute
        path='/ppmreportcorrection'
        exact
        layout={back}
        component={PPMReportCorrectionScreen}
      />

      <AppRoute
        path='/pdirlist'
        exact
        layout={back}
        component={PDIRListScreen}
      />
      <AppRoute
        path='/pdirlist/:pageNumber'
        exact
        layout={back}
        component={PDIRListScreen}
      />
      <AppRoute path='/pdir' exact layout={back} component={PDIRCreateScreen} />
      <AppRoute
        path='/pdir/:id/edit'
        exact
        layout={back}
        component={PDIREditScreen}
      />
      <AppRoute
        path='/pdir/:id/print'
        exact
        layout={front}
        component={PDIRPrintScreen}
      />
      <AppRoute
        path='/pdirreport'
        exact
        layout={back}
        component={PDIRReportScreen}
      />

      {/* Service Master Screens */}
      <AppRoute
        path='/servicemasterlist'
        exact
        layout={back}
        component={ServiceMasterListScreen}
      />
      <AppRoute
        path='/servicemasterlist/:pageNumber'
        exact
        layout={back}
        component={ServiceMasterListScreen}
      />
      <AppRoute
        path='/servicemaster'
        exact
        layout={back}
        component={CreateServiceMasterScreen}
      />
      <AppRoute
        path='/servicemaster/:id/edit'
        exact
        layout={back}
        component={EditServiceMasterScreen}
      />

      {/* Application Parameters Screens */}
      <AppRoute
        path='/parameterslist'
        exact
        layout={back}
        component={AppParametersListScreen}
      />
      <AppRoute
        path='/parameterslist/:pageNumber'
        exact
        layout={back}
        component={AppParametersListScreen}
      />
      <AppRoute
        path='/parameters'
        exact
        layout={back}
        component={AppParametersCreateScreen}
      />
      <AppRoute
        path='/parameters/:id/edit'
        exact
        layout={back}
        component={AppParametersEditScreen}
      />

      <NotificationContainer />
    </Router>
  )
}

export default App
