import React from 'react'
import { Link } from 'react-router-dom'
import NumberFormat from 'react-number-format';

const DashCards = ({
  headerBackgroundColor, 
  headerIcon, 
  headerTitle, 
  cardTitleValue, 
  showLink=false,
  showPendingLink = false,
  pageLink,
  showDecimal = true,
  leadStatus="In Progress" }) => {
  let borderStyle = {borderLeftt:"5px solid "+headerBackgroundColor}
  return (
    <div className="card-single" style={{...borderStyle}}>
      <div className="card-body text-center" style={{ textAlign:"center" } }>
        <div style={{ textAlign:"center", width:"100%", margin:"auto" } }>
            <h5 style={{ color:headerBackgroundColor, textAlign:"center" } }>{headerTitle}</h5>
            <h4 style={{ color:"#575454", textAlign:"center" } }>
                {showDecimal?(
                  <NumberFormat
                    thousandsGroupStyle="lakh"
                    value = {cardTitleValue!==undefined?parseFloat(cardTitleValue).toFixed(2):"0.00"}
                    decimalSeparator="."
                    displayType="text"
                    type="text"
                    thousandSeparator={true}
                    allowNegative={true} 
                  />
                ):(
                  <NumberFormat
                    thousandsGroupStyle="lakh"
                    value = {cardTitleValue!==undefined?parseFloat(cardTitleValue):"0"}
                    decimalSeparator="."
                    displayType="text"
                    type="text"
                    thousandSeparator={true}
                    allowNegative={true} 
                  />
                )}
                
            </h4>
        </div>
      </div>
      {showLink?( 
        <div className="card-footer">
            <Link to={pageLink}>View Details</Link>
        </div>
      ):null}
     
    </div>
  )
}

export default DashCards
