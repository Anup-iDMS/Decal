import React from 'react'

const FormFieldsContainer = ({ frameTitle, children }) => {
   return (
      <div style={{border:"1px solid black", borderRadius:"5px", background:"white"}}>
         <h6 className="px-2 py-2" style={{background:"#e84347", color:"white"}}>{frameTitle} !!!</h6>
         <br></br>
         {children}
      </div>
   )
}

export default FormFieldsContainer
