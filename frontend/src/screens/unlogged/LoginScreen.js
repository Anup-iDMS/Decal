import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../../components/form/FormContainer';
import logo from './../../assets/DTPL_Logo.jpg'

import { login } from '../../actions/masters/userActions'
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import ModuleIntroModal from '../../components/modals/ModuleIntroModal';



const LoginScreen = ({ location, history }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin)
    const { loading, error, userInfo } = userLogin

    const redirect = location.search ? location.search.split('=')[1] : '/'

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (userInfo) {
            //console.log("---- useEffect Login ----- ", userInfo)
            //history.push('/home');
            let landingPage = userInfo.menuItems.menuItems[0].link
            //console.log("---- landingPage ----- ", landingPage)
            
            history.push(landingPage);
        }
        //setTimeout(() => handleShow(), 3000);
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password))
    }

    return (
        <>
            <ModuleIntroModal onShow={show} onClose={handleClose} />
            <Container fluid>
                <Row className="mainContainer">

                    <Col className="loginContainer">
                        <Row className="contentContainer">
                            <Col lg={7} className="d-none d-md-none d-lg-block moduleContainer">
                                <Row className="appTitle my-5">
                                    <Col><h3>Integrated Digital Management System</h3></Col>
                                </Row>
                                <Row className="modules my-4">
                                    <Col lg={4} md={6} sm={12}>
                                        <Button className="myButton my-2" style={{ width: '100%' }}>ADMIN</Button>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <Button style={{ width: '100%' }} className="myButton mx-2 my-2" onClick={handleShow}>LEADERSHIP</Button>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <Button style={{ width: '100%' }} className="myButton mx-2 my-2" >SALES</Button>
                                    </Col>
                                </Row>
                                <Row className="modules my-4" >
                                    <Col lg={4} md={6} sm={12}>
                                        <Button style={{ width: '100%' }} className="myButton my-2">CRM</Button>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <Button style={{ width: '100%' }} className="myButton mx-2 my-2">PURCHASE</Button>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <Button style={{ width: '100%' }} className="myButton mx-2 my-2" >STORES</Button>
                                    </Col>
                                </Row>
                                <Row className="modules my-4">
                                    <Col lg={4} md={6} sm={12}>
                                        <Button style={{ width: '100%' }} className="myButton my-2">PRODUCTION</Button>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <Button style={{ width: '100%' }} className="myButton mx-2 my-2">QUALITY</Button>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <Button style={{ width: '100%' }} className="myButton mx-2 my-2" >HRDM</Button>
                                    </Col>
                                </Row>
                            </Col>
                           { /*<Col lg={1} className="d-none d-lg-block">
                                <div className="divider"></div>
                            </Col>*/}
                            <Col lg={4} className="loginFormContainer">
                                <FormContainer>
                                    <Row className="my-4">
                                        <Col className="text-center">
                                            <Image src={logo} className="logoWidth" fluid />
                                        </Col>
                                    </Row>
                                    <br></br><br></br>
                                    {error && <Message variant='danger'>{error}</Message>}
                                    {loading && <Loader />}
                                    <Form onSubmit={submitHandler}>
                                        <Form.Group controlId='email'>
                                            <Form.Label>User Name<span className="mandatory">*</span></Form.Label>
                                            <Form.Control
                                                required
                                                type='text'
                                                placeholder='Enter email'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            >
                                            </Form.Control>
                                        </Form.Group>

                                        <Form.Group controlId='password'>
                                            <Form.Label>Password<span className="mandatory">*</span></Form.Label>
                                            <Form.Control
                                                required
                                                type='password'
                                                placeholder='Enter password'
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            >
                                            </Form.Control>
                                        </Form.Group>

                                        <Button
                                            onClick={(e) => e.currentTarget.blur()}
                                            type='submit' 
                                            className="button-class my-2" 
                                            variant='primary'>Sign In</Button>
                                    </Form>
                                    <Row className='py-3'>
                                        <Col>
                                            Forgot Password?{' '}
                                            <Link className="appSecondaryColor" to='#'>Click here</Link>
                                        </Col>
                                    </Row>
                                </FormContainer>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Container>
                        <Row>
                            <Col lg={8} className="my-auto d-none d-lg-block" >
                                <p className="footerColor my-2"><a href="www.decaltech.in" target="_blank">Decal Tech Private Limited</a> | All Rights Reserved 2021</p>
                            </Col>
                            <Col lg={4} className="my-auto" >
                                <p className="footerColor my-2">Developed by <a href="www.idmsinfotech.com" target="_blank">IDMS Infotech Private Limited</a></p>
                            </Col>
                        </Row>
                    </Container>

                </Row>
            </Container>
        </>
    )
}

export default LoginScreen
