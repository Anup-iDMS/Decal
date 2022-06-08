import React, { useEffect } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../../components/app/Message'
import Loader from '../../components/app/Loader'
import { suppliersList } from '../../actions/masters/supplierActions.js'
import SupplierTable from '../../components/tables/masters/SupplierTable.js'

const SupplierMasterList = ({ location, history, match }) => {
  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { error, user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const acl = useSelector((state) => state.allSuppliersList)
  const { loading: loadingSuppliers, suppliers } = acl
  //logger(">>>> 1. Loading suppliers ==== ",suppliers)

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    } else {
      if (!user || !user.name) {
        //logger("1. Inside Manage Leada Screen useEffect ==== ", pageNumber)
        dispatch(suppliersList(pageNumber))
      }
    }
  }, [dispatch, history, userInfo, user, pageNumber])

  return (
    <>
      <br></br>
      <div
        style={{
          border: '0px solid black',
          borderRadius: '5px',
          background: 'white',
        }}
      >
        <Row className='align-items-center mx-1'>
          <Col lg={8} md={12} xs={12}>
            <h4>Suppliers List</h4>
          </Col>
          <Col lg={4} md={12} xs={12} className='text-right'>
            <LinkContainer to={'/createsupplier'}>
              <Button variant='danger' className='btn py-2 my-2'>
                <i className='fas fa-plus'></i>Add Supplier
              </Button>
            </LinkContainer>
          </Col>
        </Row>
        <br></br>
        {loadingSuppliers ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <>
            {suppliers === undefined ? (
              <p className='text-center'>
                <b>No Records Found</b>
              </p>
            ) : (
              <SupplierTable suppliers={suppliers} />
            )}
          </>
        )}
      </div>
    </>
  )
}

export default SupplierMasterList
