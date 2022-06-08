import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Clock from 'react-digital-clock'
import { NavDropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../actions/masters/userActions'
import { LinkContainer } from 'react-router-bootstrap'

/** Login Screen */
import LoginScreen from '../../screens/unlogged/LoginScreen'

/** Dashboard Screen */
import DashboardScreen from '../../screens/dashboard/DashboardScreen'
import ChartDashboardScreen from './../../screens/dashboard/ChartDashboardScreen'
import ProductionDashboardScreen from './../../screens/dashboard/ProductionDashboardScreen'
import QADashboardScreen from './../../screens/dashboard/QADashboardScreen'
import SalesDashboardScreen from './../../screens/dashboard/SalesDashboardScreen'
import PPMDashboardScreen from './../../screens/dashboard/PPMDashboardScreen'

/** Customer Master Screens */
import CustomerMasterListScreen from '../../screens/customermaster/CustomerMasterListScreen'
import CreateCustomerScreen from '../../screens/customermaster/CreateCustomerScreen'
import EditCustomerScreen from '../../screens/customermaster/EditCustomerScreen'

/** Supplier Master Screens */
import SupplierMasterList from '../../screens/suppliermaster/SupplierMasterList.js'
import CreateSupplierScreen from '../../screens/suppliermaster/CreateSupplierScreen.js'
import EditSupplierScreen from '../../screens/suppliermaster/EditSupplierScreen.js'

/** Auto Increment Screens */
import AutoIncrementListScreen from './../../screens/autoincrement/AutoIncrementListScreen'
import AutoIncrementEditScreen from './../../screens/autoincrement/AutoIncrementEditScreen'
import AutoIncrementCreateScreen from './../../screens/autoincrement/AutoIncrementCreateScreen'

/** JC Master Screens */
import JCMasterListScreen from '../../screens/jcmaster/JCMasterListScreen'
import CreateJCMasterScreen from '../../screens/jcmaster/CreateJCMasterScreen'
import BulkJCUploadScreen from '../../screens/jcmaster/BulkJCUploadScreen'
import EditJCMasterScreen from '../../screens/jcmaster/EditJCMasterScreen'
import JCMasterReportListScreen from '../../screens/jcmaster/JCMasterReportListScreen'

/** HSN Master Screens */
import HSNListScreen from '../../screens/hsnsac/HSNListScreen'
import HSNEditScreen from '../../screens/hsnsac/HSNEditScreen'
import HSNCreateScreen from '../../screens/hsnsac/HSNCreateScreen'

/** SAC Master Screens */
import SACListScreen from '../../screens/hsnsac/SACListScreen'
import SACEditScreen from '../../screens/hsnsac/SACEditScreen'
import SACCreateScreen from '../../screens/hsnsac/SACCreateScreen'

/** Machine Master Screens */
import MachineMasterCreateScreen from './../../screens/machinemaster/MachineMasterCreateScreen'
import MachineMasterEditScreen from './../../screens/machinemaster/MachineMasterEditScreen'
import MachineMasterListScreen from './../../screens/machinemaster/MachineMasterListScreen'

/** Product Code Screens */
import ProductCodeListScreen from './../../screens/productcode/ProductCodeListScreen'
import ProductCodeEditScreen from './../../screens/productcode/ProductCodeEditScreen'
import ProductCodeCreateScreen from './../../screens/productcode/ProductCodeCreateScreen'

/** Product Category Screens */
import ProductCategoryListScreen from './../../screens/productcategory/ProductCategoryListScreen'
import ProductCategoryEditScreen from './../../screens/productcategory/ProductCategoryEditScreen'
import ProductCategoryCreateScreen from './../../screens/productcategory/ProductCategoryCreateScreen'

/** UOM Screens */
import UOMListScreen from './../../screens/uom/UOMListScreen'
import UOMEditScreen from './../../screens/uom/UOMEditScreen'
import UOMCreateScreen from './../../screens/uom/UOMCreateScreen'

/** Sales Order Screens */
import SalesOrderListScreen from '../../screens/sales/SalesOrderListScreen'
import SalesOrderCreateScreen from '../../screens/sales/SalesOrderCreateScreen'
import SalesOrderEditScreen from '../../screens/sales/SalesOrderEditScreen'
import SalesOrderConfirmationScreen from '../../screens/sales/SalesOrderConfirmationScreen'
import SalesOrderViewScreen from '../../screens/sales/SalesOrderViewScreen'
import SalesOrderCancelScreen from '../../screens/sales/SalesOrderCancelScreen'
import OpenSalesOrdersListScreen from './../../screens/sales/OpenSalesOrdersListScreen'

/** Sales Order Reports Screens */
import BackOrdersBySOReportScreen from './../../screens/sales/reports/BackOrdersBySOReportScreen'
import SODetailsByLineReportScreen from './../../screens/sales/reports/SODetailsByLineReportScreen'
import CancelSODetailsByLineReportScreen from './../../screens/sales/reports/CancelSODetailsByLineReportScreen'
import BackOrdersByJCReportScreen from './../../screens/sales/reports/BackOrdersByJCReportScreen'

/** Job Card Input Screens */
import JobCardInputListScreen from './../../screens/production/JobCardInputListScreen'
import JobCardInputCreateScreen from './../../screens/production/JobCardInputCreateScreen'
import JobCardInputEditScreen from './../../screens/production/JobCardInputEditScreen'

/** Job Card Output Screens */
import JobCardOutputListScreen from './../../screens/production/JobCardOutputListScreen'
import JobCardOutputCreateScreen from './../../screens/production/JobCardOutputCreateScreen'
import JobCardOutputEditScreen from './../../screens/production/JobCardOutputEditScreen'

/** FGMI Screens */
import FGMIListScreen from './../../screens/production/FGMIListScreen'
import FGMICreateScreen from './../../screens/production/FGMICreateScreen'
import FGMIEditScreen from './../../screens/production/FGMIEditScreen'
import FGMICorrectionScreen from './../../screens/production/FGMICorrectionScreen'

/** Delivery Request Note (DRN) Screens */
import DRNListScreen from '../../screens/production/DRNListScreen'
import DRNCreateScreen from '../../screens/production/DRNCreateScreen'
import DRNEditScreen from '../../screens/production/DRNEditScreen'
import RejectedDRNListScreen from '../../screens/sales/reports/RejectedDRNListScreen'

/** Tax Invoice Approval Screens */
import InvoiceApprovalEditScreen from '../../screens/sales/InvoiceApprovalEditScreen'
import InvoiceApprovalListScreen from '../../screens/sales/InvoiceApprovalListScreen'

/** Approved Tax Invoices Screens */
import SalesInvoiceListScreen from './../../screens/sales/SalesInvoiceListScreen'
import SalesInvoiceWithTaxListScreen from './../../screens/sales/SalesInvoiceWithTaxListScreen'
import SalesInvoiceEditScreen from './../../screens/sales/SalesInvoiceEditScreen'

/** Tax Invoice Reports Screens */
import SIDetailsByLineReportScreen from './../../screens/sales/reports/SIDetailsByLineReportScreen'
import SIDetailsByDispatchScreen from './../../screens/sales/reports/SIDetailsByDispatchScreen'

/** Utility Screens */
import UtilitySettingsScreen from '../../screens/utility/UtilitySettingsScreen'

/** Dispatch Details Screens */
import DispatchDetailsListScreen from './../../screens/production/DispatchDetailsListScreen'
import DispatchDetailsCreateScreen from './../../screens/production/DispatchDetailsCreateScreen'
import DispatchDetailsEditScreen from './../../screens/production/DispatchDetailsEditScreen'
import ASNScreen from './../../screens/production/ASNScreen'

/** Delivery Note Screens */
import DeliveryNoteListScreen from './../../screens/production/DeliveryNoteListScreen'
import DeliveryNoteCreateScreen from './../../screens/production/DeliveryNoteCreateScreen'
import DeliveryNoteEditScreen from './../../screens/production/DeliveryNoteEditScreen'
import DRNApprovalListScreen from './../../screens/qa/DRNApprovalListScreen'
import DRNApprovalCreateScreen from './../../screens/qa/DRNApprovalCreateScreen'
import DRNApprovalEditScreen from './../../screens/qa/DRNApprovalEditScreen'

/** Debit Note Screens */
import CreditNoteListScreen from '../../screens/sales/CreditNoteListScreen'
import CreditNoteEditScreen from '../../screens/sales/CreditNoteEditScreen'
import CreditNotePrintScreen from '../../screens/sales/CreditNotePrintScreen'
import CreditNoteCreateScreen from '../../screens/sales/CreditNoteCreateScreen'

/** User Management Screens */
import UserListScreen from './../../screens/user/UserListScreen'
import UserEditScreen from './../../screens/user/UserEditScreen'
import UserCreateScreen from './../../screens/user/UserCreateScreen'

/** Role Management Screens */
import RoleListScreen from './../../screens/user/RoleListScreen'
import RoleEditScreen from './../../screens/user/RoleEditScreen'
import RoleCreateScreen from './../../screens/user/RoleCreateScreen'

/** Menu Management Screens */
import MenuListScreen from './../../screens/user/MenuListScreen'
import MenuEditScreen from './../../screens/user/MenuEditScreen'
import MenuCreateScreen from './../../screens/user/MenuCreateScreen'
import SubMenuItemDisplayScreen from './../../screens/user/SubMenuItemDisplayScreen'
import AppMgmtSubMenuItemDisplayScreen from './../../screens/user/AppMgmtSubMenuItemDisplayScreen'

/** Issue Management Screens */
import IssueCreateScreen from './../../screens/issuemaster/IssueCreateScreen'
import IssueListScreen from './../../screens/issuemaster/IssueListScreen'
import IssueEditScreen from './../../screens/issuemaster/IssueEditScreen'
import ConfigurationScreen from './../../screens/utility/ConfigurationScreen'
import AppConfigurationScreen from './../../screens/utility/AppConfigurationScreen'

/** Company Master Screens */
import CompanyMasterListScreen from './../../screens/companymaster/CompanyMasterListScreen'
import CompanyMasterEditScreen from './../../screens/companymaster/CompanyMasterEditScreen'

/** PDIR Config Screens */
import PDIRConfigScreen from './../../screens/qa/PDIRConfigScreen'
import InspectionParameterCreateScreen from './../../screens/qa/InspectionParameterCreateScreen'
import InspectionParameterEditScreen from './../../screens/qa/InspectionParameterEditScreen'
import InspectionMethodCreateScreen from './../../screens/qa/InspectionMethodCreateScreen'
import InspectionMethodEditScreen from './../../screens/qa/InspectionMethodEditScreen'
import PDIRTemplateCreateScreen from './../../screens/qa/PDIRTemplateCreateScreen'
import PDIRTemplateEditScreen from './../../screens/qa/PDIRTemplateEditScreen'
import PDIRListScreen from './../../screens/qa/PDIRListScreen'
import PDIRCreateScreen from './../../screens/qa/PDIRCreateScreen'
import PDIREditScreen from './../../screens/qa/PDIREditScreen'
import PDIRPrintScreen from './../../screens/qa/PDIRPrintScreen'
import PDIRReportScreen from './../../screens/qa/PDIRReportScreen'
/** Yield Report Screen */
import YieldReportScreen from './../../screens/qa/reports/YieldReportScreen'
import PPMLevelPrintReportScreen from './../../screens/qa/PPMLevelPrintReportScreen'
//Service Master
import ServiceMasterListScreen from './../../screens/servicemaster/ServiceMasterListScreen'
import CreateServiceMasterScreen from './../../screens/servicemaster/CreateServiceMasterScreen'
import EditServiceMasterScreen from './../../screens/servicemaster/EditServiceMasterScreen'
/** Credit Note with Tax Report */
import CreditNoteWithTaxListScreen from './../../screens/sales/reports/CreditNoteWithTaxListScreen'

/** Application Parameters Screens */
import AppParametersListScreen from './../../screens/appmanagement/AppParametersListScreen'
import AppParametersEditScreen from './../../screens/appmanagement/AppParametersEditScreen'
import AppParametersCreateScreen from './../../screens/appmanagement/AppParametersCreateScreen'
/** PPM Report Correction Screen */
import PPMReportCorrectionScreen from './../../screens/qa/PPMReportCorrectionScreen'

/** Service Code Screens */
import ServiceCodeListScreen from './../../screens/servicecode/ServiceCodeListScreen'
import ServiceCodeEditScreen from './../../screens/servicecode/ServiceCodeEditScreen'
import ServiceCodeCreateScreen from './../../screens/servicecode/ServiceCodeCreateScreen'

const Main = () => {
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
  }

  let todayDate = new Date().toDateString()

  return (
    <>
      <header>
        <div className='search-wrapper notOnMobile'>
          <h4 style={{ color: '#ce0000' }}>
            {userInfo === null
              ? 'Welcome !'
              : userInfo !== undefined
              ? userInfo.companyName
              : 'Welcome !!'}
          </h4>
        </div>
        <div className='notOnMobile'>
          <h5 style={{ color: 'rgb(87, 84, 84)' }} className='my-2'>
            Date: {todayDate}{' '}
            <div className='clock'>
              <Clock />
            </div>
          </h5>
        </div>

        {userInfo === null || userInfo === undefined ? null : (
          // <div className="social-icons">

          <NavDropdown
            style={{
              fontWeight: 'bolder',
              background: 'lightgray',
              color: 'white',
            }}
            title={userInfo.name}
            id='username'
          >
            <LinkContainer to='/profile'>
              <NavDropdown.Item>Profile</NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
          </NavDropdown>
          // </div>
        )}
      </header>

      <main>
        <Switch>
          {/* Login Screens */}
          <Route path='/' component={LoginScreen} exact />
          <Route path='/login' component={LoginScreen} exact />

          {/* Dashboard Screens */}
          <Route path='/home' component={DashboardScreen} exact />
          <Route
            path='/chartdashboard'
            component={ChartDashboardScreen}
            exact
          />
          <Route
            path='/proddashboard'
            component={ProductionDashboardScreen}
            exact
          />
          <Route path='/qadashboard' component={QADashboardScreen} exact />
          <Route
            path='/salesdashboard'
            component={SalesDashboardScreen}
            exact
          />
          <Route path='/ppm' component={PPMDashboardScreen} exact />

          {/* Customer Master Screens */}
          <Route
            path='/customerlist'
            component={CustomerMasterListScreen}
            exact
          />
          <Route
            path='/customerlist/:pageNumber'
            component={CustomerMasterListScreen}
            exact
          />
          <Route
            path='/createcustomer'
            component={CreateCustomerScreen}
            exact
          />
          <Route path='/customers/:id/edit' component={EditCustomerScreen} />

          {/* Supplier Master Screens */}
          <Route path='/supplierlist' component={SupplierMasterList} exact />
          <Route
            path='/supplierlist/:pageNumber'
            component={SupplierMasterList}
            exact
          />
          <Route
            path='/createsupplier'
            component={CreateSupplierScreen}
            exact
          />
          <Route path='/suppliers/:id/edit' component={EditSupplierScreen} />

          {/* Auto Increment Screens */}
          <Route
            path='/autoincrementlist'
            component={AutoIncrementListScreen}
            exact
          />
          <Route
            path='/autoincrementlist/:pageNumber'
            component={AutoIncrementListScreen}
            exact
          />
          <Route
            path='/autoincrement'
            component={AutoIncrementCreateScreen}
            exact
          />
          <Route
            path='/autoincrement/:id/edit'
            component={AutoIncrementEditScreen}
          />

          {/* JC Master Screens */}
          <Route path='/jcmasterlist' component={JCMasterListScreen} exact />
          <Route
            path='/jcmasterlist/:pageNumber'
            component={JCMasterListScreen}
            exact
          />
          <Route path='/createjc' component={CreateJCMasterScreen} exact />
          <Route path='/bulkjcupload' component={BulkJCUploadScreen} exact />
          <Route path='/jcmasters/:id/edit' component={EditJCMasterScreen} />
          <Route path='/jcmastersreport' component={JCMasterReportListScreen} />

          {/* HSN Master Screens */}
          <Route path='/hsnlist' exact component={HSNListScreen} />
          <Route path='/hsnlist/:pageNumber' exact component={HSNListScreen} />
          <Route path='/hsnsac/:id/edit' exact component={HSNEditScreen} />
          <Route path='/hsnsac' exact component={HSNCreateScreen} />

          {/* SAC Master Screens */}
          <Route path='/saclist' exact component={SACListScreen} />
          <Route path='/saclist/:pageNumber' exact component={SACListScreen} />
          <Route path='/sac/:id/edit' exact component={SACEditScreen} />
          <Route path='/sac' exact component={SACCreateScreen} />

          {/* Machine Master Screens */}
          <Route
            path='/machinelist'
            exact
            component={MachineMasterListScreen}
          />
          <Route
            path='/machinelist/:pageNumber'
            exact
            component={MachineMasterListScreen}
          />
          <Route
            path='/machine/:id/edit'
            exact
            component={MachineMasterEditScreen}
          />
          <Route path='/machine' exact component={MachineMasterCreateScreen} />

          {/* Product Code Screens */}
          <Route
            path='/productcodelist'
            exact
            component={ProductCodeListScreen}
          />
          <Route
            path='/productcodelist/:pageNumber'
            exact
            component={ProductCodeListScreen}
          />
          <Route
            path='/productcode/:id/edit'
            exact
            component={ProductCodeEditScreen}
          />
          <Route
            path='/productcode'
            exact
            component={ProductCodeCreateScreen}
          />

          {/* Service Code Screens */}
          <Route
            path='/servicecodelist'
            exact
            component={ServiceCodeListScreen}
          />
          <Route
            path='/servicecodelist/:pageNumber'
            exact
            component={ServiceCodeListScreen}
          />
          <Route
            path='/servicecode/:id/edit'
            exact
            component={ServiceCodeEditScreen}
          />
          <Route
            path='/servicecode'
            exact
            component={ServiceCodeCreateScreen}
          />

          {/* Product Category Screens */}
          <Route
            path='/productcategorylist'
            exact
            component={ProductCategoryListScreen}
          />
          <Route
            path='/productcategorylist/:pageNumber'
            exact
            component={ProductCategoryListScreen}
          />
          <Route
            path='/productcategory/:id/edit'
            exact
            component={ProductCategoryEditScreen}
          />
          <Route
            path='/productcategory'
            exact
            component={ProductCategoryCreateScreen}
          />

          {/* UOM Screens */}
          <Route path='/uomlist' exact component={UOMListScreen} />
          <Route path='/uomlist/:pageNumber' exact component={UOMListScreen} />
          <Route path='/uom/:id/edit' exact component={UOMEditScreen} />
          <Route path='/uom' exact component={UOMCreateScreen} />

          {/* Company Master Screens */}
          <Route
            path='/companylist'
            exact
            component={CompanyMasterListScreen}
          />
          <Route
            path='/companylist/:pageNumber'
            exact
            component={CompanyMasterListScreen}
          />
          <Route
            path='/company/:id/edit'
            exact
            component={CompanyMasterEditScreen}
          />

          {/* Sales Order Screens */}
          <Route
            path='/salesorderslist'
            component={SalesOrderListScreen}
            exact
          />
          <Route
            path='/salesorderslist/:pageNumber'
            component={SalesOrderListScreen}
            exact
          />
          <Route path='/bookorder' component={SalesOrderCreateScreen} exact />
          {
            <Route
              path='/salesorders/:id/edit'
              component={SalesOrderEditScreen}
              exact
            />
          }
          <Route
            path='/salesorders/:id/confirm'
            component={SalesOrderConfirmationScreen}
            exact
          />
          <Route
            path='/salesorders/:id/view'
            component={SalesOrderViewScreen}
            exact
          />
          <Route
            path='/salesorders/:id/cancel'
            component={SalesOrderCancelScreen}
            exact
          />
          <Route
            path='/openorderslist'
            component={OpenSalesOrdersListScreen}
            exact
          />
          {/* Sales Order Reports Screens */}
          <Route
            path='/sodetails'
            component={SODetailsByLineReportScreen}
            exact
          />
          <Route
            path='/cancelsodetails'
            component={CancelSODetailsByLineReportScreen}
            exact
          />
          <Route
            path='/backorder'
            component={BackOrdersBySOReportScreen}
            exact
          />
          <Route
            path='/backorderbyjc'
            component={BackOrdersByJCReportScreen}
            exact
          />

          {/* Job Card Input Screens */}
          <Route
            path='/jobcardinputlist'
            exact
            component={JobCardInputListScreen}
          />
          <Route
            path='/jobcardinputlist/:pageNumber'
            exact
            component={JobCardInputListScreen}
          />
          <Route
            path='/jobcardinput'
            exact
            component={JobCardInputCreateScreen}
          />
          <Route
            path='/jobcardinput/:id/edit'
            exact
            component={JobCardInputEditScreen}
          />

          {/* Yield Report Screen */}
          <Route path='/yield' exact component={YieldReportScreen} />
          <Route
            path='/ppmlevelreportprint'
            exact
            component={PPMLevelPrintReportScreen}
          />

          {/* Job Card Output Screens */}
          <Route
            path='/jobcardoutputlist'
            exact
            component={JobCardOutputListScreen}
          />
          <Route
            path='/jobcardoutputlist/:pageNumber'
            exact
            component={JobCardOutputListScreen}
          />
          <Route
            path='/jobcardoutput'
            exact
            component={JobCardOutputCreateScreen}
          />
          <Route
            path='/jobcardoutput/:id/edit'
            exact
            component={JobCardOutputEditScreen}
          />

          {/* FGMI Screens */}
          <Route path='/fgmilist' exact component={FGMIListScreen} />
          <Route
            path='/fgmilist/:pageNumber'
            exact
            component={FGMIListScreen}
          />
          <Route path='/fgmi' exact component={FGMICreateScreen} />
          <Route path='/fgmi/:id/edit' exact component={FGMIEditScreen} />
          <Route path='/fgcorrection' exact component={FGMICorrectionScreen} />

          {/* DRN Screens */}
          <Route path='/drnlist' exact component={DRNListScreen} />
          <Route path='/drnlist/:pageNumber' exact component={DRNListScreen} />
          <Route path='/drn' exact component={DRNCreateScreen} />
          <Route path='/drn/:id/edit/:action' exact component={DRNEditScreen} />
          <Route path='/rejecteddrns' exact component={RejectedDRNListScreen} />

          {/* DRN Approval Screens */}
          <Route
            path='/drnapprovallist'
            exact
            component={DRNApprovalListScreen}
          />
          <Route
            path='/drnapprovallist/:pageNumber'
            exact
            component={DRNApprovalListScreen}
          />
          <Route
            path='/drnapproval'
            exact
            component={DRNApprovalCreateScreen}
          />
          <Route
            path='/drnapproval/:id/edit'
            exact
            component={DRNApprovalEditScreen}
          />

          {/* Delivery Note Screens */}
          <Route
            path='/deliverynotelist'
            exact
            component={DeliveryNoteListScreen}
          />
          <Route
            path='/deliverynotelist/:pageNumber'
            exact
            component={DeliveryNoteListScreen}
          />
          <Route
            path='/deliverynote'
            exact
            component={DeliveryNoteCreateScreen}
          />
          <Route
            path='/deliverynote/:id/edit'
            exact
            component={DeliveryNoteEditScreen}
          />

          {/* Dispatch Details Screens */}
          <Route
            path='/dispatchdetailslist'
            exact
            component={DispatchDetailsListScreen}
          />
          <Route
            path='/dispatchdetailslist/:pageNumber'
            exact
            component={DispatchDetailsListScreen}
          />
          <Route
            path='/dispatchdetails'
            exact
            component={DispatchDetailsCreateScreen}
          />
          <Route
            path='/dispatchdetails/:id/edit'
            exact
            component={DispatchDetailsEditScreen}
          />
          <Route
            path='/dispatchdetails/:id/print'
            exact
            component={ASNScreen}
          />

          {/* Invoice Approval Screens */}
          <Route
            path='/invoiceapprovallist'
            exact
            component={InvoiceApprovalListScreen}
          />
          <Route
            path='/invoiceapprovallist/:pageNumber'
            exact
            component={InvoiceApprovalListScreen}
          />
          <Route
            path='/invoiceapproval/:id/edit'
            exact
            component={InvoiceApprovalEditScreen}
          />

          {/* Approved Tax Invoices Screens */}
          <Route
            path='/taxinvoicelist'
            exact
            component={SalesInvoiceListScreen}
          />
          <Route
            path='/taxinvoicelist/:pageNumber'
            exact
            component={SalesInvoiceListScreen}
          />
          <Route
            path='/invoicewithtaxlist'
            exact
            component={SalesInvoiceWithTaxListScreen}
          />
          <Route
            path='/invoicewithtaxlist/:pageNumber'
            exact
            component={SalesInvoiceWithTaxListScreen}
          />
          <Route
            path='/taxinvoice/:id/edit'
            exact
            component={SalesInvoiceEditScreen}
          />

          {/* Debit Note Screens */}
          <Route
            path='/creditnotelist'
            exact
            component={CreditNoteListScreen}
          />
          <Route
            path='/creditnotelist/:pageNumber'
            exact
            component={CreditNoteListScreen}
          />
          <Route
            path='/creditnote/:id/edit'
            exact
            component={CreditNoteEditScreen}
          />
          <Route
            path='/creditnote/:id/print'
            exact
            component={CreditNotePrintScreen}
          />
          <Route path='/creditnote' exact component={CreditNoteCreateScreen} />
          <Route
            path='/creditnotereport'
            exact
            component={CreditNoteWithTaxListScreen}
          />

          {/* Tax Invoice Reports */}
          <Route
            path='/invoicedetails'
            exact
            component={SIDetailsByLineReportScreen}
          />
          <Route
            path='/invoicedispatchdetails'
            exact
            component={SIDetailsByDispatchScreen}
          />

          {/* User Management Screens */}
          <Route path='/userlist' exact component={UserListScreen} />
          <Route
            path='/userlist/:pageNumber'
            exact
            component={UserListScreen}
          />
          <Route path='/user/:id/edit' exact component={UserEditScreen} />
          <Route path='/user' exact component={UserCreateScreen} />

          {/* Role Management Screens */}
          <Route path='/rolelist' exact component={RoleListScreen} />
          <Route
            path='/rolelist/:pageNumber'
            exact
            component={RoleListScreen}
          />
          <Route path='/role/:id/edit' exact component={RoleEditScreen} />
          <Route path='/role' exact component={RoleCreateScreen} />

          {/* Menu Management Screens */}
          <Route path='/menulist' exact component={MenuListScreen} />
          <Route
            path='/menulist/:pageNumber'
            exact
            component={MenuListScreen}
          />
          <Route path='/menu/:id/edit' exact component={MenuEditScreen} />
          <Route
            path='/menu/:id/select'
            exact
            component={SubMenuItemDisplayScreen}
          />
          <Route
            path='/appmenu/:id/select'
            exact
            component={AppMgmtSubMenuItemDisplayScreen}
          />
          <Route path='/menu' exact component={MenuCreateScreen} />

          {/* Settings Screens */}
          <Route path='/settings' component={UtilitySettingsScreen} exact />
          <Route
            path='/configuration'
            component={AppConfigurationScreen}
            exact
          />

          {/* PDIR Screens */}
          <Route path='/pdirconfig' component={PDIRConfigScreen} exact />
          <Route
            path='/inspectionparameter'
            exact
            component={InspectionParameterCreateScreen}
          />
          <Route
            path='/inspectionparameter/:id/edit'
            exact
            component={InspectionParameterEditScreen}
          />
          <Route
            path='/inspectionmethod'
            exact
            component={InspectionMethodCreateScreen}
          />
          <Route
            path='/inspectionmethod/:id/edit'
            exact
            component={InspectionMethodEditScreen}
          />
          <Route
            path='/pdirtemplate'
            exact
            component={PDIRTemplateCreateScreen}
          />
          <Route
            path='/pdirtemplate/:id/edit'
            exact
            component={PDIRTemplateEditScreen}
          />
          <Route path='/pdirlist' exact component={PDIRListScreen} />
          <Route
            path='/pdirlist/:pageNumber'
            exact
            component={PDIRListScreen}
          />
          <Route path='/pdir' exact component={PDIRCreateScreen} />
          <Route path='/pdir/:id/edit' exact component={PDIREditScreen} />
          <Route path='/pdir/:id/print' exact component={PDIRPrintScreen} />
          <Route path='/pdirreport' exact component={PDIRReportScreen} />
          <Route
            path='/ppmreportcorrection'
            exact
            component={PPMReportCorrectionScreen}
          />

          {/* Issue Screens */}
          <Route path='/issuelist' exact component={IssueListScreen} />
          <Route
            path='/issuelist/:pageNumber'
            exact
            component={IssueListScreen}
          />
          <Route path='/issue' exact component={IssueCreateScreen} />
          <Route path='/issue/:id/edit' exact component={IssueEditScreen} />

          {/* Service Master Screens */}
          <Route
            path='/servicemasterlist'
            exact
            component={ServiceMasterListScreen}
          />
          <Route
            path='/servicemasterlist/:pageNumber'
            exact
            component={ServiceMasterListScreen}
          />
          <Route
            path='/servicemaster'
            exact
            component={CreateServiceMasterScreen}
          />
          <Route
            path='/servicemaster/:id/edit'
            exact
            component={EditServiceMasterScreen}
          />

          {/* Service Master Screens */}
          <Route
            path='/parameterslist'
            exact
            component={AppParametersListScreen}
          />
          <Route
            path='/parameterslist/:pageNumber'
            exact
            component={AppParametersListScreen}
          />
          <Route
            path='/parameters'
            exact
            component={AppParametersCreateScreen}
          />
          <Route
            path='/parameters/:id/edit'
            exact
            component={AppParametersEditScreen}
          />
        </Switch>
      </main>
      <footer>
        <p className='text-center my-2'>
          Decal Tech Private Limited | All Rights Reserved 2021
        </p>
      </footer>
    </>
  )
}

export default Main
