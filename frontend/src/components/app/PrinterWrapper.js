import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { Form, Button, Row, Col } from 'react-bootstrap'

export default function PrinterWrapper({ children }) {
   //const pageStyle = `{ size: 2.5in 4in }`;
   //const pageStyle = "@page { size: 2.5in 4in }";
   const linkToPrint = () => {
        return (
            <Row>
               <Col style={{textAlign:"end"}}>
                  <Button type='button' className='mx-3 my-3 btn-md'>
                     <i className="fas fa-print"></i> Print
                  </Button>
               </Col>
            </Row>
        )
    }
    const componentRef = useRef();
    return (
        <React.Fragment>
            <ReactToPrint 
                trigger={linkToPrint} 
                content={() => componentRef.current} 
               /*pageStyle={pageStyle}*/
            />
            <div ref={componentRef}>
                {children}
            </div>
        </React.Fragment>
    );
}