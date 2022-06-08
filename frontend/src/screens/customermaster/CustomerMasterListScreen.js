import React, { useEffect } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../../components/app/Message'
import Loader from '../../components/app/Loader'
import { customersList } from '../../actions/masters/customerActions';
import CustomerTable from '../../components/tables/masters/CustomerTable';

const CustomerMasterListScreen = ({ location, history, match }) => {
   
   const pageNumber = match.params.pageNumber || 1

   const dispatch = useDispatch()

   const userDetails = useSelector((state) => state.userDetails)
   const { error, user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const acl = useSelector((state) => state.allCustomersList)
   const { loading: loadingCustomers, customers } = acl
   //logger(">>>> 1. Loading customers ==== ",customers)

   useEffect(() => {
      if (!userInfo) {
        history.push('/login')
      } else {
        if (!user || !user.name ) {
          //logger("1. Inside Manage Leada Screen useEffect ==== ", pageNumber)
          dispatch(customersList(pageNumber))
        }
      }
    }, [dispatch, history, userInfo, user, pageNumber])

   return (
      <>
      <br></br>
      <div style={{border:"0px solid black", borderRadius:"5px", background:"white"}}>
         <Row className='align-items-center mx-1'>
            <Col lg={8} md={12} xs={12}>
               <h4 >Customers List</h4>
            </Col>
            <Col lg={4} md={12} xs={12} className="text-right">
               <LinkContainer to={'/createcustomer'}>
                  <Button variant='danger' className='btn py-2 my-2'>
                     <i className='fas fa-plus'></i>Add Customer
                  </Button>
               </LinkContainer>
            </Col>
         </Row>
         <br></br>
         {loadingCustomers ? (
            <Loader />
         ) : error ? (
            <Message variant='danger'>{error}</Message>
         ) : (
            <>
               {customers === undefined? (<p className="text-center"><b>No Records Found</b></p>) : (
                  <CustomerTable customers={customers} />
               )}
            </>
         )}
      </div>
      </> 
   )
}

export default CustomerMasterListScreen
