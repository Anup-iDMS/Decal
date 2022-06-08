import React from 'react'
import { Modal, Button } from "react-bootstrap";
//import { getRandomThought } from './../../constants/randomThoughts';

const WelcomeModal = (props) => {

   let myDate = new Date();
   let hrs = myDate.getHours();

   let greet = "Welcome ";

   if (hrs < 12)
      greet = 'Good Morning';
   else if (hrs >= 12 && hrs <= 17)
      greet = 'Good Afternoon';
   else if (hrs >= 17 && hrs <= 24)
      greet = 'Good Evening';

   const thoughts = [  
      {  
         "text":"The only people who never fail are those who never try.",
         "from":"Ilka Chase"
      },
      {  
         "text":"Failure is just another way to learn how to do something right.",
         "from":"Marian Wright Edelman"
      },
      {  
         "text":"I failed my way to success.",
         "from":"Thomas Edison"
      },
      {  
         "text":"Every failure brings with it the seed of an equivalent success.",
         "from":"Napoleon Hill"
      },
      {  
         "text":"Only those who dare to fail greatly can ever achieve greatly.",
         "from":"John F. Kennedy"
      },
      {  
         "text":"It is hard to fail, but it is worse never to have tried to succeed.",
         "from":"Theodore Roosevelt"
      },
      {  
         "text":"Imagination is more important than knowledge.",
         "from":"Albert Einstein"
      },
   ]      

   //let thought = getRandomThought();
   //console.log("************* thought is ************ ", thought)
   return (
      <Modal centered show={props.onShow}  onHide={props.onClose}>
      <Modal.Header closeButton>
         <Modal.Title><h6>Welcome!!</h6></Modal.Title>
      </Modal.Header>
         <Modal.Body className="text-center">
            <h5>{greet} <span style={{ color: "rgb(87, 84, 84)" }}>{props.userInfo.name}</span>  !</h5>
            <br></br>
            <h6>Wishing you a wonderful day !!</h6>
            <br></br>
            <h5 style={{ color: "rgb(87, 84, 84)" }}><i class="fas fa-lightbulb"></i> Thought of the Day</h5>
            <h6><i class="fas fa-quote-left"></i> {(thoughts[Math.floor(Math.random()*thoughts.length)]).text} <i class="fas fa-quote-right"></i></h6>
         </Modal.Body>
      <Modal.Footer>
         <Button variant="primary" className="button-class btn-sm my-2" onClick={props.onClose}>Close</Button>
      </Modal.Footer>
      </Modal>
 )
}

export default WelcomeModal
