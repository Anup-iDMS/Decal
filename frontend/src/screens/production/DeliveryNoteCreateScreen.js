//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { format } from 'date-fns'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { NotificationManager } from 'react-notifications';

//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import FormFieldsContainer from './../../components/form/FormFieldsContainer';
import Message from '../../components/app/Message';
import Loader from '../../components/app/Loader';
import Breadcrumb from './../../components/app/Breadcrumb';
//Create Unique ID with this package
import { v4 as uuidv4 } from 'uuid';

import { 
   createDeliveryNote, 
   getAllMasterDataForDeliveryNote 
} from './../../actions/production/deliveryNoteActions';
import { APPLICATION_NOTIFICATION_TIME_OUT } from '../../constants/application/application';
import { DELIVERY_NOTE_CREATE_RESET } from '../../constants/production/deliveryNoteConstants';



const DeliveryNoteCreateScreen = ({ history, location }) => {
   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();
   //const userDetails = useSelector((state) => state.userDetails)
   //const { user } = userDetails

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo, error, loading } = userLogin

   const masterDataForDeliveryNote = useSelector((state) => state.masterDataForDeliveryNote)

   const { loading: loadingMasterData } = masterDataForDeliveryNote;

   const deliveryNoteCreate = useSelector((state) => state.deliveryNoteCreate)

   const { success, deliveryNote, error: errorCreate } = deliveryNoteCreate
   //disable button on click
   const [executing, setExecuting] = useState(false);

   useEffect(() => {
      if (!userInfo) {
         history.push('/login')
       } else {
         dispatch(getAllMasterDataForDeliveryNote())
       }
		if (success) {
         //history.push(`/deliverynote/${deliveryNote._id}/edit`)
         history.push('/deliverynotelist');
		   dispatch({ type: DELIVERY_NOTE_CREATE_RESET })
         NotificationManager.success(`ASN has been successfully created !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
		}

      if(errorCreate) {
         NotificationManager.error(`Error in creating ASN !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
		   dispatch({ type: DELIVERY_NOTE_CREATE_RESET })
      }
      
		// eslint-disable-next-line
	}, [history, success])

   let salesInvoices = [];
   let options = [];

   if(masterDataForDeliveryNote !== undefined) {
      salesInvoices = masterDataForDeliveryNote.salesInvoices
      //console .log(">>>>> Master data for Sales Order Screen is ", autoIncrementedSalesOrderNo)
      if(salesInvoices !== undefined) {
         salesInvoices.map(si => {
            let dropDownEle = { label: si.salesInvoiceNumber, value: si._id };
            return options.push(dropDownEle);
         });
      }
      //setSoNo(autoIncrementedSalesOrderNo);
   }

   let tableArray = [];
   for( let i = 0 ; i < 12 ; i++ ) {
      tableArray.push({newKey: i});
   }
   // 2. Define All Form Variables and their state
   const [ customer, setCustomer ] = useState("");
   const [ salesInvoiceId, setSalesInvoiceId ] = useState("");
   const [ customerId, setCustomerId ] = useState("");
   const [ stateOfSupply, setStateOfSupply ] = useState("");
   const [ invoiceDate, setInvoiceDate ] = useState();
   const [ totalBoxes, setTotalBoxes ] = useState(0);
   const [ totalBoxWeight, setTotalBoxWeight ] = useState(0);
   const [ deliveryDetails, setDeliveryDetails ] = useState([
      { 
         id: uuidv4(), 
         descriptionOfGoods:'', 
         quantity: 0, 
         batchDate: null,
         poNumber: '',
         boxNumber: ''
      },
   ]);
   //const [ salesInvoiceDetails, setSalesInvoiceDetails ] = useState([]);
   // 2.1 Validation Errors
   const [ errors, setErrors ] = useState({});

    // 3. Define all handler functions to change the state of FORM variables
    const resetErrorMessage = (name) => {
      if ( !!errors[name] ) setErrors({
         ...errors,
         [name]: null
      })
   }

   // 4. Validate the "FORM" before submit
   const findFormErrors = () => {
      const newErrors = {};
      if ( salesInvoiceId.trim().length === 0 ) {
         newErrors.salesInvoiceId = 'Select an Invocie #!'
      }
      if ( totalBoxes === 0 ) {
         newErrors.totalBoxes = 'Enter a Total Number of Boxes!'
      }
      if ( totalBoxWeight  === 0 ) {
         newErrors.totalBoxWeight = 'Enter a Total Box Weight!'
      }
      return newErrors;
   }

   const handleSalesInvoiceDetails = (e) => {
      let srs = [...salesInvoices];
      let naam = srs.filter(si=>{
         return si._id.trim() === e.value.trim();
      })
      setSalesInvoiceId((naam === undefined || naam[0] === undefined)? "":naam[0]._id);
      setCustomerId((naam === undefined || naam[0] === undefined)? "":naam[0].customer._id);
      setCustomer((naam === undefined || naam[0] === undefined)? "":naam[0].customer.custName);
      setStateOfSupply((naam === undefined || naam[0] === undefined)? "":naam[0].shipState);
      setInvoiceDate((naam === undefined || naam[0] === undefined)? "":format(new Date(naam[0].salesInvoiceDate), 'dd-MMM-yyyy'));
      if(naam[0].salesInvoiceDetails !== undefined) {
         let tempArr = [];
         for (const dd of naam[0].salesInvoiceDetails) {
            let sdk = {}
            sdk.id = uuidv4();
            sdk.descriptionOfGoods = dd.jcNo.jcDescription;
            sdk.quantity = dd.invoicedQty;
            sdk.batchDate = dd.batchDate;
            sdk.poNumber = dd.soNo.poNumber;
            sdk.boxNumber = "";

            tempArr.push(sdk);
         }
         setDeliveryDetails(tempArr)
         //setDeliveryDetails(naam[0].salesInvoiceDetails)
         resetErrorMessage("orderedQty")
      }
      
   }

   const handleInputChange = (id, event) => {
      const newInputFields = deliveryDetails.map(i => {
         if(id === i.id) {
            i.id = id;
            i.descriptionOfGoods = i.descriptionOfGoods;
            i.quantity = i.quantity;
            i.batchDate = i.batchDate;
            i.poNumber = i.poNumber;
            i.boxNumber = event.target.value;
            return i;
         } else {
            return i;
         }
      })
      setDeliveryDetails(newInputFields)
      // let srs = [...salesInvoices];
      // let naam = srs.filter(si=>{
      //    return si._id.trim() === salesInvoiceId.trim();
      // })
   }

   // 5.2 Submit The Form
   const submitHandler = (e) => {
      e.preventDefault();
      const newErrors = findFormErrors();
      if ( Object.keys(newErrors).length > 0 ) {
         setErrors(newErrors)
         window.scrollTo(0, 0);  
         NotificationManager.error(`Please fill in all mandatory fields !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
      } 
      else {
         setExecuting(true);
         dispatch(
            createDeliveryNote({
               salesInvoiceNumber: salesInvoiceId,
               customer: customerId,
               totalBoxes,
               totalBoxWeight,
               deliveryDetails
            })
         )
      }
   }

   const handleReset = () => {
      window.location.reload();
   }

   return (
      <FormContainer>
         <Breadcrumb
            listPage = "deliverynotelist"
         />
         <br></br>
         {loading ? (
            <Loader />
         ) : error  ? (
            <Message variant='danger'>{ error }</Message>
         ) : (
            <React.Fragment>
               <Row>
                  <Col>
                     <h3>ASN Entry</h3>
                  </Col>
               </Row>
               <br></br>
               <FormFieldsContainer frameTitle = "Please Enter ASN Details !!!" >
                  <Form onSubmit={submitHandler}>
                     <Col>
                        {/* START of 1st row in the form */}
                           <Row>
                              <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='salesInvoiceId'>
                                 <Form.Label>Select Invoice<span className="mandatory">*</span></Form.Label>
                                 <Select
                                    style={{background:"#e84347", color:"white"}} 
                                    options={options}
                                    onChange={(e) => handleSalesInvoiceDetails(e)}
                                 />
                                 <p className="validation-error">{errors.salesInvoiceId}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='customer'>
                              <Form.Label>Customer<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 readOnly
                                 type='text'
                                 name='customer'
                                 value={customer}
                                 onChange={(e) => setCustomer(e.target.value)}
                              />
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='stateOfSupply'>
                              <Form.Label>State of Supply<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 readOnly
                                 type='text'
                                 name='stateOfSupply'
                                 value={stateOfSupply}
                                 onChange={(e) => setStateOfSupply(e.target.value)}
                              />
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='batchDate'>
                              <Form.Label>Ref Invoice Date<span className="mandatory">*</span></Form.Label>
                              <DatePicker
                                 readOnly
                                 className="form-control"
                                 value={invoiceDate}
                                 onChange={(date) => setInvoiceDate(date)} 
                                 maxDate={new Date()}
                              />
                              <p className="validation-error">{errors.batchDate}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        <Row>
                           <div className="taxinvoicetable" style={{margin:"10px"}}>
                              <table style={{width:"100%", tableLayout:"fixed"}}>
                                 <thead>
                                 <tr>
                                    <th style={{ border:"1px solid black", width:"5%" }}>#</th>
                                    <th style={{ border:"1px solid black", width:"35%" }}>Description of Goods</th>
                                    <th style={{ border:"1px solid black", width:"10%" }}>Quantity</th>
                                    <th style={{ border:"1px solid black", width:"10%" }}>Batch Date</th>
                                    <th style={{ border:"1px solid black", width:"20%" }}>PO Reference</th>
                                    <th style={{ border:"1px solid black", width:"20%" }}>Box No.</th>
                                 </tr>
                                 </thead>
                                 <tbody>
                                 {deliveryDetails.length>0 ? (
                                    deliveryDetails.map((dd, index) => (
                                       <tr key={index}>
                                          <td>{index+1}</td>
                                          <td>{dd.descriptionOfGoods}</td>
                                          <td>{dd.quantity!==0?dd.quantity:""}</td>
                                          <td>{dd.batchDate!==null?(format(new Date(dd.batchDate), 'dd-MMM-yyyy')):""}</td>
                                          <td>{dd.poNumber}</td>
                                          <td>
                                             <Form.Control
                                                required
                                                type='text'
                                                name='boxNumber'
                                                value={dd.boxNumber}
                                                onChange={(e) => handleInputChange(dd.id, e)}
                                             />
                                          </td>
                                       </tr>
                                    ))
                                 ):(null)}
                                 </tbody>
                                 {/*<tfoot>
                                 <tr>
                                    <td>Sum</td>
                                    <td>$180</td>
                                 </tr>
                                 </tfoot>*/}
                              </table>
                           </div>
                        </Row>
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='totalBoxes'>
                                 <Form.Label>Total No. of Boxes<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    required
                                    type='number'
                                    name='totalBoxes'
                                    value={totalBoxes}
                                    onChange={(e) => setTotalBoxes(e.target.value)}
                                 />
                                 <p className="validation-error">{errors.totalBoxes}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='totalBoxWeight'>
                                 <Form.Label>Total Gross weight(kg)<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    required
                                    type='number'
                                    name='totalBoxWeight'
                                    value={totalBoxWeight}
                                    onChange={(e) => setTotalBoxWeight(e.target.value)}
                                 />
                                 <p className="validation-error">{errors.totalBoxWeight}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* START of LAST row in the form */}
                        <Row>
                           <Col style={{textAlign:"end"}}>
                              <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                              <Button 
                                 type='submit'
                                 disabled={executing} 
                                 className=' my-3 btn-md button-class' ><i className="fas fa-save"></i> Save</Button>
                           </Col>
                        </Row>
                     </Col>
                  </Form>
               </FormFieldsContainer>
            </React.Fragment>
         )}
      </FormContainer>
   )         
}

export default DeliveryNoteCreateScreen
