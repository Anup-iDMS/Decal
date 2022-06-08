import React from 'react'

const PPMDataDisplayComponent = ({
   reportYear,
   months,
   dispatchedQty,
   complaintedQty,
   targetPPMLevel,
   actualPPMLevel
}) => {

   // let dispatchedQtySum = 0;
   // let complaintedQtySum = 0;

   // for (let index = 0; index < dispatchedQty.length; index++) {
   //    const element = dispatchedQty[index];
   //    dispatchedQtySum += parseFloat(element)  
   // }

   // for (let index = 0; index < complaintedQty.length; index++) {
   //    const element = complaintedQty[index];
   //    complaintedQtySum += parseFloat(element)
   // }

   /** styling start */
   let tableStyle = {
      border: "1px solid black",
      width: "100%",
      height: "100%",
      fontFamily:"Arial"
   }
   /** styling end */

   return (
      <table className="mx-2 my-3">
         <tr>
            <td colspan="14" style={{...tableStyle, textAlign:"center", fontWeight:"bold"}}>
               <span>PPM FOR CUSTOMER COMPLAINTS IN FY {reportYear}</span>
            </td>
         </tr>
         <tr>
            <td colspan="14" style={{...tableStyle, textAlign:"left", fontWeight:"bold"}}>&nbsp;</td>
         </tr>
         <tr>
            <td style={{...tableStyle}}>Month & Year</td>
            { months.map((d, index) => 
               <td key={index} style={{...tableStyle}}>{d.slice(0,3)}</td>
            )}
         </tr>
         <tr>
            <td style={{...tableStyle}}>Dispatched Quantity (Parts)</td>
            { dispatchedQty.map((d, index) => 
               <td key={index} style={{...tableStyle}}>{d}</td>
            )}
         </tr>
         <tr>
            <td style={{...tableStyle}}>Customer Complaint Qty (Parts)</td>
            { complaintedQty.map((d, index) => 
               <td key={index} style={{...tableStyle}}>{d}</td>
            )}
         </tr>
         <tr>
            <td style={{...tableStyle}}>PPM Level (Target)</td>
            { targetPPMLevel.map((d, index) => 
               <td key={index} style={{...tableStyle}}>{d}</td>
            )}
         </tr>
         <tr>
            <td style={{...tableStyle}}>PPM Level (Actual)</td>
            { actualPPMLevel.map((d, index) => 
               <td style={{...tableStyle}}>{d}</td>
            )}
         </tr>
      </table>
   )
}

export default PPMDataDisplayComponent
