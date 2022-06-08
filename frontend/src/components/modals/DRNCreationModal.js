import React  from 'react'
import { Modal, Button, Row, Col } from "react-bootstrap";

const DRNCreationModal = (props) => {

  const drnCreationNotes = [
    {id:"1", desc:"You have an \"Open Sales Order\" for the selected customer"},
    {id:"2", desc:"You have made \"Finished Goods Entry\" for the selected JC"},
    {id:"3", desc:"Note: You can \"SWITCH OFF\" the notification on 'Utility' screen"},
  ]

  return (
   <Modal centered show={props.onShow}  onHide={props.onClose}>
     <Modal.Header closeButton>
       <Modal.Title><h5><i className="fas fa-info-circle fa-2x"></i> Before Creating Dispatch Request Note</h5></Modal.Title>
     </Modal.Header>
      <Modal.Body>
        <h5>Please Make Sure</h5>
        {drnCreationNotes.map((moduleFeature) => (
          <Row key={moduleFeature.id}>
            <Col style={{paddingTop:"5px"}}><b className="appFontColor">{moduleFeature.id}.</b> {moduleFeature.desc}</Col>
          </Row>
        ))}
      </Modal.Body>
     <Modal.Footer>
       <Button variant="primary" className="button-class btn-sm my-2" onClick={props.onClose}>Close</Button>
     </Modal.Footer>
   </Modal>
 )
}

export default DRNCreationModal
