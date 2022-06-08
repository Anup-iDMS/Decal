import React from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

//import Custom Application Components
import Message from '../../components/app/Message'
import Loader from '../../components/app/Loader'


const TableContainer = ({ title, listPage, children, actionName, loading, error, data, TableName, showActionButton=true, onDelete, submitCancelSO }) => {
   
   const urlNav = "/"+listPage

   return (
      <div style={{ border:"0px solid black", borderRadius:"5px", background:"white" }}>
         <Row className='align-items-center mx-1'  >
            <Col lg={8} md={12} xs={12}>
               <h4 ><i className="fas fa-list"></i> {title}</h4>
            </Col>
            <Col lg={4} md={12} xs={12} className="text-right" style={{ display: (!showActionButton ? 'none' : null) }}>
               <LinkContainer to={urlNav}>
                  <Button variant='danger' className='btn-md py-2 my-2'>
                     <i className='fas fa-folder-plus'></i> { actionName }
                  </Button>
               </LinkContainer>
            </Col>
         </Row>
         <br></br>
            {loading ? (
               <Loader />
            ) : error ? (
               <Message variant='danger'>{error}</Message>
            ) : (
               <>
                  {data === undefined? (<h5 className="text-center"><b>No Records Found</b></h5>) : (
                     <TableName data={data} onDelete={onDelete} submitCancelSO={submitCancelSO} />
                  )}
                  
               </>
            )}
      </div>
   )
}

export default TableContainer
