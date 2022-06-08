import React  from 'react'
import { Modal, Button, Row, Col } from "react-bootstrap";

const ModuleIntroModal = (props) => {

  const moduleFeatures = [
    {id:"1", desc:"A Strategic Approach to Manage Defects and Deviations for Continuous Improvement"},
    {id:"2", desc:"Identify the Quality Issues"},
    {id:"3", desc:"Document/Report the Issue"},
    {id:"4", desc:"Evaluate/Review the Issue"},
    {id:"5", desc:"Segregate the Nonconforming Material"},
    {id:"5", desc:" Investigate the Nonconforming Material for CAPA"},
  ]

  return (
   <Modal centered show={props.onShow}  onHide={props.onClose}>
     <Modal.Header closeButton>
       <Modal.Title><h5>Nonconformance Management</h5></Modal.Title>
     </Modal.Header>
      <Modal.Body>
        <h6>Module Features</h6>
        {moduleFeatures.map((moduleFeature) => (
          <Row key={moduleFeature.id}>
            <Col><b className="appFontColor">{moduleFeature.id}. </b>{moduleFeature.desc}</Col>
          </Row>
        ))}
      </Modal.Body>
     <Modal.Footer>
       <Button variant="primary" className="button-class btn-sm my-2" onClick={props.onClose}>Close</Button>
     </Modal.Footer>
   </Modal>
 )
}

export default ModuleIntroModal
