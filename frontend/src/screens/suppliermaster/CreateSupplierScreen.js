import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../../components/form/FormContainer'
import FormFieldsContainer from './../../components/form/FormFieldsContainer'

import {
  createSupplier,
  getAllMasterDataForSupplierMaster,
} from '../../actions/masters/supplierActions.js'
import { SUPPLIER_CREATE_RESET } from '../../constants/masters/supplierConstants'
import Message from '../../components/app/Message'
import { Link } from 'react-router-dom'
import { NotificationManager } from 'react-notifications'
import { APPLICATION_NOTIFICATION_TIME_OUT } from '../../constants/application/application'
import Breadcrumb from './../../components/app/Breadcrumb'

const CreateSupplierScreen = ({ match, history }) => {
  const [supplierCode, setSupplierCode] = useState('')
  const [supplierName, setSupplierName] = useState('')
  const [supplierCIN, setSupplierCIN] = useState('')
  const [supplierMSMENo, setSupplierMSMENo] = useState('')
  const [supplierURD, setSupplierURD] = useState('')
  const [supplierNickName, setSupplierNickName] = useState('')
  const [supplierCompanyType, setSupplierCompanyType] = useState('PVT LTD')
  const [supplierGST, setSupplierGST] = useState('')
  const [supplierPAN, setSupplierPAN] = useState('')

  const [supplierBillAddressLine1, setSupplierBillAddressLine1] = useState('')
  const [supplierBillAddressLine2, setSupplierBillAddressLine2] = useState('')
  const [supplierBillAddressLine3, setSupplierBillAddressLine3] = useState('')
  const [supplierBillState, setSupplierBillState] = useState('')
  const [supplierBillCity, setSupplierBillCity] = useState('')
  const [supplierBillDistrict, setSupplierBillDistrict] = useState('')
  const [supplierBillPinCode, setSupplierBillPinCode] = useState('')

  const [supplierShipAddressLine1, setSupplierShipAddressLine1] = useState('')
  const [supplierShipAddressLine2, setSupplierShipAddressLine2] = useState('')
  const [supplierShipAddressLine3, setSupplierShipAddressLine3] = useState('')
  const [supplierShipState, setSupplierShipState] = useState('')
  const [supplierShipCity, setSupplierShipCity] = useState('')
  const [supplierShipDistrict, setSupplierShipDistrict] = useState('')
  const [supplierShipPinCode, setSupplierShipPinCode] = useState('')

  const [supplierContactPersonName, setSupplierContactPersonName] = useState('')
  const [
    supplierContactPersonDesignation,
    setSupplierContactPersonDesignation,
  ] = useState('')
  const [supplierContactPersonNumber, setSupplierContactPersonNumber] =
    useState('')
  const [supplierContactPersonAltNum, setSupplierContactPersonAltNum] =
    useState('')
  const [supplierTelNo, setSupplierTelNo] = useState('')
  const [supplierContactPersonEmail, setSupplierContactPersonEmail] =
    useState('')
  const [isSupplierActive, setIsSupplierActive] = useState('A')
  //const [ custAlsoSupplier, setCustAlsoSupplier ] = useState('');
  const [supplierVendorCode, setSupplierVendorCode] = useState('')
  const [supplierBefName, setSupplierBefName] = useState('')
  const [supplierBankName, setSupplierBankName] = useState('')
  const [supplierAccountNumber, setSupplierAccountNumber] = useState('')
  const [supplierAccType, setSupplierAccType] = useState('')
  const [supplierBankIFSCCode, setSupplierBankIFSCCode] = useState('')
  //disable button on click
  const [executing, setExecuting] = useState(false)

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const supplierCreate = useSelector((state) => state.supplierCreate)
  const { success, supplier, error } = supplierCreate
  console.log('>>>>>++++ Error when creating supplier ==== ', error)
  //console .log(">>>>>++++ Supplier Details Created are ==== ", supplier)

  const masterdataForSupplierMaster = useSelector(
    (state) => state.masterdataForSupplierMaster
  )

  const { loading: loadingMasterData } = masterdataForSupplierMaster

  let autoIncrementedSupplierNo = ''
  if (masterdataForSupplierMaster !== undefined) {
    autoIncrementedSupplierNo =
      masterdataForSupplierMaster.autoIncrementedSupplierNo
  }

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    } else {
      dispatch(getAllMasterDataForSupplierMaster())
    }

    if (success) {
      //history.replace(`/suppliers/${supplier._id}/edit`)
      history.push('/supplierlist')
      dispatch({ type: SUPPLIER_CREATE_RESET })
      NotificationManager.success(
        `Supplier Record ${supplier.supplierName} has been successfully created !`,
        'Successful!',
        APPLICATION_NOTIFICATION_TIME_OUT
      )
    }
    console.log('Error in useEffect is ', error)
    if (error) {
      dispatch({ type: SUPPLIER_CREATE_RESET })
      NotificationManager.error(
        `Error in creating Supplier Master Record !`,
        'Error!',
        APPLICATION_NOTIFICATION_TIME_OUT
      )
    }
    window.scrollTo(0, 0)
    // eslint-disable-next-line
  }, [history, success])

  const handleBillAddressCopy = () => {
    setSupplierShipAddressLine1(supplierBillAddressLine1)
    setSupplierShipAddressLine2(supplierBillAddressLine2)
    setSupplierShipAddressLine3(supplierBillAddressLine3)
    setSupplierShipState(supplierBillState)
    setSupplierShipCity(supplierBillCity)
    setSupplierShipDistrict(supplierBillDistrict)
    setSupplierShipPinCode(supplierBillPinCode)
  }

  const handleClearShipAddressCopy = () => {
    setSupplierShipAddressLine1('')
    setSupplierShipAddressLine2('')
    setSupplierShipAddressLine3('')
    setSupplierShipState('')
    setSupplierShipCity('')
    setSupplierShipDistrict('')
    setSupplierShipPinCode('')
  }

  const handleReset = () => {
    setSupplierCode('')
    setSupplierName('')
    setSupplierCIN('')
    setSupplierMSMENo('')
    setSupplierURD('')
    setSupplierNickName('')
    setSupplierCompanyType('')
    setSupplierGST('')
    setSupplierPAN('')
    setSupplierBillAddressLine1('')
    setSupplierBillAddressLine2('')
    setSupplierBillAddressLine3('')
    setSupplierBillState('')
    setSupplierBillCity('')
    setSupplierBillDistrict('')
    setSupplierBillPinCode('')
    setSupplierShipAddressLine1('')
    setSupplierShipAddressLine2('')
    setSupplierShipAddressLine3('')
    setSupplierShipState('')
    setSupplierShipCity('')
    setSupplierShipDistrict('')
    setSupplierShipPinCode('')
    setSupplierContactPersonName('')
    setSupplierContactPersonDesignation('')
    setSupplierContactPersonNumber('')
    setSupplierContactPersonAltNum('')
    setSupplierTelNo('')
    setSupplierContactPersonEmail('')
    setIsSupplierActive('')
    //setCustAlsoSupplier("")
    setSupplierBefName('')
    setSupplierBankName('')
    setSupplierAccountNumber('')
    setSupplierAccType('')
    setSupplierBankIFSCCode('')
  }

  const submitHandler = (e) => {
    //console .log("INside submit handler of sccreen ----- ")
    let supplierBillingAddress = [
      {
        supplierBillAddressLine1,
        supplierBillAddressLine2,
        supplierBillAddressLine3,
        supplierBillState,
        supplierBillCity,
        supplierBillDistrict,
        supplierBillPinCode,
      },
    ]

    let supplierShipingAddress = [
      {
        supplierShipAddressLine1,
        supplierShipAddressLine2,
        supplierShipAddressLine3,
        supplierShipState,
        supplierShipCity,
        supplierShipDistrict,
        supplierShipPinCode,
      },
    ]

    e.preventDefault()
    setExecuting(true)
    dispatch(
      createSupplier({
        supplierCode: autoIncrementedSupplierNo,
        supplierName,
        supplierCIN,
        supplierMSMENo,
        supplierURD,
        supplierNickName,
        supplierCompanyType,
        supplierGST,
        supplierPAN,
        supplierBillingAddress,
        supplierShipingAddress,
        supplierContactPersonName,
        supplierContactPersonDesignation,
        supplierContactPersonNumber,
        supplierContactPersonAltNum,
        supplierContactPersonEmail,
        isSupplierActive,
        //custAlsoSupplier,
        supplierVendorCode,
        supplierBefName,
        supplierBankName,
        supplierAccountNumber,
        supplierAccType,
        supplierBankIFSCCode,
      })
    )
  }

  return (
    <FormContainer>
      <Breadcrumb listPage='supplierlist' />
      <br></br>
      <FormFieldsContainer frameTitle='Add Supplier Details !!!'>
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
                <Form.Group controlId='supplierCode'>
                  <Form.Label>Supplier Code</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={autoIncrementedSupplierNo}
                    onChange={(e) => setSupplierCode(e.target.value)}
                    readOnly
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='supplierName'>
                  <Form.Label>
                    Supplier Name (Legal Entity)
                    <span className='mandatory'>*</span>
                  </Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    required
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='supplierCode'>
                  <Form.Label>
                    Supplier Nick Name<span className='mandatory'>*</span>
                  </Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    required
                    value={supplierNickName}
                    onChange={(e) => setSupplierNickName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {/* second row start */}
            <Row>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='supplierCompanyType'>
                  <Form.Label>
                    Type of Company<span className='mandatory'>*</span>
                  </Form.Label>
                  <Form.Control
                    as='select'
                    custom
                    placeholder='Select Company Type'
                    value={supplierCompanyType}
                    onChange={(e) => setSupplierCompanyType(e.target.value)}
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
                <Form.Group controlId='supplierCIN'>
                  <Form.Label>Company Identification # (CIN)</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={supplierCIN}
                    onChange={(e) => setSupplierCIN(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='supplierMSME'>
                  <Form.Label>MSME Enterprises</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={supplierMSMENo}
                    onChange={(e) => setSupplierMSMENo(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {/* second row end */}

            {/* third row start */}
            <Row>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='supplierGST'>
                  <Form.Label>
                    Goods and Services Tax(GST)
                    <span className='mandatory'>*</span>
                  </Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    required
                    value={supplierGST}
                    onChange={(e) => setSupplierGST(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='supplierURD'>
                  <Form.Label>Unregistered Dealer(URD)</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={supplierURD}
                    onChange={(e) => setSupplierURD(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='supplierPAN'>
                  <Form.Label>
                    Permanent Account Number(PAN)
                    <span className='mandatory'>*</span>
                  </Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    required
                    value={supplierPAN}
                    onChange={(e) => setSupplierPAN(e.target.value)}
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
                    <Form.Group controlId='supplierBillAddressLine1'>
                      <Form.Label>
                        Billing Address Line 1
                        <span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={supplierBillAddressLine1}
                        onChange={(e) =>
                          setSupplierBillAddressLine1(e.target.value)
                        }
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={6} md={12} xs={12}>
                    <Form.Group controlId='supplierBillAddressLine2'>
                      <Form.Label>
                        Billing Address Line 2
                        <span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={supplierBillAddressLine2}
                        onChange={(e) =>
                          setSupplierBillAddressLine2(e.target.value)
                        }
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6} md={12} xs={12}>
                    <Form.Group controlId='supplierBillAddressLine3'>
                      <Form.Label>Billing Address Line 3</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        value={supplierBillAddressLine3}
                        onChange={(e) =>
                          setSupplierBillAddressLine3(e.target.value)
                        }
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={6} md={12} xs={12}>
                    <Form.Group controlId='supplierBillState'>
                      <Form.Label>
                        State - Place of Supply
                        <span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={supplierBillState}
                        onChange={(e) => setSupplierBillState(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={4} md={12} xs={12}>
                    <Form.Group controlId='supplierBillCity'>
                      <Form.Label>
                        City<span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={supplierBillCity}
                        onChange={(e) => setSupplierBillCity(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={12} xs={12}>
                    <Form.Group controlId='supplierBillDistrict'>
                      <Form.Label>
                        District<span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={supplierBillDistrict}
                        onChange={(e) =>
                          setSupplierBillDistrict(e.target.value)
                        }
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={12} xs={12}>
                    <Form.Group controlId='supplierBillPinCode'>
                      <Form.Label>
                        Pincode<span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={supplierBillPinCode}
                        onChange={(e) => setSupplierBillPinCode(e.target.value)}
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
                    <Form.Group controlId='supplierShipAddressLine1'>
                      <Form.Label>
                        Shipping Address Line 1
                        <span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={supplierShipAddressLine1}
                        onChange={(e) =>
                          setSupplierShipAddressLine1(e.target.value)
                        }
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={6} md={12} xs={12}>
                    <Form.Group controlId='supplierShipAddressLine2'>
                      <Form.Label>
                        Shipping Address Line 2
                        <span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={supplierShipAddressLine2}
                        onChange={(e) =>
                          setSupplierShipAddressLine2(e.target.value)
                        }
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6} md={12} xs={12}>
                    <Form.Group controlId='supplierShipAddressLine3'>
                      <Form.Label>Shipping Address Line 3</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        value={supplierShipAddressLine3}
                        onChange={(e) =>
                          setSupplierShipAddressLine3(e.target.value)
                        }
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={6} md={12} xs={12}>
                    <Form.Group controlId='supplierShipState'>
                      <Form.Label>
                        State - Place of Supply
                        <span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={supplierShipState}
                        onChange={(e) => setSupplierShipState(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={4} md={12} xs={12}>
                    <Form.Group controlId='supplierShipCity'>
                      <Form.Label>
                        City<span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        required
                        value={supplierShipCity}
                        onChange={(e) => setSupplierShipCity(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={12} xs={12}>
                    <Form.Group controlId='supplierShipDistrict'>
                      <Form.Label>
                        District<span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        value={supplierShipDistrict}
                        required
                        onChange={(e) =>
                          setSupplierShipDistrict(e.target.value)
                        }
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={12} xs={12}>
                    <Form.Group controlId='supplierShipPinCode'>
                      <Form.Label>
                        Pincode<span className='mandatory'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        placeholder=''
                        value={supplierShipPinCode}
                        required
                        onChange={(e) => setSupplierShipPinCode(e.target.value)}
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
                <Form.Group controlId='supplierContactPersonName'>
                  <Form.Label>Contact Person Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={supplierContactPersonName}
                    onChange={(e) =>
                      setSupplierContactPersonName(e.target.value)
                    }
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='supplierContactPersonDesignation'>
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={supplierContactPersonDesignation}
                    onChange={(e) =>
                      setSupplierContactPersonDesignation(e.target.value)
                    }
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='supplierContactPersonNumber'>
                  <Form.Label>Contact No(Mobile No)</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={supplierContactPersonNumber}
                    onChange={(e) =>
                      setSupplierContactPersonNumber(e.target.value)
                    }
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {/* 5th row end */}

            {/* 6th row start */}
            <Row>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='supplierContactPersonAltNum'>
                  <Form.Label>Alternate No(Whatsapp No)</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={supplierContactPersonAltNum}
                    onChange={(e) =>
                      setSupplierContactPersonAltNum(e.target.value)
                    }
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='supplierContactPersonEmail'>
                  <Form.Label>Email-ID</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={supplierContactPersonEmail}
                    onChange={(e) =>
                      setSupplierContactPersonEmail(e.target.value)
                    }
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='supplierTelNo'>
                  <Form.Label>Telephone No</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={supplierTelNo}
                    onChange={(e) => setSupplierTelNo(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {/* 6th row end */}
            <Row>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='isSupplierActive'>
                  <Form.Label>Supplier Status</Form.Label>
                  <Form.Control
                    as='select'
                    custom
                    placeholder='Select Supplier Status'
                    value={isSupplierActive}
                    onChange={(e) => setIsSupplierActive(e.target.value)}
                  >
                    <option value='A'>Active</option>
                    <option value='I'>Inactive</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              {/* <Col lg={4} md={12} xs={12}>
                        <Form.Group controlId='custAlsoSupplier'>
                           <Form.Label>Is Customer Supplier?</Form.Label>
                           <Form.Control
                              as='select'
                              custom
                              placeholder='Select Customer Status'
                              value={custAlsoSupplier}
                              onChange={(e) => setCustAlsoSupplier(e.target.value)}
                           >
                              <option value="N">No</option>
                              <option value="Y">Yes</option>
                           </Form.Control>
                        </Form.Group> 
                     </Col> */}
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='supplierVendorCode'>
                  <Form.Label>Vendor Code</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={supplierVendorCode}
                    onChange={(e) => setSupplierVendorCode(e.target.value)}
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
                <Form.Group controlId='supplierBefName'>
                  <Form.Label>Beneficiary Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={supplierBefName}
                    onChange={(e) => setSupplierBefName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='supplierBankName'>
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={supplierBankName}
                    onChange={(e) => setSupplierBankName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='supplierAccountNumber'>
                  <Form.Label>Account No</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={supplierAccountNumber}
                    onChange={(e) => setSupplierAccountNumber(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {/* 8th row end */}

            {/* 9th row start */}
            <Row>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='supplierAccType'>
                  <Form.Label>Account Type</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={supplierAccType}
                    onChange={(e) => setSupplierAccType(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg={4} md={12} xs={12}>
                <Form.Group controlId='supplierBankIFSCCode'>
                  <Form.Label>IFSC Code</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder=''
                    value={supplierBankIFSCCode}
                    onChange={(e) => setSupplierBankIFSCCode(e.target.value)}
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

export default CreateSupplierScreen
