import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
//css for form fields
import "./css/form.css";

const FormContainer = ({ children }) => {
    return (
        <Container>
            <Row className='justify-content-md-center'>
                <Col xl={12} lg={12} md={6} xs={12}>
                    {children}
                </Col>
            </Row>
        </Container>
    )
}

export default FormContainer
