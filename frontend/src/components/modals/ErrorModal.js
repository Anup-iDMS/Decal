import React from 'react'
import { Modal, Button } from "react-bootstrap";

const ErrorModal = (props) => {
   return (
      <Modal centered show={props.onShow}  onHide={props.onClose}>
         <Modal.Header closeButton>
            <Modal.Title><h6>Success!!</h6></Modal.Title>
         </Modal.Header>
            <Modal.Body className="text-center">
               <h6>{props.message} !!</h6>
            </Modal.Body>
         <Modal.Footer>
            <Button variant="primary" className="button-class btn-sm my-2" onClick={props.onClose}>Close</Button>
         </Modal.Footer>
      </Modal>
   )
}

export default ErrorModal
