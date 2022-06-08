import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
    return (
        <footer>
            <Container>
                <Row style={{color:'red'}}>
                <Col className='text-center py-3'>Copyright &copy; Lead Management System</Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer
