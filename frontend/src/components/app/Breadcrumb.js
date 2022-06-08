import React from 'react'
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Breadcrumb = ({listPage}) => {
   const urlNav = "/"+listPage

   return (
      <Row>
         <Col>
            <Link to= {urlNav}>
               <Button
                  className='btn-md reset-button-class'
                  variant="primary" 
               >
                  <i className="fas fa-backward"></i> Go Back
               </Button>
            </Link>
         </Col>
      </Row>
   )
}

export default Breadcrumb
