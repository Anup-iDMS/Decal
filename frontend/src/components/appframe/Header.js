import React from 'react'
import { Navbar, Nav, Container, NavDropdown, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'


const Header = () => {
    const userInfo = "Welcome";
    
    return (
        <header>
        {userInfo ? (
        <div style={{backgroundColor: '', color:'white'}}>
            <Container>
                <Row style={{textAlign:'center'}}>
                    <Col>
                        <h5 className="my-2" style={{color:'#0047AB'}}>{ userInfo.companyName }</h5>
                    </Col>
                </Row>
            </Container>
        </div>):null}
            <Navbar bg="dark" variant="dark" expand='lg' collapseOnSelect>
                
                <LinkContainer to='/'>
                    <Navbar.Brand>
                        <span className="title-color"><i className="fas fa-funnel-dollar"></i> LEAD EDGE - Lead Management System</span> 
                    </Navbar.Brand>
                </LinkContainer>
               
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='ml-auto'>
                    {userInfo ? (userInfo.isSuperAdmin ? (
                        <>
                                <LinkContainer to="/admindashboard">
                                    <Nav.Link><i className="fas fa-tachometer-alt"></i> Dashboard</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/createlead">
                                    <Nav.Link><i className="fas fa-plus-circle"></i> Create Lead</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/managelead">
                                    <Nav.Link><i className="fas fa-list"></i> Manage Lead</Nav.Link>
                                </LinkContainer>
                                <NavDropdown title="Reports" id='reports'>
                                    <LinkContainer to='/leads'>
                                        <NavDropdown.Item><i className="fas fa-table"></i> Leads</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/leadsdata'>
                                        <NavDropdown.Item><i className="fas fa-calendar-alt"></i> Leads Data</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                                
                                <NavDropdown title="Admin" id='reports'>
                                    <LinkContainer to='/managecompanies'>
                                        <NavDropdown.Item><i className="fas fa-building"></i> Manage Companies</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/manageusers'>
                                        <NavDropdown.Item><i className="fas fa-users"></i> Manager Users</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>

                                <NavDropdown title={ userInfo.name } id='username'>
                                    <LinkContainer to='#'>
                                        <NavDropdown.Item><i className="fas fa-user"></i> Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item ><i className="fas fa-sign-out-alt"></i> 
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ):(
                            <>
                                <LinkContainer to="/dashboard">
                                    <Nav.Link><i className="fas fa-tachometer-alt"></i> Dashboard</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/createlead">
                                    <Nav.Link><i className="fas fa-plus-circle"></i> Create Lead</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/managelead">
                                    <Nav.Link><i className="fas fa-list"></i> Manage Lead</Nav.Link>
                                </LinkContainer>
                                <NavDropdown title="Reports" id='reports'>
                                    <LinkContainer to='/leads'>
                                        <NavDropdown.Item><i class="fas fa-table"></i> Leads</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/leadsdata'>
                                        <NavDropdown.Item><i class="fas fa-calendar-alt"></i> Leads Data</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                                <NavDropdown title={ userInfo.name } id='username'>
                                    <LinkContainer to='#'>
                                        <NavDropdown.Item><i className="fas fa-user"></i> Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item ><i className="fas fa-sign-out-alt"></i> 
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                            )
                        ) : (<>
                        <LinkContainer to='/login'>
                        <Nav.Link>
                            <i className='fas fa-user'></i> Sign In
                        </Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/about'>
                            <Nav.Link>
                                <i className="fab fa-sellcast"></i> About
                            </Nav.Link>
                        </LinkContainer>
                    </>)}
                        
                    </Nav>
                </Navbar.Collapse>
                
            </Navbar>
        </header>
    )
}

export default Header
