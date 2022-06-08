import React from 'react'
import { Card } from 'react-bootstrap'

const CardLayout = ({ children, headerBackgroundColor, headerIcon, headerTitle }) => {
  return (
    <Card className='my-2 rounded'>
      <Card.Header style={{ backgroundColor:headerBackgroundColor }}>
          <h5><i className={ headerIcon }></i> {headerTitle}</h5>
      </Card.Header>
      <Card.Body>
        {children}
      </Card.Body>
    </Card>
  )
}

export default CardLayout
