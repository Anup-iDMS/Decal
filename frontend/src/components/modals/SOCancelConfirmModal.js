import React, {useState} from 'react'
import { Modal, Button, Row, Col, Form } from "react-bootstrap";

const SOCancelConfirmModal = (props) => {
   const { soLineItemData } = props;
   const [ canceledReason, setCanceledReason ] = useState("");
    // 4.1 Validation Errors
    const [ errors, setErrors, salesOrders ] = useState({});

   //Form Validation
   const findFormErrors = () => {
      const newErrors = {};
      
      if ( canceledReason.trim().length === 0 ) {
         newErrors.canceledReason = 'Add Cancellation Reason!'
      }
      return newErrors;
   }

   const resetErrorMessage = (name) => {
      if ( !!errors[name] ) setErrors({
         ...errors,
         [name]: null
      })
   }
   
   
   const submitCancelReason = (canceledReason) => {
      const newErrors = findFormErrors();

      if ( Object.keys(newErrors).length > 0 ) {
         setErrors(newErrors)
         //window.scrollTo(0, 0);  
         //NotificationManager.error(`Please fill in the required details !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      } 
       else {
         resetErrorMessage("canceledReason")
         setCanceledReason("");
         props.onSubmit(canceledReason);
         props.onClose();
      }
   }

   const handleClose = () => {
      setCanceledReason("");
      props.onClose();
   }

   /** styling start */
   let tableStyle = {
      border: "1px solid black",
      width: "100%",
      height: "100%",
      fontFamily:"Arial"
   }
   /** styling end */

   return (
      <Modal centered show={props.onShow}  onHide={props.onClose}>
         <Modal.Header closeButton>
            <Modal.Title><h5>Are you sure that you want to cancel SO Line Item?</h5></Modal.Title>
         </Modal.Header>
            <Modal.Body className="text-left">
               <Row>
                  <Col><h6>SO Line Details:</h6></Col>
               </Row>
               <table style={{ ...tableStyle, width:"100%", tableLayout:"fixed" }}>
                  <tbody>
                     <tr>
                        <td  className="col-2" style={tableStyle} colSpan={1}>
                           <b>SO #</b>
                        </td>
                        <td  className="col-2" style={tableStyle} colSpan={1}>
                           <b>{soLineItemData.soNumber}</b>
                        </td>
                     </tr>
                     <tr>
                        <td  className="col-2" style={tableStyle} colSpan={1}>
                           <b>SO Date</b>
                        </td>
                        <td  className="col-1" style={tableStyle} colSpan={1}>
                           <b>{soLineItemData.soDate}</b>
                        </td>
                     </tr>
                     <tr>
                        <td  className="col-1" style={tableStyle} colSpan={1}>
                           <b>JC Description</b>
                        </td>
                        <td  className="col-2" style={tableStyle} colSpan={1}>
                           <b>{soLineItemData.jcDescription}</b>
                        </td>
                     </tr>
                     <tr>
                        <td  className="col-1" style={tableStyle} colSpan={1}>
                           <b>Balance Qty</b>
                        </td>
                        <td  className="col-2" style={tableStyle} colSpan={1}>
                           <b>{soLineItemData.balancedQty}</b>
                        </td>
                     </tr>
                     <tr>
                        <td  className="col-1" style={tableStyle} colSpan={1}>
                           <b>Cancel Qty</b>
                        </td>
                        <td  className="col-2" style={tableStyle} colSpan={1}>
                           <b>{soLineItemData.balancedQty}</b>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <br />
               {/*<h6>Please provide the cancellation reason !!</h6>*/}
               <Row>
                  <Col>
                     <Form.Label>Cancellation Reason<span className="mandatory">*</span></Form.Label>
                     <Form.Control
                        type='text'
                        name='canceledReason'
                        value={canceledReason}
                        onChange={(e) => setCanceledReason(e.target.value)}
                     ></Form.Control>
                     <p className="validation-error">{errors.canceledReason}</p>
                  </Col>
               </Row>
            </Modal.Body>
         <Modal.Footer>
            <Button variant="primary" className="reset-button-class btn-sm my-2" onClick={handleClose}>Close</Button>
            <Button variant="primary" className="button-class btn-sm my-2" onClick={()=>submitCancelReason(canceledReason)}>Submit</Button>
         </Modal.Footer>
      </Modal>
   )
}

export default SOCancelConfirmModal
