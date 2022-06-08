//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Breadcrumb from './../../components/app/Breadcrumb';
import FormContainer from '../../components/form/FormContainer';
import FormFieldsContainer from './../../components/form/FormFieldsContainer';

const BulkJCUploadScreen = ({ history }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();
   const userDetails = useSelector((state) => state.userDetails)
   const { user } = userDetails
  
   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const viewFile = e => {
      console.log("------------- viewFile START -------------")
      e.currentTarget.blur()
      let poFileName = "authors.csv";
      axios(`/api/upload/jcmastertemplate `, {
         method: "GET",
         responseType: "blob"
         //Force to receive data in a Blob Format
       })
         .then(response => {
           //Create a Blob from the PDF Stream
           const file = new Blob([response.data], {
             type: "text/csv"
           });
           //Build a URL from the file
           const fileURL = URL.createObjectURL(file);
           //Open the URL on new Window
           window.open(fileURL);
         })
         .catch(error => {
           console.log(error);
         });

      console.log("------------- viewFile END -------------")
   }
    
   return (
      <React.Fragment>
         <FormContainer>
            <Row>
               <Col lg={6} md={12} xs={12}>
                  <Breadcrumb
                     listPage = "createjc"
                  />
               </Col>
               <Col lg={3} md={12} xs={12}>
                  <Form.Label>View PO File</Form.Label><br />
                  <Button 
                     className='my-2 btn-sm ' 
                     onClick={(e)=>viewFile(e)}
                  >View PO</Button>
               </Col>
            </Row>
            <br></br>
            <FormFieldsContainer frameTitle = "Please Upload JC Details !!!" >
               <p className="mx-2">Use the form below to upload a list of authors. Click  <Button 
               className='my-2 btn-sm ' 
               onClick={(e)=>viewFile(e)}
            >here</Button> for an example template.</p>
               <form action="/api/upload/jcmastertemplate" method="POST" encType="multipart/form-data">
                  <input type="file" name="file" accept="*.csv" /><br/><br/>
                  <input type="submit" value="Upload Authors" />
               </form>
               <br></br>
            </FormFieldsContainer>
         </FormContainer>
      </React.Fragment>
   )
}

export default BulkJCUploadScreen
