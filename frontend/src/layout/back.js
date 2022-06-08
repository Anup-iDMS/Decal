import React, { useState } from 'react'
import Sidebar from '../components/appframe/Sidebar';
import Main from '../components/appframe/Main';
import IconSidebar from './../components/appframe/IconSidebar';



const back = (props) => {
  //const [ menuStyle, setMenuStyle ] = useState("old");
  let style = "new"
  const showOldMenuStyleNotification = localStorage.getItem('menustyle')
  return (
    <>
      <input type="checkbox" id="sidebar-toggle" />
      {showOldMenuStyleNotification === "old"?<Sidebar />:<IconSidebar />}
      <div className="main-content">

        <Main />

      </div>


    </>
  )
}

export default back
