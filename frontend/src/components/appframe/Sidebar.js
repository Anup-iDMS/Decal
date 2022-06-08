import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../actions/masters/userActions'
import  { Redirect } from 'react-router-dom'

import './../../components/css/dropdown.css';
import './css/sidebar.css'

const Sidebar = (props) => {
    const dispatch = useDispatch()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const logoutHandler = () => {
        dispatch(logout())
    }

    var menuItems = [];
    if(userInfo !== null && userInfo !== undefined) {
        if(userInfo.menuItems !== undefined){
            menuItems = userInfo.menuItems.menuItems;
        }
    }

    return (
        <>
            <div className="sidebar">
                <div className="sidebar-header">
                    <h3 className="brand text-center">
                         <span className="icon-color ml-4" >IDMS</span>
                    </h3>

                    <label htmlFor="sidebar-toggle" className="fas fa-bars icon-color"></label>
                </div>
                <div className="d-none d-md-none d-lg-block text-center" >
                    <h5 className="appWhiteColor"><span className="fas fa-user-tie icon-color" ></span>
                    {userInfo === null ? "Basic" : userInfo !== undefined ? userInfo.roleName : "User Role"}
                    </h5>
                </div>
                <div className="sidebar-menu">
                    {menuItems.map( (menu) => !menu.hasSubMenu? (
                        <ul key={menu.name}>
                            <li>
                                <Link to={menu.link}>
                                    <i className={menu.styleclass}></i>
                                    <span>{menu.name}</span>
                                </Link> 
                            </li>
                        </ul>
                    ): (
                        <nav key={menu.name} className="navigation lala">
                            <ul className="mainmenu">
                                
                                <li><Link to="#">
                                    <i className={menu.styleclass}></i> {menu.name} <i className="fas fa-caret-down caretrRight"></i></Link>
                                {menu.subMenuItems.map( (submenu) => 
                                    <ul key={submenu.subMenuName} className="submenu">
                                        <li>
                                            <Link to={submenu.subMenuLink}>
                                                &nbsp;&nbsp;{submenu.subMenuName}
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                                </li>
                            </ul>
                        </nav>
                    ))}
                    
                    <ul>
                        <hr className="appBorderColor"></hr>
                        <li>
                            <Link to="/" onClick={logoutHandler}>
                                <i className="fas fa-sign-out-alt icon-color"></i>
                                <span>Logout</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                
            </div>
        </>
    )
}

export default Sidebar
