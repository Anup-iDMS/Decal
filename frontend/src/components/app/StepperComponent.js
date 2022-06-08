import React from 'react'
import Stepper from 'react-stepper-horizontal';

const StepperComponent = (props) => {
   return (
      <div>
         <Stepper
            completeColor="green"
            completeBarColor="green"
            completeTitleColor="green"
            activeColor="#FF4500"
            titleFontSize={15}
            defaultColor="#808080"
            steps={ 
               [
                  {title: 'Create Dispatch Request Note'}, 
                  {title: 'Send Dispatch Request Note for Approval'}, 
                  {title: 'Approve Dispatch Request Note'}, 
                  {title: 'Generate Tax Invoice'},
                  {title: 'Create Delivery Note'},
                  {title: 'Add Dispatch Details'}
               ] 
            } activeStep={ props.activeStep } />
      </div>
   )
}

export default StepperComponent
