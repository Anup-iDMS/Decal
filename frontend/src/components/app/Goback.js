import React from 'react'
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Goback = ({history}) => {

   return (
      <Row>
         <Col style={{marginBottom:"10px"}}>
               <Button
                  className='btn-md reset-button-class'
                  variant="primary"
                  onClick={() => history.goBack()} 
               >
                  <i className="fas fa-backward"></i> Go Back
               </Button>
         </Col>
      </Row>
   )
}

export default Goback
