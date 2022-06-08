import React  from 'react'
import { Form, Modal, Button, Row, Col } from "react-bootstrap";

const JCProdLayoutModal = (props) => {
   const { jcData } = props;
   console .log("Inside JC Master prod layout modal and data is ", jcData)
   return (

      <Modal centered show={props.onShow}  onHide={props.onClose} >
         <Modal.Header closeButton>
            <Modal.Title><h6>Production Layout Details</h6></Modal.Title>
         </Modal.Header>
         <Modal.Body className="text-center">
           <Row>
            <Col style={{textAlign:"left", fontWeight:"bold"}}>
               <Form.Label>JC #</Form.Label>
               <Form.Control
                  className="disabled"
                  type='text'
                  value={jcData.jcno}
                  readOnly
               ></Form.Control>
            </Col>
           </Row>
           <br></br>
           <Row>
            <Col style={{textAlign:"left", fontWeight:"bold"}}>
               <Form.Label>JC Description</Form.Label>
               <Form.Control
                  className="disabled"
                  type='text'
                  value={jcData.jcDescription}
                  readOnly
               ></Form.Control>
            </Col>
           </Row>
           <br></br>
           <Row>
               <Col style={{textAlign:"left", fontWeight:"bold"}}>
                  <Form.Label>PL Dimensions</Form.Label>
                  <Form.Control
                     className="disabled"
                     type='text'
                     value={jcData.prodLayoutUOM}
                     readOnly
                  ></Form.Control>
               </Col>
            </Row>
            <br></br>
            <Row>
            <Col style={{textAlign:"left", fontWeight:"bold"}}>
               <Form.Label>PL Width</Form.Label>
               <Form.Control
                  className="disabled"
                  type='text'
                  value={jcData.prodLayoutWidth}
                  readOnly
               ></Form.Control>
            </Col>
               <Col style={{textAlign:"left", fontWeight:"bold"}}>
               <Form.Label>PL Height</Form.Label>
               <Form.Control
                  className="disabled"
                  type='text'
                  value={jcData.prodLayoutHeight}
                  readOnly
               ></Form.Control>
            </Col>
            <Col style={{textAlign:"left", fontWeight:"bold"}}>
               <Form.Label>PL Area</Form.Label>
               <Form.Control
                  className="disabled"
                  type='text'
                  value={jcData.prodLayoutArea+" sq."+jcData.prodLayoutUOM}
                  readOnly
               ></Form.Control>
            </Col>
           </Row>
           <br></br>
            <Row>
            <Col style={{textAlign:"left", fontWeight:"bold"}}>
               <Form.Label>PL Width Ups</Form.Label>
               <Form.Control
                  className="disabled"
                  type='text'
                  value={jcData.prodLayoutWidthUps}
                  readOnly
               ></Form.Control>
            </Col>
               <Col style={{textAlign:"left", fontWeight:"bold"}}>
               <Form.Label>PL Height Ups</Form.Label>
               <Form.Control
                  className="disabled"
                  type='text'
                  value={jcData.prodLayoutHeightUps}
                  readOnly
               ></Form.Control>
            </Col>
            <Col style={{textAlign:"left", fontWeight:"bold"}}>
               <Form.Label>PL Total Ups</Form.Label>
               <Form.Control
                  className="disabled"
                  type='text'
                  value={jcData.prodLayoutTotalUps}
                  readOnly
               ></Form.Control>
            </Col>
           </Row>
         </Modal.Body>
         <Modal.Footer>
            <Button variant="primary" className="button-class btn-sm my-2" onClick={props.onClose}>Close</Button>
         </Modal.Footer>
      </Modal>
   )
}

export default JCProdLayoutModal
