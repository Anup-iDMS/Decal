import React, { useState } from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const SupplierAddressModal = (props) => {
  const companyName =
    props.supplierData !== undefined ? props.supplierData.supplierName : ''

  const billAddressLine1 =
    props.supplierData !== undefined &&
    props.supplierData.supplierBillingAddress !== undefined
      ? props.supplierData.supplierBillingAddress[0].supplierBillAddressLine1
      : ''
  const billAddressLine2 =
    props.supplierData !== undefined &&
    props.supplierData.supplierBillingAddress !== undefined
      ? props.supplierData.supplierBillingAddress[0].supplierBillAddressLine2
      : ''
  const billAddressLine3 =
    props.supplierData !== undefined &&
    props.supplierData.supplierBillingAddress !== undefined
      ? props.supplierData.supplierBillingAddress[0].supplierBillAddressLine3
      : ''

  const shipAddressLine1 =
    props.supplierData !== undefined &&
    props.supplierData.supplierShipingAddress !== undefined
      ? props.supplierData.supplierShipingAddress[0].supplierShipAddressLine1
      : ''
  const shipAddressLine2 =
    props.supplierData !== undefined &&
    props.supplierData.supplierShipingAddress !== undefined
      ? props.supplierData.supplierShipingAddress[0].supplierShipAddressLine2
      : ''
  const shipAddressLine3 =
    props.supplierData !== undefined &&
    props.supplierData.supplierShipingAddress !== undefined
      ? props.supplierData.supplierShipingAddress[0].supplierShipAddressLine3
      : ''

  const billingAddress =
    billAddressLine1 + '\n' + billAddressLine2 + '\n' + billAddressLine3
  const shippingAddress =
    shipAddressLine1 + '\n' + shipAddressLine2 + '\n' + shipAddressLine3

  //console.log("1. Inside Supplier Address Modal and Supplier IS ======= ", props.supplierData)
  //console.log("2. addressLine1 ======= ", addressLine1)
  //console.log("3. addressLine2 ======= ", addressLine2)

  const [copyBillingAddress, setCopyBillingAddress] = useState('')
  const [copyShippingAddress, setCopyShippingAddress] =
    useState(shippingAddress)
  const [copiedBilling, setCopiedBilling] = useState(false)
  const [copiedShipping, setCopiedShipping] = useState(false)

  const copyBothAddresses = () => {
    handleBillingCopy()
    handleShippingCopy()
    setCopiedBilling(false)
    setCopiedShipping(false)
  }

  const handleBillingCopy = () => {
    setCopyBillingAddress(billingAddress)
    //console.log("1~~~~~~~~~~~ Inside handle Billing Method ==== ", billingAddress)
  }

  const handleShippingCopy = () => {
    setCopyShippingAddress(shippingAddress)
    //console.log("2^^^^ Inside handle SHIPPING Method ==== ", shippingAddress)
  }

  const handleBillingAddressCopy = () => {
    setCopiedShipping(false)
    setCopiedBilling(true)
  }

  const handleShippingAddressCopy = () => {
    setCopiedBilling(false)
    setCopiedShipping(true)
  }

  return (
    <Modal
      centered
      show={props.onShow}
      onHide={props.onClose}
      onShow={copyBothAddresses}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h6>{companyName}</h6>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='text-center'>
        <Row>
          <Col>
            <Row>
              <Col>
                <h6>Billing Address</h6>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  {billAddressLine1}
                  {'\n'}
                  {billAddressLine2}
                  {'\n'}
                  {billAddressLine3}
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <CopyToClipboard
                  text={copyBillingAddress}
                  onCopy={handleBillingAddressCopy}
                >
                  <Button
                    variant='primary'
                    className='button-class btn-sm my-2'
                  >
                    Copy Billing Address
                  </Button>
                </CopyToClipboard>
              </Col>
            </Row>
            <Row>
              <Col>
                {copiedBilling ? (
                  <span style={{ color: 'red' }}>Billing Address Copied.</span>
                ) : null}
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col>
                <h6>Shipping Address</h6>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  {shipAddressLine1}
                  {'\n'}
                  {shipAddressLine2}
                  {'\n'}
                  {shipAddressLine3}
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <CopyToClipboard
                  text={copyShippingAddress}
                  onCopy={handleShippingAddressCopy}
                >
                  <Button
                    variant='primary'
                    className='button-class btn-sm my-2'
                  >
                    Copy Shipping Address
                  </Button>
                </CopyToClipboard>
              </Col>
            </Row>
            <Row>
              <Col>
                {copiedShipping ? (
                  <span style={{ color: 'red' }}>Shipping Address Copied.</span>
                ) : null}
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='primary'
          className='button-class btn-sm my-2'
          onClick={props.onClose}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SupplierAddressModal
