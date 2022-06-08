import React, { useState, useEffect } from 'react'
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Tabs,
  Tab,
  Card,
} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../../components/form/FormContainer'
import FormFieldsContainer from '../../components/form/FormFieldsContainer'

import {
  getSupplierDetails,
  updateSupplier,
} from '../../actions/masters/supplierActions.js'
import Breadcrumb from '../../components/app/Breadcrumb'
import { SUPPLIER_UPDATE_RESET } from '../../constants/masters/supplierConstants.js'
import { NotificationManager } from 'react-notifications'
import { APPLICATION_NOTIFICATION_TIME_OUT } from '../../constants/application/application'
import { logger } from '../../util/ConsoleHelper'
import { v4 as uuidv4 } from 'uuid'

const EditSupplierScreen = ({ match, history }) => {
  const supplierId = match.params.id

  const [supplierCode, setSupplierCode] = useState('')
  const [supplierName, setSupplierName] = useState('')
  const [supplierCIN, setSupplierCIN] = useState('')
  const [supplierMSMENo, setSupplierMSMENo] = useState('')
  const [supplierURD, setSupplierURD] = useState('')
  const [supplierNickName, setSupplierNickName] = useState('')
  const [supplierCompanyType, setSupplierCompanyType] = useState('')
  const [supplierGST, setSupplierGST] = useState('')
  const [supplierPAN, setSupplierPAN] = useState('')
  const [supplierBillingAddress, setSupplierBillingAddress] = useState('')
  const [supplierShipingAddress, setSupplierShippingAddress] = useState({})

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

  const [addressButtonName, setAddressButtonName] = useState('Add Address')
  const [addressId, setAddressId] = useState('')
  const [addressType, setAddressType] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [addressLine3, setAddressLine3] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [pinCode, setPinCode] = useState('')
  const [contactPersonName, setContactPersonName] = useState('')
  const [contactPersonNumber, setContactPersonNumber] = useState('')

  const [supplierAddress, setSupplierAddress] = useState([
    {
      id: uuidv4(),
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      state: '',
      city: '',
      district: '',
      pinCode: '',
      contactPersonName: '',
      contactPersonNumber: '',
    },
  ])

  const [newAddress, setNewAddress] = useState({
    addressType: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    state: '',
    city: '',
    district: '',
    pinCode: '',
    contactPersonName: '',
    contactPersonNumber: '',
  })

  const [supplierContactPersonName, setSupplierContactPersonName] = useState('')
  const [
    supplierContactPersonDesignation,
    setSupplierContactPersonDesignation,
  ] = useState('')
  const [supplierContactPersonNumber, setSupplierContactPersonNumber] =
    useState('')
  const [supplierContactPersonAltNum, setSupplierContactPersonAltNum] =
    useState('')
  const [supplierContactPersonEmail, setSupplierContactPersonEmail] =
    useState('')
  const [isSupplierActive, setIsSupplierActive] = useState('A')
  //const [ custAlsoSupplier, setCustAlsoSupplier ] = useState('No');
  //const [supplierContactPersonName, setSupplierContactPersonName] = useState('')
  const [supplierVendorCode, setSupplierVendorCode] = useState('')

  const [supplierTelephoneNumber, setSupplierTelephoneNumber] = useState('')
  const [supplierBefName, setSupplierBefName] = useState('')
  const [supplierBankName, setSupplierBankName] = useState('')
  const [supplierAccountNumber, setSupplierAccountNumber] = useState('')
  const [supplierAccType, setSupplierAccType] = useState('')
  const [supplierBankIFSCCode, setSupplierBankIFSCCode] = useState('')
  // 2.1 Validation Errors
  const [errors, setErrors] = useState({})
  //Tab Active Key
  const [activeTabKey, setActiveTabKey] = useState('home')

  const dispatch = useDispatch()

  const supplierDetails = useSelector((state) => state.supplierDetails)
  const { supplier } = supplierDetails
  //console .log("1. Inside EDIT SUPPLIER SCREEN ==== and supplier details are ", supplier)

  //post updated Job Card Record
  const supplierUpdate = useSelector((state) => state.supplierUpdate)
  const { success: successUpdate, error: errorUpdate } = supplierUpdate

  const handleReset = () => {
    window.location.reload()
  }

  const handleForwardActiveTabKey = (e, key) => {
    e.preventDefault()
    e.currentTarget.blur()
    setActiveTabKey(key)
  }

  const handleBackwardActiveTabKey = (e, key) => {
    e.preventDefault()
    e.currentTarget.blur()
    setActiveTabKey(key)
  }

  const handleAddUpdateAddress = (e, btnName) => {
    e.preventDefault()
    e.currentTarget.blur()
    console.log(
      '===== inside handleAddUpdateAddress and index is ==== ',
      btnName
    )
    if (btnName === 'Add Address') {
      let i = {}
      i.id = uuidv4()
      i.addressType = addressType
      i.addressLine1 = addressLine1
      i.addressLine2 = addressLine2
      i.addressLine3 = addressLine3
      i.state = state
      i.city = city
      i.district = district
      i.pinCode = pinCode
      i.contactPersonName = contactPersonName
      i.contactPersonNumber = contactPersonNumber
      console.log('===== New Address is ==== ', i)
      setSupplierAddress([...supplierAddress, i])
      NotificationManager.warning(
        `Address details added. Please don't forget to save the changes !`,
        'Warning!',
        APPLICATION_NOTIFICATION_TIME_OUT
      )
    } else {
      const newInputFields = supplierAddress.map((i) => {
        if (addressId === i.id) {
          console.log('===== Matched Address is ==== ', i)
          i.addressType = addressType
          i.addressLine1 = addressLine1
          i.addressLine2 = addressLine2
          i.addressLine3 = addressLine3
          i.state = state
          i.city = city
          i.district = district
          i.pinCode = pinCode
          i.contactPersonName = contactPersonName
          i.contactPersonNumber = contactPersonNumber
        }
        return i
      })
      setSupplierAddress(newInputFields)
      NotificationManager.warning(
        `Address details updated. Please don't forget to save the changes !`,
        'Warning!',
        APPLICATION_NOTIFICATION_TIME_OUT
      )
    }
    clearAddressFields()
  }

  const clearAddress = (e) => {
    e.currentTarget.blur()
    clearAddressFields()
  }

  const clearAddressFields = () => {
    setAddressButtonName('Add Address')
    setAddressType('')
    setAddressLine1('')
    setAddressLine2('')
    setAddressLine3('')
    setState('')
    setCity('')
    setDistrict('')
    setPinCode('')
    setContactPersonName('')
    setContactPersonNumber('')
    setAddressId('')
  }

  const handleEditAddress = (e, index, id) => {
    e.preventDefault()
    e.currentTarget.blur()
    console.log('Index is ', index)
    console.log('And Index ID is ', id)
    const srs = [...supplierAddress]
    const naam = srs[index]
    setAddressButtonName('Update Address')
    setAddressId(naam.id)
    setAddressType(naam.addressType)
    setAddressLine1(naam.addressLine1)
    setAddressLine2(naam.addressLine2)
    setAddressLine3(naam.addressLine3)
    setState(naam.state)
    setCity(naam.city)
    setDistrict(naam.district)
    setPinCode(naam.pinCode)
    setContactPersonName(
      naam.contactPersonName === undefined
        ? supplierContactPersonName
        : naam.contactPersonName
    )
    setContactPersonNumber(
      naam.contactPersonNumber === undefined
        ? supplierContactPersonNumber
        : naam.contactPersonNumber
    )
  }

  // 4. Validate the "FORM" before submit
  const findFormErrors = () => {
    const newErrors = {}
    if (supplierName === '') {
      newErrors.supplierName = 'Enter a Supplier Name!'
    }

    return newErrors
  }

  // 5.2 Submit The Form
  const submitHandler = (e) => {
    e.preventDefault()
    const newErrors = findFormErrors()
    logger('--------------in submit -----------------')
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      window.scrollTo(0, 0)
    } else {
      logger('--------------in else submit -----------------')
      dispatch(
        updateSupplier({
          _id: supplierId,
          supplierCode,
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
          supplierAddress,
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
  }

  useEffect(() => {
    console.log('Supplier Name =====', supplierName)
    if (!supplier.supplierName || supplier._id !== supplierId) {
      //logger("1. use effect IF condition ....")
      dispatch(getSupplierDetails(supplierId))
    } else {
      setSupplierCode(supplier.supplierCode)
      setSupplierName(supplier.supplierName)
      setSupplierNickName(supplier.supplierNickName)
      setSupplierCompanyType(supplier.supplierCompanyType)
      setSupplierCIN(supplier.supplierCIN)
      setSupplierMSMENo(supplier.supplierMSMENo)
      setSupplierURD(supplier.supplierURD)
      setSupplierGST(supplier.supplierGST)
      setSupplierPAN(supplier.supplierPAN)
      setSupplierBillingAddress(supplier.supplierBillingAddress)
      setSupplierBillAddressLine1(
        supplier.supplierBillingAddress[0].supplierBillAddressLine1
      )
      setSupplierBillAddressLine2(
        supplier.supplierBillingAddress[0].supplierBillAddressLine2
      )
      setSupplierBillAddressLine3(
        supplier.supplierBillingAddress[0].supplierBillAddressLine3
      )
      setSupplierBillState(supplier.supplierBillingAddress[0].supplierBillState)
      setSupplierBillCity(supplier.supplierBillingAddress[0].supplierBillCity)
      setSupplierBillDistrict(
        supplier.supplierBillingAddress[0].supplierBillDistrict
      )
      setSupplierBillPinCode(
        supplier.supplierBillingAddress[0].supplierBillPinCode
      )

      setSupplierShippingAddress(supplier.supplierShipingAddress)
      setSupplierShipAddressLine1(
        supplier.supplierShipingAddress[0].supplierShipAddressLine1
      )
      setSupplierShipAddressLine2(
        supplier.supplierShipingAddress[0].supplierShipAddressLine2
      )
      setSupplierShipAddressLine3(
        supplier.supplierShipingAddress[0].supplierShipAddressLine3
      )
      setSupplierShipState(supplier.supplierShipingAddress[0].supplierShipState)
      setSupplierShipCity(supplier.supplierShipingAddress[0].supplierShipCity)
      setSupplierShipDistrict(
        supplier.supplierShipingAddress[0].supplierShipDistrict
      )
      setSupplierShipPinCode(
        supplier.supplierShipingAddress[0].supplierShipPinCode
      )

      setSupplierContactPersonName(supplier.supplierContactPersonName)
      setSupplierContactPersonDesignation(
        supplier.supplierContactPersonDesignation
      )
      setSupplierContactPersonNumber(supplier.supplierContactPersonNumber)
      setSupplierContactPersonAltNum(supplier.supplierContactPersonAltNum)
      setSupplierContactPersonEmail(supplier.supplierContactPersonEmail)
      setIsSupplierActive(
        supplier.isSupplierActive === 'A' ? 'Active' : 'Inactive'
      )
      //setCustAlsoSupplier(!supplier.custAlsoSupplier?"No":"Yes");

      setSupplierVendorCode(supplier.supplierVendorCode)

      setSupplierBefName(supplier.supplierBefName)
      setSupplierBankName(supplier.supplierBankName)
      setSupplierAccountNumber(supplier.supplierAccountNumber)
      setSupplierAccType(supplier.supplierAccType)
      setSupplierBankIFSCCode(supplier.supplierBankIFSCCode)

      let newSupplierAddress = [...supplier.supplierAddress]
      let newSupplierAddress1 = newSupplierAddress.map((ca) => {
        ca.id = uuidv4()
        ca.addressLine1 = ca.addressLine1
        ca.addressLine2 = ca.addressLine2
        ca.addressLine3 = ca.addressLine3
        ca.state = ca.state
        ca.city = ca.city
        ca.district = ca.district
        ca.pinCode = ca.pinCode

        return ca
      })
      //logger("--------> before setting data <----------- ", newSODetails1)
      setSupplierAddress(newSupplierAddress1)
    }

    if (successUpdate) {
      history.push('/supplierlist')
      dispatch({ type: SUPPLIER_UPDATE_RESET })
      NotificationManager.success(
        `Supplier ${supplier.supplierName} has been successfully updated !`,
        'Successful!',
        APPLICATION_NOTIFICATION_TIME_OUT
      )
    }
    if (errorUpdate) {
      NotificationManager.error(
        `Error in updating Supplier # ${supplier.supplierNo} !`,
        'Error!',
        APPLICATION_NOTIFICATION_TIME_OUT
      )
      dispatch({ type: SUPPLIER_UPDATE_RESET })
    }
  }, [dispatch, history, supplierId, supplier, successUpdate])

  const handleTabSelect = (e) => {
    //e.preventDefault();
    setActiveTabKey(e)
  }

  return (
    <>
      <FormContainer>
        <Breadcrumb listPage='supplierlist' />
        <br></br>
        <FormFieldsContainer frameTitle='Please Edit Supplier Details !!!'>
          <Form onSubmit={submitHandler}>
            <Col>
              <Tabs
                activeKey={activeTabKey}
                id='supplier'
                className='mb-3'
                onSelect={(e) => handleTabSelect(e)}
              >
                <Tab eventKey='home' title='Supplier Details'>
                  <Row>
                    <Col lg={4} md={12} xs={12}>
                      <Form.Group controlId='supplierCode'>
                        <Form.Label>Supplier Code</Form.Label>
                        <Form.Control
                          className='disabled'
                          type='text'
                          placeholder=''
                          value={supplierCode}
                          onChange={(e) => setSupplierCode(e.target.value)}
                          readOnly
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col lg={4} md={12} xs={12}>
                      <Form.Group controlId='supplierName'>
                        <Form.Label>Supplier Name (Legal Entity)</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder=''
                          value={supplierName}
                          onChange={(e) => setSupplierName(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col lg={4} md={12} xs={12}>
                      <Form.Group controlId='supplierNickName'>
                        <Form.Label>Supplier Nick Name</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder=''
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
                        <Form.Label>Type of Company</Form.Label>
                        <Form.Control
                          as='select'
                          custom
                          placeholder='Select Company Type'
                          value={supplierCompanyType}
                          onChange={(e) =>
                            setSupplierCompanyType(e.target.value)
                          }
                        >
                          <option value='PVT LTD'>PVT LTD</option>
                          <option value='OPC'>OPC</option>
                          <option value='Partnership Firm'>
                            Partnership Firm
                          </option>
                          <option value='LLP'>LLP</option>
                          <option value='Proprietor'>Proprietor</option>
                          <option value='LTD'>LTD</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col lg={4} md={12} xs={12}>
                      <Form.Group controlId='supplierCIN'>
                        <Form.Label>
                          Company Identification Number(CIN)
                        </Form.Label>
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
                        <Form.Label>Goods and Services Tax(GST)</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder=''
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
                        <Form.Label>Permanent Account Number(PAN)</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder=''
                          value={supplierPAN}
                          onChange={(e) => setSupplierPAN(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
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
                                        <option value="No">No</option>
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
                          onChange={(e) =>
                            setSupplierVendorCode(e.target.value)
                          }
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  {/* third row end */}
                  <Row>
                    <Col style={{ textAlign: 'end' }}>
                      <Button
                        type='button'
                        className='reset-button-class mx-3 my-3 btn-md'
                        onClick={(e) => handleForwardActiveTabKey(e, 'address')}
                      >
                        Next <i className='fas fa-forward'></i>
                      </Button>
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey='address' title='Supplier Address'>
                  <Row style={{ marginLeft: '0px', marginRight: '0px' }}>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      style={{ paddingLeft: '0px', paddingRight: '0px' }}
                    >
                      <div className='address-cards'>
                        {supplierAddress.map((inputField, index) => (
                          <div>
                            <Card
                              key={index}
                              style={{
                                paddingLeft: '10px',
                                paddingRight: '0px',
                              }}
                            >
                              <Card.Header style={{ fontWeight: 'bold' }}>
                                {inputField.addressType}
                              </Card.Header>
                              <Card.Body
                                style={{
                                  paddingLeft: '10px',
                                  paddingRight: '0px',
                                }}
                              >
                                <Card.Text style={{ fontSize: '12px' }}>
                                  <b style={{ color: 'red' }}>
                                    Address Line 1:
                                  </b>{' '}
                                  {inputField.addressLine1}
                                  <br />
                                  <b style={{ color: 'red' }}>
                                    Address Line 2:
                                  </b>{' '}
                                  {inputField.addressLine2}
                                  <br />
                                  <b style={{ color: 'red' }}>
                                    Address Line 3:
                                  </b>{' '}
                                  {inputField.addressLine3}
                                  <br />
                                  <b style={{ color: 'red' }}>State:</b>{' '}
                                  {inputField.state}
                                  <br />
                                  <b style={{ color: 'red' }}>City:</b>{' '}
                                  {inputField.city}
                                  <br />
                                  <b style={{ color: 'red' }}>District:</b>{' '}
                                  {inputField.district}
                                  <br />
                                  <b style={{ color: 'red' }}>Pincode:</b>{' '}
                                  {inputField.pinCode}
                                  <br />
                                  <b style={{ color: 'red' }}>
                                    Contact Person:
                                  </b>{' '}
                                  {inputField.contactPersonName === undefined
                                    ? supplierContactPersonName
                                    : inputField.contactPersonName}
                                  <br />
                                  <b style={{ color: 'red' }}>
                                    Contact Number:
                                  </b>{' '}
                                  {inputField.contactPersonNumber === undefined
                                    ? supplierContactPersonNumber
                                    : inputField.contactPersonNumber}
                                  <br />
                                  <Button
                                    className='my-3 btn-sm'
                                    onClick={(e) =>
                                      handleEditAddress(e, index, inputField.id)
                                    }
                                  >
                                    Edit
                                  </Button>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                            <br></br>
                          </div>
                        ))}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} md={12} xs={12}>
                      <Row>
                        <h6 className='px-3 py-2'>Add/Edit Supplier Address</h6>
                      </Row>
                      <Row>
                        <Col lg={3} md={12} xs={12}>
                          <Form.Group controlId='addressType'>
                            <Form.Label>
                              Address Type<span className='mandatory'>*</span>
                            </Form.Label>
                            <Form.Control
                              as='select'
                              custom
                              name='addressType'
                              placeholder='Select'
                              value={addressType}
                              onChange={(e) => setAddressType(e.target.value)}
                            >
                              <option value='Billing'>Billing</option>
                              <option value='Shipping'>Shipping</option>
                            </Form.Control>
                            <p className='validation-error'>{errors.role}</p>
                          </Form.Group>
                        </Col>
                        <Col lg={3} md={12} xs={12}>
                          <Form.Group controlId='addressLine1'>
                            <Form.Label>Address Line 1</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder=''
                              value={addressLine1}
                              onChange={(e) => setAddressLine1(e.target.value)}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col lg={3} md={12} xs={12}>
                          <Form.Group controlId='addressLine2'>
                            <Form.Label>Address Line 2</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder=''
                              value={addressLine2}
                              onChange={(e) => setAddressLine2(e.target.value)}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col lg={3} md={12} xs={12}>
                          <Form.Group controlId='addressLine3'>
                            <Form.Label>Address Line 3</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder=''
                              value={addressLine3}
                              onChange={(e) => setAddressLine3(e.target.value)}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={3} md={12} xs={12}>
                          <Form.Group controlId='state'>
                            <Form.Label>State - Place of Supply</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder=''
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col lg={3} md={12} xs={12}>
                          <Form.Group controlId='city'>
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder=''
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col lg={3} md={12} xs={12}>
                          <Form.Group controlId='district'>
                            <Form.Label>District</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder=''
                              value={district}
                              onChange={(e) => setDistrict(e.target.value)}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col lg={3} md={12} xs={12}>
                          <Form.Group controlId='pinCode'>
                            <Form.Label>Pincode</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder=''
                              value={pinCode}
                              onChange={(e) => setPinCode(e.target.value)}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={3} md={12} xs={12}>
                          <Form.Group controlId='contactPersonName'>
                            <Form.Label>Contact Person</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder=''
                              value={contactPersonName}
                              onChange={(e) =>
                                setContactPersonName(e.target.value)
                              }
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col lg={3} md={12} xs={12}>
                          <Form.Group controlId='supplierContactPersonNumber'>
                            <Form.Label>Contact Person Number</Form.Label>
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
                        <Col
                          lg={6}
                          md={12}
                          xs={12}
                          style={{ textAlign: 'end', marginTop: '10px' }}
                        >
                          <Button
                            type='button'
                            className='reset-button-class my-3 btn-md'
                            onClick={(e) => clearAddress(e)}
                          >
                            Clear
                          </Button>
                          <Button
                            type='button'
                            className='button-class mx-3 my-3 btn-md'
                            onClick={(e) =>
                              handleAddUpdateAddress(e, addressButtonName)
                            }
                          >
                            {addressButtonName}
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col style={{ textAlign: 'end' }}>
                      <Button
                        type='button'
                        className='reset-button-class mx-3 my-3 btn-md'
                        onClick={(e) => handleBackwardActiveTabKey(e, 'home')}
                      >
                        Back <i className='fas fa-backward'></i>
                      </Button>
                      <Button
                        type='button'
                        className='reset-button-class mx-3 my-3 btn-md'
                        onClick={(e) => handleForwardActiveTabKey(e, 'contact')}
                      >
                        Next <i className='fas fa-forward'></i>
                      </Button>
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey='contact' title='Contact'>
                  {/* 5th row start */}
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
                      <Form.Group controlId='supplierTelephoneNumber'>
                        <Form.Label>Telephone No</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder=''
                          value={supplierTelephoneNumber}
                          onChange={(e) =>
                            setSupplierTelephoneNumber(e.target.value)
                          }
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  {/* 6th row end */}
                  <Row>
                    <Col style={{ textAlign: 'end' }}>
                      <Button
                        type='button'
                        className='reset-button-class mx-3 my-3 btn-md'
                        onClick={(e) =>
                          handleBackwardActiveTabKey(e, 'address')
                        }
                      >
                        Back <i className='fas fa-backward'></i>
                      </Button>
                      <Button
                        type='button'
                        className='reset-button-class mx-3 my-3 btn-md'
                        onClick={(e) => handleForwardActiveTabKey(e, 'bank')}
                      >
                        Next <i className='fas fa-forward'></i>
                      </Button>
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey='bank' title='Bank Details'>
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
                          onChange={(e) =>
                            setSupplierAccountNumber(e.target.value)
                          }
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
                          onChange={(e) =>
                            setSupplierBankIFSCCode(e.target.value)
                          }
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  {/* 9th row end */}
                  {/* 10th row start */}
                  <Row>
                    <Col style={{ textAlign: 'end' }}>
                      <Button
                        type='button'
                        className='reset-button-class mx-3 my-3 btn-md'
                        onClick={(e) =>
                          handleBackwardActiveTabKey(e, 'contact')
                        }
                      >
                        Back <i className='fas fa-backward'></i>
                      </Button>
                      <Button
                        type='reset'
                        className='reset-button-class mx-3 my-3 btn-md'
                        onClick={handleReset}
                      >
                        <i className='fas fa-undo'></i> Reset
                      </Button>
                      <Button
                        type='submit'
                        onClick={(e) => e.currentTarget.blur()}
                        className=' my-3 btn-md button-class'
                      >
                        <i className='fas fa-save'></i> Save
                      </Button>
                    </Col>
                  </Row>
                  {/* 10th row end */}
                </Tab>
              </Tabs>
            </Col>
          </Form>
        </FormFieldsContainer>
      </FormContainer>
    </>
  )
}

export default EditSupplierScreen
