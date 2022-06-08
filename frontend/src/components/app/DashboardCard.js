import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const DashboardCard = ({ 
    headerBackgroundColor, 
    headerIcon, 
    headerTitle, 
    cardTitleValue, 
    showLink=false,
    showPendingLink = false,
    leadStatus="In Progress" 
  }) => {
  return (
    <Card className='rounded my-2' style={{height:'110px'}}>
      <Card.Header style={{ textAlign:'center', backgroundColor:headerBackgroundColor }} >
        <h6><i className={ headerIcon }></i> {headerTitle}</h6>
      </Card.Header>
      <Card.Body>
        {!showLink? (<Card.Title style={{textAlign:'center'}}>{cardTitleValue}</Card.Title>):
          (!showPendingLink?(<Link to={`/api/leads/status/${leadStatus}/edit`}>
          <Card.Title style={{textAlign:'center'}}>{cardTitleValue}</Card.Title>
        </Link>):(<Link to={`/leadsdeadline`}>
        <Card.Title style={{textAlign:'center'}}>{cardTitleValue}</Card.Title>
      </Link>))}
        
      </Card.Body>
    </Card>
  )
}

export default DashboardCard
