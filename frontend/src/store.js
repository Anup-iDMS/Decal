import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  userLoginReducer,
  // userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userCreateReducer,
  allUserListReducer,
  masterDataForUserReducer,
  roleCreateReducer,
  roleDetailsReducer,
  roleUpdateReducer,
  roleDeleteReducer,
  allRoleListReducer,
  // userListReducer,
  // userDeleteReducer,
  // userUpdateReducer,
  //MENU MANAGEMENT
  menuItemCreateReducer,
  menuItemDetailsReducer,
  menuItemUpdateReducer,
  menuItemDeleteReducer,
  allMenuItemListReducer,
  masterDataForMenuReducer,
  allSubMenuItemListReducer,
} from './reducers/masters/userReducers'

import {
  customersListReducer,
  customerDetailsReducer,
  customerCreateReducer,
  masterdataForCustomerMasterReducer,
  customerUpdateReducer,
} from './reducers/masters/customerReducers'

import {
  jcMasterCreateReducer,
  jcMasterDetailsReducer,
  jcMasterUpdateReducer,
  jcMasterDeleteReducer,
  allJCMastersListReducer,
  masterDataForJCReducer,
  allCustomerJCListReducer,
  allCustomerJCPOListReducer,
  jcMastersListReducer,
  jcMastersReportReducer,
} from './reducers/masters/jcMasterReducers'
//hsn  master reducers
import {
  hsnCreateReducer,
  hsnDetailsReducer,
  hsnUpdateReducer,
  hsnDeleteReducer,
  allHSNListReducer,
} from './reducers/masters/hsnReducers'
//sac  master reducers
import {
  sacCreateReducer,
  sacDetailsReducer,
  sacUpdateReducer,
  sacDeleteReducer,
  allSACListReducer,
} from './reducers/masters/sacReducers'

//machine master
import {
  machineMasterCreateReducer,
  machineMasterDetailsReducer,
  machineMasterUpdateReducer,
  machineMasterDeleteReducer,
  allMachineMasterListReducer,
} from './reducers/masters/machineReducers'

//uom
import {
  uomCreateReducer,
  uomDetailsReducer,
  uomUpdateReducer,
  uomDeleteReducer,
  allUOMListReducer,
} from './reducers/masters/uomReducers'

//product category
import {
  prodCategoryCreateReducer,
  prodCategoryDetailsReducer,
  prodCategoryUpdateReducer,
  prodCategoryDeleteReducer,
  allProdCategoryListReducer,
} from './reducers/masters/prodCatReducers'

//product code
import {
  productCodeCreateReducer,
  productCodeDetailsReducer,
  productCodeUpdateReducer,
  productCodeDeleteReducer,
  allProductCodeListReducer,
  masterDataForProductCodeReducer,
} from './reducers/masters/prodCodeReducers'

//service code
import {
  serviceCodeCreateReducer,
  serviceCodeDetailsReducer,
  serviceCodeUpdateReducer,
  serviceCodeDeleteReducer,
  allServiceCodeListReducer,
  masterDataForServiceCodeReducer,
} from './reducers/masters/serviceCodeReducers'

//sales orders
import {
  salesOrderCreateReducer,
  salesOrderDetailsReducer,
  salesOrderUpdateReducer,
  salesOrderDeleteReducer,
  allSalesOrderListReducer,
  masterDataForSalesOrderReducer,
  backOrdersBySOReducer,
  soDetailsByLineReducer,
  cancelSODetailsByLineReducer,
  backOrdersByJCReducer,
  jcmasterDataForSalesOrderReducer,
  customerOpenSalesOrderListReducer,
  balancedQtyBySOReducer,
  salesOrderUpdateCancelQtyReducer,
} from './reducers/sales/salesOrderReducers'

//sales invoice
import {
  salesInvoiceCreateReducer,
  salesInvoiceDetailsReducer,
  salesInvoiceUpdateReducer,
  salesInvoiceDeleteReducer,
  allSalesInvoiceListReducer,
  allSalesInvoiceWithTaxListReducer,
  masterDataForSalesInvoiceReducer,
  allSalesInvoiceListForCustomerReducer,
  siDetailsByLineReducer,
  siDetailsByDispatchReducer,
} from './reducers/sales/salesInvoiceReducers'

//credit note
import {
  creditNoteCreateReducer,
  creditNoteDetailsReducer,
  creditNoteUpdateReducer,
  creditNoteDeleteReducer,
  allCreditNoteListReducer,
  masterDataForCreditNoteReducer,
  allCreditNoteWithTaxListReducer,
} from './reducers/sales/creditNoteReducers'

import {
  jobCardCreateReducer,
  jobCardDetailsReducer,
  jobCardUpdateReducer,
  jobCardDeleteReducer,
  allJobCardListReducer,
  masterDataForJobCardReducer,
  yieldReportReducer,
} from './reducers/production/jobCardReducers'

import {
  fgmiCreateReducer,
  fgmiDetailsReducer,
  fgmiUpdateReducer,
  fgmiDeleteReducer,
  allFGMIListReducer,
  masterDataForFGMIReducer,
  allFGMIBatchesByJCListReducer,
  fgmiUpdateFGMICorrectionReducer,
} from './reducers/production/fgmiReducers'
//DRN reducers
import {
  drnCreateReducer,
  drnDetailsReducer,
  drnUpdateReducer,
  drnDeleteReducer,
  allDRNListReducer,
  masterDataForDRNReducer,
  allOpenDRNListReducer,
  allApprovedDRNListReducer,
  allRejectedDRNListReducer,
} from './reducers/production/drnReducers'

//Delivery Note
import {
  deliveryNoteCreateReducer,
  deliveryNoteDetailsReducer,
  deliveryNoteUpdateReducer,
  deliveryNoteDeleteReducer,
  allDeliveryNoteListReducer,
  masterDataForDeliveryNoteReducer,
} from './reducers/production/deliveryNoteReducers'
//Dispatch Details
import {
  dispatchDetailsCreateReducer,
  dispatchDetailsUpdateReducer,
  allDispatchDetailsListReducer,
  masterDataForDispatchDetailsReducer,
} from './reducers/production/dispatchDetailsReducers'
//Dashboard
import {
  dashboardDataReducer,
  dashboardChartDataReducer,
  dashboardProductionDataReducer,
  dashboardSalesDataReducer,
  dashboardQADataReducer,
  ppmDashboardDataReducer,
} from './reducers/dashboard/dashboardReducers'

import {
  issueCreateReducer,
  issueDetailsReducer,
  issueUpdateReducer,
  issueDeleteReducer,
  allIssueListReducer,
  masterDataForIssueReducer,
} from './reducers/masters/issueReducers'

import {
  autoIncrementCreateReducer,
  autoIncrementDetailsReducer,
  autoIncrementUpdateReducer,
  autoIncrementDeleteReducer,
  allAutoIncrementListReducer,
} from './reducers/masters/autoIncrementReducers'

import {
  companyCreateReducer,
  companyDetailsReducer,
  companyUpdateReducer,
  companyDeleteReducer,
  allCompanyListReducer,
} from './reducers/masters/companyReducers'

import {
  inspectionParameterCreateReducer,
  inspectionParameterDetailsReducer,
  inspectionParameterUpdateReducer,
  inspectionParameterDeleteReducer,
  allInspectionParameterListReducer,
  masterDataForInspectionParameterReducer,
} from './reducers/qa/inspectionParameterReducers'

import {
  inspectionMethodCreateReducer,
  inspectionMethodDetailsReducer,
  inspectionMethodUpdateReducer,
  inspectionMethodDeleteReducer,
  allInspectionMethodListReducer,
  masterDataForInspectionMethodReducer,
} from './reducers/qa/inspectionMethodReducers'

import {
  pdirTemplateCreateReducer,
  pdirTemplateDetailsReducer,
  pdirTemplateUpdateReducer,
  pdirTemplateDeleteReducer,
  allPDIRTemplateListReducer,
  masterDataForPDIRTemplateReducer,
} from './reducers/qa/pdirTemplateReducers'

import {
  pdirCreateReducer,
  pdirDetailsReducer,
  pdirUpdateReducer,
  pdirDeleteReducer,
  allPDIRListReducer,
  masterDataForPDIRReducer,
} from './reducers/qa/pdirReducers'

//service master
import {
  serviceMasterCreateReducer,
  serviceMasterDetailsReducer,
  serviceMasterUpdateReducer,
  serviceMasterDeleteReducer,
  allServiceMasterListReducer,
  masterDataForServiceMasterReducer,
} from './reducers/masters/serviceMasterReducers'

//service master
import {
  appParameterCreateReducer,
  appParameterDetailsReducer,
  appParameterUpdateReducer,
  appParameterDeleteReducer,
  allAppParameterListReducer,
  masterDataForAppParameterReducer,
} from './reducers/masters/appParameterReducers'

import {
  ppmReportCreateReducer,
  ppmReportDetailsReducer,
  ppmReportUpdateReducer,
} from './reducers/qa/ppmReportReducers'

//supplier master
import {
  suppliersListReducer,
  supplierDetailsReducer,
  supplierCreateReducer,
  masterdataForSupplierMasterReducer,
  supplierUpdateReducer,
} from './reducers/masters/supplierReducers.js'

const reducer = combineReducers({
  //user data
  userLogin: userLoginReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userCreate: userCreateReducer,
  allUserList: allUserListReducer,
  masterDataForUser: masterDataForUserReducer,
  //role
  roleCreate: roleCreateReducer,
  roleDetails: roleDetailsReducer,
  roleUpdate: roleUpdateReducer,
  roleDelete: roleDeleteReducer,
  allRoleList: allRoleListReducer,
  //company master
  companyCreate: companyCreateReducer,
  companyDetails: companyDetailsReducer,
  companyUpdate: companyUpdateReducer,
  companyDelete: companyDeleteReducer,
  allCompanyList: allCompanyListReducer,
  //menu management
  menuItemCreate: menuItemCreateReducer,
  menuItemDetails: menuItemDetailsReducer,
  menuItemUpdate: menuItemUpdateReducer,
  menuItemDelete: menuItemDeleteReducer,
  allMenuItemList: allMenuItemListReducer,
  allSubMenuItemList: allSubMenuItemListReducer,
  masterDataForMenu: masterDataForMenuReducer,
  //customer master data
  allCustomersList: customersListReducer,
  customerDetails: customerDetailsReducer,
  customerCreate: customerCreateReducer,
  masterdataForCustomerMaster: masterdataForCustomerMasterReducer,
  customerUpdate: customerUpdateReducer,
  //jc master data
  jcMasterCreate: jcMasterCreateReducer,
  jcMasterDetails: jcMasterDetailsReducer,
  jcMasterUpdate: jcMasterUpdateReducer,
  jcMasterDelete: jcMasterDeleteReducer,
  allJCMastersList: allJCMastersListReducer,
  allCustomerJCList: allCustomerJCListReducer,
  allCustomerJCPOList: allCustomerJCPOListReducer,
  masterDataForJC: masterDataForJCReducer,
  jcMastersList: jcMastersListReducer,
  //hsn master
  hsnCreate: hsnCreateReducer,
  hsnDetails: hsnDetailsReducer,
  hsnUpdate: hsnUpdateReducer,
  hsnDelete: hsnDeleteReducer,
  allHSNList: allHSNListReducer,
  //sac master
  sacCreate: sacCreateReducer,
  sacDetails: sacDetailsReducer,
  sacUpdate: sacUpdateReducer,
  sacDelete: sacDeleteReducer,
  allSACList: allSACListReducer,
  //prod category
  prodCategoryCreate: prodCategoryCreateReducer,
  prodCategoryDetails: prodCategoryDetailsReducer,
  prodCategoryUpdate: prodCategoryUpdateReducer,
  prodCategoryDelete: prodCategoryDeleteReducer,
  allProdCategoryList: allProdCategoryListReducer,
  //prod code
  productCodeCreate: productCodeCreateReducer,
  productCodeDetails: productCodeDetailsReducer,
  productCodeUpdate: productCodeUpdateReducer,
  productCodeDelete: productCodeDeleteReducer,
  allProductCodeList: allProductCodeListReducer,
  masterDataForProductCode: masterDataForProductCodeReducer,
  //service code
  serviceCodeCreate: serviceCodeCreateReducer,
  serviceCodeDetails: serviceCodeDetailsReducer,
  serviceCodeUpdate: serviceCodeUpdateReducer,
  serviceCodeDelete: serviceCodeDeleteReducer,
  allServiceCodeList: allServiceCodeListReducer,
  masterDataForServiceCode: masterDataForServiceCodeReducer,
  //uom
  uomCreate: uomCreateReducer,
  uomDetails: uomDetailsReducer,
  uomUpdate: uomUpdateReducer,
  uomDelete: uomDeleteReducer,
  allUOMList: allUOMListReducer,
  //auto increment
  autoIncrementCreate: autoIncrementCreateReducer,
  autoIncrementDetails: autoIncrementDetailsReducer,
  autoIncrementUpdate: autoIncrementUpdateReducer,
  autoIncrementDelete: autoIncrementDeleteReducer,
  allAutoIncrementList: allAutoIncrementListReducer,
  //machine master
  machineMasterCreate: machineMasterCreateReducer,
  machineMasterDetails: machineMasterDetailsReducer,
  machineMasterUpdate: machineMasterUpdateReducer,
  machineMasterDelete: machineMasterDeleteReducer,
  allMachineMasterList: allMachineMasterListReducer,
  //sales order data
  salesOrderCreate: salesOrderCreateReducer,
  salesOrderDetails: salesOrderDetailsReducer,
  salesOrderUpdate: salesOrderUpdateReducer,
  salesOrderDelete: salesOrderDeleteReducer,
  allSalesOrderList: allSalesOrderListReducer,
  masterDataForSalesOrder: masterDataForSalesOrderReducer,
  customerOpenSalesOrderList: customerOpenSalesOrderListReducer,
  //Sales Invoice
  salesInvoiceCreate: salesInvoiceCreateReducer,
  salesInvoiceDetails: salesInvoiceDetailsReducer,
  salesInvoiceUpdate: salesInvoiceUpdateReducer,
  salesInvoiceDelete: salesInvoiceDeleteReducer,
  allSalesInvoiceList: allSalesInvoiceListReducer,
  allSalesInvoiceWithTaxList: allSalesInvoiceWithTaxListReducer,
  masterDataForSalesInvoice: masterDataForSalesInvoiceReducer,
  allSalesInvoiceListForCustomer: allSalesInvoiceListForCustomerReducer,
  siDetailsByLine: siDetailsByLineReducer,
  siDetailsByDispatch: siDetailsByDispatchReducer,
  //credit note
  creditNoteCreate: creditNoteCreateReducer,
  creditNoteDetails: creditNoteDetailsReducer,
  creditNoteUpdate: creditNoteUpdateReducer,
  creditNoteDelete: creditNoteDeleteReducer,
  allCreditNoteList: allCreditNoteListReducer,
  masterDataForCreditNote: masterDataForCreditNoteReducer,
  allCreditNoteWithTaxList: allCreditNoteWithTaxListReducer,
  //sales order reports
  balancedQtyBySO: balancedQtyBySOReducer,
  backOrdersBySO: backOrdersBySOReducer,
  soDetailsByLine: soDetailsByLineReducer,
  cancelSODetailsByLine: cancelSODetailsByLineReducer,
  backOrdersByJC: backOrdersByJCReducer,
  jcmasterDataForSalesOrder: jcmasterDataForSalesOrderReducer,
  jcMastersReport: jcMastersReportReducer,
  salesOrderUpdateCancelQty: salesOrderUpdateCancelQtyReducer,
  //job card data
  jobCardCreate: jobCardCreateReducer,
  jobCardDetails: jobCardDetailsReducer,
  jobCardUpdate: jobCardUpdateReducer,
  jobCardDelete: jobCardDeleteReducer,
  allJobCardList: allJobCardListReducer,
  masterDataForJobCard: masterDataForJobCardReducer,
  yieldReport: yieldReportReducer,
  //fgmi
  fgmiCreate: fgmiCreateReducer,
  fgmiDetails: fgmiDetailsReducer,
  fgmiUpdate: fgmiUpdateReducer,
  fgmiDelete: fgmiDeleteReducer,
  allFGMIList: allFGMIListReducer,
  masterDataForFGMI: masterDataForFGMIReducer,
  allFGMIBatchesByJCList: allFGMIBatchesByJCListReducer,
  fgmiUpdateFGMICorrection: fgmiUpdateFGMICorrectionReducer,
  //DRN
  drnCreate: drnCreateReducer,
  drnDetails: drnDetailsReducer,
  drnUpdate: drnUpdateReducer,
  drnDelete: drnDeleteReducer,
  allDRNList: allDRNListReducer,
  masterDataForDRN: masterDataForDRNReducer,
  //DRN Approval
  allOpenDRNList: allOpenDRNListReducer,
  allApprovedDRNList: allApprovedDRNListReducer,
  //DRN Rejected List
  allRejectedDRNList: allRejectedDRNListReducer,
  //Delivery Note
  deliveryNoteCreate: deliveryNoteCreateReducer,
  deliveryNoteDetails: deliveryNoteDetailsReducer,
  deliveryNoteUpdate: deliveryNoteUpdateReducer,
  deliveryNoteDelete: deliveryNoteDeleteReducer,
  allDeliveryNoteList: allDeliveryNoteListReducer,
  masterDataForDeliveryNote: masterDataForDeliveryNoteReducer,
  //Dispatch Details
  dispatchDetailsCreate: dispatchDetailsCreateReducer,
  dispatchDetailsUpdate: dispatchDetailsUpdateReducer,
  allDispatchDetailsList: allDispatchDetailsListReducer,
  masterDataForDispatchDetails: masterDataForDispatchDetailsReducer,
  //Dashboard
  dashboardData: dashboardDataReducer,
  dashboardChartData: dashboardChartDataReducer,
  dashboardProductionData: dashboardProductionDataReducer,
  dashboardQAData: dashboardQADataReducer,
  dashboardSalesData: dashboardSalesDataReducer,
  ppmDashboardData: ppmDashboardDataReducer,
  //Issue
  issueCreate: issueCreateReducer,
  issueDetails: issueDetailsReducer,
  issueUpdate: issueUpdateReducer,
  issueDelete: issueDeleteReducer,
  allIssueList: allIssueListReducer,
  masterDataForIssue: masterDataForIssueReducer,
  //App Parameters
  appParameterCreate: appParameterCreateReducer,
  appParameterDetails: appParameterDetailsReducer,
  appParameterUpdate: appParameterUpdateReducer,
  appParameterDelete: appParameterDeleteReducer,
  allAppParameterList: allAppParameterListReducer,
  masterDataForAppParameter: masterDataForAppParameterReducer,
  //inspection params
  inspectionParameterCreate: inspectionParameterCreateReducer,
  inspectionParameterDetails: inspectionParameterDetailsReducer,
  inspectionParameterUpdate: inspectionParameterUpdateReducer,
  inspectionParameterDelete: inspectionParameterDeleteReducer,
  allInspectionParameterList: allInspectionParameterListReducer,
  masterDataForInspectionParameter: masterDataForInspectionParameterReducer,
  //inspection methods
  inspectionMethodCreate: inspectionMethodCreateReducer,
  inspectionMethodDetails: inspectionMethodDetailsReducer,
  inspectionMethodUpdate: inspectionMethodUpdateReducer,
  inspectionMethodDelete: inspectionMethodDeleteReducer,
  allInspectionMethodList: allInspectionMethodListReducer,
  masterDataForInspectionMethod: masterDataForInspectionMethodReducer,
  //pdir template
  pdirTemplateCreate: pdirTemplateCreateReducer,
  pdirTemplateDetails: pdirTemplateDetailsReducer,
  pdirTemplateUpdate: pdirTemplateUpdateReducer,
  pdirTemplateDelete: pdirTemplateDeleteReducer,
  allPDIRTemplateList: allPDIRTemplateListReducer,
  masterDataForPDIRTemplate: masterDataForPDIRTemplateReducer,
  //pdir
  pdirCreate: pdirCreateReducer,
  pdirDetails: pdirDetailsReducer,
  pdirUpdate: pdirUpdateReducer,
  pdirDelete: pdirDeleteReducer,
  allPDIRList: allPDIRListReducer,
  masterDataForPDIR: masterDataForPDIRReducer,
  //service master
  serviceMasterCreate: serviceMasterCreateReducer,
  serviceMasterDetails: serviceMasterDetailsReducer,
  serviceMasterUpdate: serviceMasterUpdateReducer,
  serviceMasterDelete: serviceMasterDeleteReducer,
  allServiceMasterList: allServiceMasterListReducer,
  masterDataForServiceMaster: masterDataForServiceMasterReducer,
  //ppm report
  ppmReportCreate: ppmReportCreateReducer,
  ppmReportDetails: ppmReportDetailsReducer,
  ppmReportUpdate: ppmReportUpdateReducer,
  //supplier master data
  allSuppliersList: suppliersListReducer,
  supplierDetails: supplierDetailsReducer,
  supplierCreate: supplierCreateReducer,
  masterdataForSupplierMaster: masterdataForSupplierMasterReducer,
  supplierUpdate: supplierUpdateReducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
}

const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
