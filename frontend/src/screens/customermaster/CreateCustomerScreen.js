import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../../components/form/FormContainer'
import FormFieldsContainer from './../../components/form/FormFieldsContainer'

import {
  createCustomer,
  getAllMasterDataForCustomerMaster,
} from '../../actions/masters/customerActions'
import { CUSTOMER_CREATE_RESET } from '../../constants/masters/customerConstants'
import Message from '../../components/app/Message'
import { Link } from 'react-router-dom'
import { NotificationManager } from 'react-notifications'
import { APPLICATION_NOTIFICATION_TIME_OUT } from '../../constants/application/application'
import Breadcrumb from './../../components/app/Breadcrumb'

const CreateCustomerScreen = ({ match, history }) => {
  const [custCode, setCustCode] = useState('')
  const [custName, setCustName] = useState('')
  const [custCIN, setCustCIN] = useState('')
  const [custMSMENo, setCustMSMENo] = useState('')
  const [custURD, setCustURD] = useState('')
  const [custNickName, setCustNickName] = useState('')
  const [custCompanyType, setCustCompanyType] = useState('PVT LTD')
  const [custGST, setCustGST] = useState('')
  const [custPAN, setCustPAN] = useState('')

  const [custBillAddressLine1, setCustBillAddressLine1] = useState('')
  const [custBillAddressLine2, setCustBillAddressLine2] = useState('')
  const [custBillAddressLine3, setCustBillAddressLine3] = useState('')
  const [custBillState, setCustBillState] = useState('')
  const [custBillCity, setCustBillCity] = useState('')
  const [custBillDistrict, setCustBillDistrict] = useState('')
  const [custBillPinCode, setCustBillPinCode] = useState('')

  const [custShipAddressLine1, setCustShipAddressLine1] = useState('')
  const [custShipAddressLine2, setCustShipAddressLine2] = useState('')
  const [custShipAddressLine3, setCustShipAddressLine3] = useState('')
  const [custShipState, setCustShipState] = useState('')
  const [custShipCity, setCustShipCity] = useState('')
  const [custShipDistrict, setCustShipDistrict] = useState('')
  const [custShipPinCode, setCustShipPinCode] = useState('')

  const [custContactPersonName, setCustContactPersonName] = useState('')
  const [custContactPersonDesignation, setCustContactPersonDesignation] =
    useState('')
  const [custContactPersonNumber, setCustContactPersonNumber] = useState('')
  const [custContactPersonAltNum, setCustContactPersonAltNum] = useState('')
  const [custTelNo, setCustTelNo] = useState('')
  const [custContactPersonEmail, setCustContactPersonEmail] = useState('')
  const [isCustActive, setIsCustActive] = useState('A')
  const [custAlsoSupplier, setCustAlsoSupplier] = useState('')
  const [custVendorCode, setCustVendorCode] = useState('')
  const [custBefName, setCustBefName] = useState('')
  const [custBankName, setCustBankName] = useState('')
  const [custAccountNumber, setCustAccountNumber] = useState('')
  const [custAccType, setCustAccType] = useState('')
  const [custBankIFSCCode, setCustBankIFSCCode] = useState('')
  //disable button on click
  const [executing, setExecuting] = useState(false)

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const customerCreate = useSelector((state) => state.customerCreate)
  const { success, customer, error } = customerCreate
  console.log('>>>>>++++ Error when creating customer ==== ', error)
  //console .log(">>>>>++++ Customer Details Created are ==== ", customer)

  const masterdataForCustomerMaster = useSelector(
    (state) => state.masterdataForCustomerMaster
  )

  const { loading: loadingMasterData } = masterdataForCustomerMaster

  let autoIncrementedCustomerNo = ''
  if (masterdataForCustomerMaster !== undefined) {
    autoIncrementedCustomerNo =
      masterdataForCustomerMaster.autoIncrementedCustomerNo
  }

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    } else {
      dispatch(getAllMasterDataForCustomerMaster())
    }

    if (success) {
      //history.replace(`/customers/${customer._id}/edit`)
      history.push('/customerlist')
      dispatch({ type: CUSTOMER_CREATE_RESET })
      NotificationManager.success(
        `Customer Record ${customer.custName} has been successfully created !`,
        'Successful!',
        APPLICATION_NOTIFICATION_TIME_OUT
      )
    }
    console.log('Error in useEffect is ', error)
    if (error) {
      dispatch({ type: CUSTOMER_CREATE_RESET })
      NotificationManager.error(
        `Error in creating Customer Master Record !`,
        'Error!',
        APPLICATION_NOTIFICATION_TIME_OUT
      )
    }
    window.scrollTo(0, 0)
    // eslint-disable-next-line
  }, [history, success])

  const handleBillAddressCopy = () => {
    setCustShipAddressLine1(custBillAddressLine1)
    setCustShipAddressLine2(custBillAddressLine2)
    setCustShipAddressLine3(custBillAddressLine3)
    setCustShipState(custBillState)
    setCustShipCity(custBillCity)
    setCustShipDistrict(custBillDistrict)
    setCustShipPinCode(custBillPinCode)
  }

  const handleClearShipAddressCopy = () => {
    setCustShipAddressLine1('')
    setCustShipAddressLine2('')
    setCustShipAddressLine3('')
    setCustShipState('')
    setCustShipCity('')
    setCustShipDistrict('')
    setCustShipPinCode('')
  }

  const handleReset = () => {
    setCustCode('')
    setCustName('')
    setCustCIN('')
    setCustMSMENo('')
    setCustURD('')
    setCustNickName('')
    setCustCompanyType('')
    setCustGST('')
    setCustPAN('')
    setCustBillAddressLine1('')
    setCustBillAddressLine2('')
    setCustBillAddressLine3('')
    setCustBillState('')
    setCustBillCity('')
    setCustBillDistrict('')
    setCustBillPinCode('')
    setCustShipAddressLine1('')
    setCustShipAddressLine2('')
    setCustShipAddressLine3('')
    setCustShipState('')
    setCustShipCity('')
    setCustShipDistrict('')
    setCustShipPinCode('')
    setCustContactPersonName('')
    setCustContactPersonDesignation('')
    setCustContactPersonNumber('')
    setCustContactPersonAltNum('')
    setCustTelNo('')
    setCustContactPersonEmail('')
    setIsCustActive('')
    setCustAlsoSupplier('')
    setCustBefName('')
    setCustBankName('')
    setCustAccountNumber('')
    setCustAccType('')
    setCustBankIFSCCode('')
  }

  const submitHandler = (e) => {
    //console .log("INside submit handler of sccreen ----- ")
    let custBillingAddress = [
      {
        custBillAddressLine1,
        custBillAddressLine2,
        custBillAddressLine3,
        custBillState,
        custBillCity,
        custBillDistrict,
        custBillPinCode,
      },
    ]

    let custShipingAddress = [
      {
        custShipAddressLine1,
        custShipAddressLine2,
        custShipAddressLine3,
        custShipState,
        custShipCity,
        custShipDistrict,
        custShipPinCode,
      },
    ]

    e.preventDefault()
    setExecuting(true)
    dispatch(
      createCustomer({
        custCode: autoIncrementedCustomerNo,
        custName,
        custCIN,
        custMSMENo,
        custURD,
        custNickName,
        custCompanyType,
        custGST,
        custPAN,
        custBillingAddress,
        custShipingAddress,
        custContactPersonName,
        custContactPersonDesignation,
        custContactPersonNumber,
        custContactPersonAltNum,
        custContactPersonEmail,
        isCustActive,
        custAlsoSupplier,
        custVendorCode,
        custBefName,
        custBankName,
        custAccountNumber,
        custAccType,
        custBankIFSCCode,
      })
    )
  }

  return (
    <FormContainer>
      <Breadcrumb listPage='customerlist' />
      <br></br>
      <FormFieldsContainer frameTitle='Add Customer Details !!!'>
        {error && (
          <Row>
            <Col lg={4}></Col>
            <Col lg={4}>
              <Message variant='danger'>{error} !!</Message>
            </Col>
          </Row>
        )}
        <Form onSubmit={submitHandler}>
          <Col>
            <Row>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custCode'>
                  <Form.Label>Customer Code</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={autoIncrementedCustomerNo}
                    onChange={(e) => setCustCode(e.target.value)}
                    readOnly
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custName'>
                  <Form.Label>
                    Customer Name (Legal Entity)
                    <span className='mandatory'>*</span>
                  </Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    required
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custCode'>
                  <Form.Label>
                    Customer Nick Name<span className='mandatory'>*</span>
                  </Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    required
                    value={custNickName}
                    onChange={(e) => setCustNickName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {/* second row start */}
            <Row>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custCompanyType'>
                  <Form.Label>
                    Type of Company<span className='mandatory'>*</span>
                  </Form.Label>
                  <Form.Control
                    as='select'
                    custom
                    placeholder='Select Company Type'
                    value={custCompanyType}
                    onChange={(e) => setCustCompanyType(e.target.value)}
                  >
                    <option value='PVT LTD'>PVT LTD</option>
                    <option value='OPC'>OPC</option>
                    <option value='Partnership Firm'>Partnership Firm</option>
                    <option value='LLP'>LLP</option>
                    <option value='Proprietor'>Proprietor</option>
                    <option value='LTD'>LTD</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custCIN'>
                  <Form.Label>Company Identification # (CIN)</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={custCIN}
                    onChange={(e) => setCustCIN(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custMSME'>
                  <Form.Label>MSME Enterprises</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={custMSMENo}
                    onChange={(e) => setCustMSMENo(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {/* second row end */}

            {/* third row start */}
            <Row>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custGST'>
                  <Form.Label>
                    Goods and Services Tax(GST)
                    <span className='mandatory'>*</span>
                  </Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    required
                    value={custGST}
                    onChange={(e) => setCustGST(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custURD'>
                  <Form.Label>Unregistered Dealer(URD)</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={custURD}
                    onChange={(e) => setCustURD(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custPAN'>
                  <Form.Label>
                    Permanent Account Number(PAN)
                    <span className='mandatory'>*</span>
                  </Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    required
                    value={custPAN}
                    onChange={(e) => setCustPAN(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {/* third row end */}

            {/* 4th row start */}
            <Row>
              <Col lg={6} md={12} xs={12}>
                <Row>
                  <Col>
                    <h6 className='px-3 py-2'>Address(Bill To)</h6>
                  </Col>
                  <Col style={{ textAlign: 'end' }}>
                    <Button
                      variant='primary'
                      className='button-class btn-md'
                      onClick={handleBillAddressCopy}
                    >
                      Copy Billing Address
                    </Button>
                  </Col>
                </Row>
                <Row className='my-2'>
                  <Col lg={6} md={12} xs={12}>
                    <Form.Group controlId='custBillAddressLine1'>
                      <Form.Label>
                        Billing Address Line 1
                        <span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={custBillAddressLine1}
                        onChange={(e) =>
                          setCustBillAddressLine1(e.target.value)
                        }
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={6} md={12} xs={12}>
                    <Form.Group controlId='custBillAddressLine2'>
                      <Form.Label>
                        Billing Address Line 2
                        <span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={custBillAddressLine2}
                        onChange={(e) =>
                          setCustBillAddressLine2(e.target.value)
                        }
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6} md={12} xs={12}>
                    <Form.Group controlId='custBillAddressLine3'>
                      <Form.Label>Billing Address Line 3</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        value={custBillAddressLine3}
                        onChange={(e) =>
                          setCustBillAddressLine3(e.target.value)
                        }
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={6} md={12} xs={12}>
                    <Form.Group controlId='custBillState'>
                      <Form.Label>
                        State - Place of Supply
                        <span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={custBillState}
                        onChange={(e) => setCustBillState(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={4} md={12} xs={12}>
                    <Form.Group controlId='custBillCity'>
                      <Form.Label>
                        City<span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={custBillCity}
                        onChange={(e) => setCustBillCity(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={12} xs={12}>
                    <Form.Group controlId='custBillDistrict'>
                      <Form.Label>
                        District<span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={custBillDistrict}
                        onChange={(e) => setCustBillDistrict(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={12} xs={12}>
                    <Form.Group controlId='custBillPinCode'>
                      <Form.Label>
                        Pincode<span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={custBillPinCode}
                        onChange={(e) => setCustBillPinCode(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col
                lg={6}
                md={12}
                xs={12}
                style={{ borderLeft: '2px solid red' }}
              >
                <Row>
                  <Col>
                    <h6 className='px-3 py-2'>Address(Ship To)</h6>
                  </Col>
                  <Col style={{ textAlign: 'end' }}>
                    <Button
                      variant='primary'
                      className='button-class btn-md'
                      onClick={handleClearShipAddressCopy}
                    >
                      Clear Shipping Address
                    </Button>
                  </Col>
                </Row>
                <Row className='my-2'>
                  <Col lg={6} md={12} xs={12}>
                    <Form.Group controlId='custShipAddressLine1'>
                      <Form.Label>
                        Shipping Address Line 1
                        <span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={custShipAddressLine1}
                        onChange={(e) =>
                          setCustShipAddressLine1(e.target.value)
                        }
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={6} md={12} xs={12}>
                    <Form.Group controlId='custShipAddressLine2'>
                      <Form.Label>
                        Shipping Address Line 2
                        <span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={custShipAddressLine2}
                        onChange={(e) =>
                          setCustShipAddressLine2(e.target.value)
                        }
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6} md={12} xs={12}>
                    <Form.Group controlId='custShipAddressLine3'>
                      <Form.Label>Shipping Address Line 3</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        value={custShipAddressLine3}
                        onChange={(e) =>
                          setCustShipAddressLine3(e.target.value)
                        }
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={6} md={12} xs={12}>
                    <Form.Group controlId='custShipState'>
                      <Form.Label>
                        State - Place of Supply
                        <span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={custShipState}
                        onChange={(e) => setCustShipState(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={4} md={12} xs={12}>
                    <Form.Group controlId='custShipCity'>
                      <Form.Label>
                        City<span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={custShipCity}
                        onChange={(e) => setCustShipCity(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={12} xs={12}>
                    <Form.Group controlId='custShipDistrict'>
                      <Form.Label>
                        District<span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        value={custShipDistrict}
                        required
                        onChange={(e) => setCustShipDistrict(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={12} xs={12}>
                    <Form.Group controlId='custShipPinCode'>
                      <Form.Label>
                        Pincode<span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        value={custShipPinCode}
                        required
                        onChange={(e) => setCustShipPinCode(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* 4th row end */}

            {/* 5th row start */}
            <br></br>
            <Row>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custContactPersonName'>
                  <Form.Label>Contact Person Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={custContactPersonName}
                    onChange={(e) => setCustContactPersonName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custContactPersonDesignation'>
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={custContactPersonDesignation}
                    onChange={(e) =>
                      setCustContactPersonDesignation(e.target.value)
                    }
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custContactPersonNumber'>
                  <Form.Label>Contact No(Mobile No)</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={custContactPersonNumber}
                    onChange={(e) => setCustContactPersonNumber(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {/* 5th row end */}

            {/* 6th row start */}
            <Row>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custContactPersonAltNum'>
                  <Form.Label>Alternate No(Whatsapp No)</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={custContactPersonAltNum}
                    onChange={(e) => setCustContactPersonAltNum(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custContactPersonEmail'>
                  <Form.Label>Email-ID</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={custContactPersonEmail}
                    onChange={(e) => setCustContactPersonEmail(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custTelNo'>
                  <Form.Label>Telephone No</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={custTelNo}
                    onChange={(e) => setCustTelNo(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {/* 6th row end */}
            <Row>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='isCustActive'>
                  <Form.Label>Customer Status</Form.Label>
                  <Form.Control
                    as='select'
                    custom
                    placeholder='Select Customer Status'
                    value={isCustActive}
                    onChange={(e) => setIsCustActive(e.target.value)}
                  >
                    <option value='A'>Active</option>
                    <option value='I'>Inactive</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custAlsoSupplier'>
                  <Form.Label>Is Customer Supplier?</Form.Label>
                  <Form.Control
                    as='select'
                    custom
                    placeholder='Select Customer Status'
                    value={custAlsoSupplier}
                    onChange={(e) => setCustAlsoSupplier(e.target.value)}
                  >
                    <option value='N'>No</option>
                    <option value='Y'>Yes</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custVendorCode'>
                  <Form.Label>Vendor Code</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={custVendorCode}
                    onChange={(e) => setCustVendorCode(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <hr style={{ border: '2px solid red' }}></hr>
            {/* 7th row start */}
            <Row>
              <Col>
                <h5>Bank Details</h5>
              </Col>
            </Row>
            {/* 7th row end */}

            {/* 8th row start */}
            <Row>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custBefName'>
                  <Form.Label>Beneficiary Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={custBefName}
                    onChange={(e) => setCustBefName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custBankName'>
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={custBankName}
                    onChange={(e) => setCustBankName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custAccountNumber'>
                  <Form.Label>Account No</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={custAccountNumber}
                    onChange={(e) => setCustAccountNumber(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {/* 8th row end */}

            {/* 9th row start */}
            <Row>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custAccType'>
                  <Form.Label>Account Type</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={custAccType}
                    onChange={(e) => setCustAccType(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='custBankIFSCCode'>
                  <Form.Label>IFSC Code</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={custBankIFSCCode}
                    onChange={(e) => setCustBankIFSCCode(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {/* 9th row end */}

            {/* 10th row start */}
            <Row>
              <Col style={{ textAlign: 'end' }}>
                <Button
                  type='reset'
                  className='reset-button-class mx-3 my-3 btn-md'
                  onClick={handleReset}
                >
                  <i className='fas fa-undo'></i> Reset
                </Button>
                <Button
                  type='submit'
                  disabled={executing}
                  className=' my-3 btn-md button-class'
                  onClick={(e) => e.currentTarget.blur()}
                >
                  <i className='fas fa-save'></i> Save
                </Button>
              </Col>
            </Row>
            {/* 10th row end */}
          </Col>
        </Form>
      </FormFieldsContainer>
    </FormContainer>
  )
}

export default CreateCustomerScreen
