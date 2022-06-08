//import standard React Components
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import { APPLICATION_NOTIFICATION_TIME_OUT } from '../../constants/application/application'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import Custom Application Components
import FormContainer from '../../components/form/FormContainer';
import FormFieldsContainer from './../../components/form/FormFieldsContainer';
import Message from '../../components/app/Message'
import Loader from '../../components/app/Loader'
import Breadcrumb from './../../components/app/Breadcrumb';
//import Redux "action(s)" 
import { 
   getJCMasterDetails,
   getAllMasterDataForJC,
   updateJCMaster
} from '../../actions/masters/jcMasterActions';

//import Redux "constantc(s)" 
import { 
   JC_UPDATE_RESET, JC_DETAILS_RESET
} from '../../constants/masters/jcMasterConstants';

//Create Unique ID with this package
import { v4 as uuidv4 } from 'uuid';
import { logger } from './../../util/ConsoleHelper';

const EditJCMasterScreen = ({ history, match }) => {

   // 1. Get all the master data and dependent data required to create a form
   const dispatch = useDispatch();

   //logger("1. USer Details are ========= ", user)

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const jcMasterId = match.params.id;
   const jcMasterDetails = useSelector((state) => state.jcMasterDetails)
	const { loading, module, errorRecord } = jcMasterDetails;

   const masterDataForJC = useSelector((state) => state.masterDataForJC)

   const { loading: loadingMasterData, error: errorMasterDataLoad } = masterDataForJC;
   
   //post updated JC record
   const jcMasterUpdate = useSelector((state) => state.jcMasterUpdate);
   const { success: successUpdate, error: errorUpdate } = jcMasterUpdate

   const userDetails = useSelector((state) => state.userDetails)
   const { user } = userDetails

   let productCategories = [];
   let prodCodes = [];
   let uoms = [];
   let machineMasters = [];
   let customers = [];

   let autoIncValues = {};

   if(masterDataForJC !== undefined) {
      productCategories = masterDataForJC.prodCategories
      prodCodes = masterDataForJC.prodCodes
      uoms = masterDataForJC.uoms
      machineMasters = masterDataForJC.machineMasters
      customers = masterDataForJC.customers
     
   }

   if(masterDataForJC.autoIncValues !== undefined) {
      autoIncValues = masterDataForJC.autoIncValues
   }

   // 2. Define All Form Variables and their state
   
   const [ jcno, setJCNo] = useState("");
   const [ jcProdCategory, setJCProdCategory] = useState("");
   const [ jcProdCode, setJCProdCode ] = useState("");
   const [ jcDescription, setjcDescription ] = useState("");
   const [ customerPartNumber, setCustomerPartNumber ] = useState("");
   
   const [ custCode, setCustCode ] = useState("");

   const [ unit,  setUnit ] = useState("");
   const [ hsn,   setHSN ] = useState("");
   
   const [ artUOMLabel,  setArtUOMLabel ] = useState("");
   const [ artUOM,   setArtDim ] = useState("");
   const [ adWidth,  setADWidth ] = useState(0);
   const [ adHeight,  setADHeight ] = useState(0);
   const [ adArea, setADArea ] = useState(0);

   const [ prodLayoutUOM,  setProdLayoutUOM ] = useState("");
   const [ prodLayoutUOMLabel,  setProdLayoutUOMLabel ] = useState("");
   const [ bomUOMLabel,  setbomUOMLabel ] = useState("");
   const [ prodLayoutWidth, setProdLayoutWidth ] = useState(0);
   const [ prodLayoutHeight, setProdLayoutHeight ] = useState(0);
   const [ prodLayoutArea,   setProdLayoutArea ] = useState(0);
   const [ prodLayoutWidthUps, setProdLayoutWidthUps ] = useState(0);
   const [ prodLayoutHeightUps,  setProdLayoutHeightUps ] = useState(0);
   const [ prodLayoutTotalUps,  setProdLayoutTotalUps ] = useState(0);
   
   const [ bomUOM,   setbomUOM ] = useState("");
   const [ bomWidth,  setbomWidth ] = useState(0);
   const [ bomHeight,  setbomHeight ] = useState(0);
   const [ bomArea, setbomArea ] = useState(0);

   const [ colour1,  setColour1 ] = useState("");
   const [ colour2,  setColour2 ] = useState("");
   const [ colour3,  setColour3 ] = useState("");
   const [ colour4,  setColour4 ] = useState("");
   const [ colour5,  setColour5 ] = useState("");
   const [ colour6,  setColour6 ] = useState("");
   const [ colour7,  setColour7 ] = useState("");
   const [ colour8,  setColour8 ] = useState("");
   const [ colour9,  setColour9 ] = useState("");
   const [ colour10,  setColour10 ] = useState("");
   const [ colour11,  setColour11 ] = useState("");
   const [ colour12,  setColour12 ] = useState("");
   const [ colour13,  setColour13 ] = useState("");
   const [ colour14,  setColour14 ] = useState("");
   const [ colour15,  setColour15 ] = useState("");
   const [ colour16,  setColour16 ] = useState("");
   const [ totalColors, setTotalColors ] = useState(0);
   const [ proposedMachine,  setProposedMachine ] = useState("");
   const [ prodRemarks,  setProdRemarks ] = useState("");
   const [ positiveRemarks,  setPositiveRemarks ] = useState("");
   //const [ customerId,  setCustomerId ] = useState("");
   //const [ price,  setPrice ] = useState(0);
   const [ jcCustomerDetails, setJCCustomerDetails] = useState([]);
   
   const [ company, setCompany ] = useState(userInfo.companyId);
   // const [ createdBy, setCreatedBy ] = useState(userInfo._id);
   // const [ updatedBy, setUpdatedBy ] = useState(userInfo._id);
   
   //const [ active, setActive ] = useState("");
   const [ isActive, setIsActive ] = useState("A");

   const [inputFields, setInputFields] = useState([
      { 
         id: uuidv4(), 
         customerId: '', 
         customerPrice: '', 
         customer:'',
         customerPONumber:'',
         customerPODate: null,
         isCustomerPOActive: 'Yes'
      },
   ]);


   

   useEffect(() => {
		if (successUpdate) {
         history.push('/jcmasterlist');
         dispatch({ type: JC_UPDATE_RESET })
         //dispatch({ type: JC_DETAILS_RESET })
         NotificationManager.success(`JC Record ${module.jcno} has been successfully updated !`, 'Successful!', APPLICATION_NOTIFICATION_TIME_OUT);
         //history.push(`/jcmasters/${jcMaster._id}/edit`)
		   //dispatch({ type: JC_CREATE_RESET })
		} else { 
         if (module._id !== jcMasterId) {
            dispatch(getJCMasterDetails(jcMasterId))
            dispatch(getAllMasterDataForJC())
            //dispatch({ type: JC_DETAILS_RESET })
         } else {
            setJCNo(module.jcno)
				setJCProdCategory(module.jcProdCategory._id)
				setJCProdCode(module.jcProdCode._id)
				setjcDescription(module.jcDescription)
				setUnit(module.unit)
				setCustomerPartNumber(module.customerPartNumber)
				setHSN(module.hsn)
            
            setArtDim(module.artUOM)
            setArtUOMLabel(module.artUOM)
            setADWidth(module.adWidth)
            setADHeight(module.adHeight)
            setADArea(module.adArea)

				setProdLayoutUOM(module.prodLayoutUOM)
            if(uoms!==undefined) {
               let srs = [...uoms];
               let naam = srs.filter(pc=>{
                  return pc._id.trim() === module.prodLayoutUOM.trim();
               })
               setProdLayoutUOMLabel((naam === undefined || naam[0] === undefined)? "":naam[0].name);
            }
           //setProdLayoutUOMLabel(module.prodLayoutUOM)
				setProdLayoutWidth(module.prodLayoutWidth)
				setProdLayoutHeight(module.prodLayoutHeight)
				setProdLayoutArea(module.prodLayoutArea)
				setProdLayoutWidthUps(module.prodLayoutWidthUps)
				setProdLayoutHeightUps(module.prodLayoutHeightUps)
				setProdLayoutTotalUps(module.prodLayoutTotalUps)
				setbomUOM(module.bomUOM)
				setbomWidth(module.bomWidth)
				setbomHeight(module.bomHeight)
				setbomArea(module.bomArea)
				setColour1(module.colour1)
				setColour2(module.colour2)
				setColour3(module.colour3)
				setColour4(module.colour4)
				setColour5(module.colour5)
				setColour6(module.colour6)
				setColour7(module.colour7)
				setColour8(module.colour8)
				setColour9(module.colour9)
				setColour10(module.colour10)
				setColour11(module.colour11)
				setTotalColors(module.totalColors)
				setProposedMachine(module.proposedMachine)
				setPositiveRemarks(module.positiveRemarks)
				setProdRemarks(module.prodRemarks)
            
            //setActive(module.isActive?"A":"I");
            setIsActive(module.isActive);

            let newjcCustomerDetails = [...module.jcCustomerDetails]
            let tempArray = []
            if(!loading) {
               for (const jcd of newjcCustomerDetails) {
                  let srs = {}
                  srs.id = uuidv4(); 
                  srs.customerId = jcd.customerId._id; 
                  srs.customerPrice = jcd.customerPrice; 
                  srs.customer = jcd.customerId.custCode; 
                  srs.customerPONumber = jcd.customerPONumber===undefined?"":jcd.customerPONumber; 
                  srs.revision = jcd.revision===undefined?"":jcd.revision; 
                  srs.tmo = jcd.tmo===undefined?0:jcd.tmo; 
                  srs.customerPODate = jcd.customerPODate===undefined?null:jcd.customerPODate; 
                  srs.isCustomerPOActive = (jcd.isCustomerPOActive===undefined || jcd.isCustomerPOActive==="")?"Yes":jcd.isCustomerPOActive; 
                  
                  tempArray.push(srs);
               }
               console.log("--------> before setting data <----------- ", tempArray)
               setInputFields(tempArray);
            }
				//setCustomerId(module.jcCustomerDeatils[0].customerId._id)
         }
         //dispatch(getAllMasterDataForJC())
      }

      if(errorUpdate) {
         NotificationManager.error(`Error in updating JC record # ${module.jcno} !`, 'Error!', APPLICATION_NOTIFICATION_TIME_OUT);
         dispatch({ type: JC_UPDATE_RESET })
      }
      
		// eslint-disable-next-line
	}, [ dispatch, history, jcMasterId, module, successUpdate, loadingMasterData ])
   
   
   
   // 2.1 Validation Errors
   const [ errors, setErrors ] = useState({});
   

   // 3. Define all handler functions to change the state of FORM variables
   
   const handleProdCode = (e) => {
      if(e.target.value.trim() === "none") {
         setJCProdCode("")
      } else {
         setJCProdCode(e.target.value);
         let srs = [...prodCodes];
         let naam = srs.filter(pc=>{
            return pc._id.trim() === e.target.value.trim();
         })
         setHSN((naam === undefined || naam[0] === undefined)? "":naam[0].hsn);
        
         resetErrorMessage("jcProdCode")
      }
   }

   const handleProdCategory = (e) => {
      if(e.target.value.trim() === "none") {
         setJCProdCategory("")
         setJCNo("")
      } else {
         setJCProdCategory(e.target.value);
         let srs = [...productCategories];
         let naam = srs.filter(pc=>{
            return pc._id.trim() === e.target.value.trim();
         })
         if(naam !== undefined || naam[0] !== undefined) {
            let prodCat = naam[0].name;
            if(prodCat.startsWith("SP")) {
               setJCNo(autoIncValues.SP)
            } else if (prodCat.startsWith("DP")) {
               setJCNo(autoIncValues.DP)
            } else if (prodCat.startsWith("PC")) {
               setJCNo(autoIncValues.PC)
            }
         }
         
         resetErrorMessage("jcProdCategory")
      }
   }

   const handlejcDescription = (name, value) => {
      setjcDescription(value);
      resetErrorMessage(name);
   }

   const handleArtDim = (e) => {
      
      if(e.target.value === "none") {
         setArtUOMLabel("");
         setArtDim("")
         setADWidth(0)
         setADHeight(0)
         setADArea(0)
      } else {
         if(artUOMLabel === "mm") {
            if(e.target.value === "cm") {
               let plw = adWidth;
               let w = plw/10;
               setADWidth(w.toFixed(2))
               let plh = adHeight;
               let h = plh/10;
               setADHeight(h.toFixed(2))
               setADArea((w*h).toFixed(2));
            } else if(e.target.value === "inch") {
               let plw = adWidth;
               let w = plw/25.4;
               setADWidth(w.toFixed(2))
               let plh = adHeight;
               let h = plh/25.4;
               setADHeight(h.toFixed(2))
               setADArea((w*h).toFixed(2));
            } else if(e.target.value === "ft") {
               let plw = adWidth;
               let w = plw/304.8;
               setADWidth(w.toFixed(2))
               let plh = adHeight;
               let h = plh/304.8;
               setADHeight(h.toFixed(2))
               setADArea((w*h).toFixed(2));
            }
         }
         //convert from "cm" to other "units"
         if(artUOMLabel === "cm") {
            if(e.target.value === "mm") {
               let plw = adWidth;
               let w = plw*10;
               setADWidth(w.toFixed(2))
               let plh = adHeight;
               let h = plh*10;
               setADHeight(h.toFixed(2))
               setADArea((w*h).toFixed(2));
            } else if(e.target.value === "inch") {
               let plw = adWidth;
               let w = plw/2.54;
               setADWidth(w.toFixed(2))
               let plh = adHeight;
               let h = plh/2.54;
               setADHeight(h.toFixed(2))
               setADArea((w*h).toFixed(2));
            } else if(e.target.value === "ft") {
               let plw = adWidth;
               let w = plw/30.48;
               setADWidth(w.toFixed(2))
               let plh = adHeight;
               let h = plh/30.48;
               setADHeight(h.toFixed(2))
               setADArea((w*h).toFixed(2));
            }
         }
         //convert from "inch" to other "units"
         if(artUOMLabel === "inch") {
            if(e.target.value === "mm") {
               let plw = adWidth;
               let w = plw*25.4;
               setADWidth(w.toFixed(2))
               let plh = adHeight;
               let h = plh*25.4;
               setADHeight(h.toFixed(2))
               setADArea((w*h).toFixed(2));
            } else if(e.target.value === "cm") {
               let plw = adWidth;
               let w = plw*2.54;
               setADWidth(w.toFixed(2))
               let plh = adHeight;
               let h = plh*2.54;
               setADHeight(h.toFixed(2))
               setADArea((w*h).toFixed(2));
            } else if(e.target.value === "ft") {
               let plw = adWidth;
               let w = plw*0.0833333;
               setADWidth(w.toFixed(2))
               let plh = adHeight;
               let h = plh*0.0833333;
               setADHeight(h.toFixed(2))
               setADArea((w*h).toFixed(2));
            }
         }
         //convert from "ft" to other "units"
         if(artUOMLabel === "ft") {
            if(e.target.value === "mm") {
               let plw = adWidth;
               let w = plw*304.8;
               setADWidth(w.toFixed(2))
               let plh = adHeight;
               let h = plh*304.8;
               setADHeight(h.toFixed(2))
               setADArea((w*h).toFixed(2));
            } else if(e.target.value === "cm") {
               let plw = adWidth;
               let w = plw*30.48;
               setADWidth(w.toFixed(2))
               let plh = adHeight;
               let h = plh*30.48;
               setADHeight(h.toFixed(2))
               setADArea((w*h).toFixed(2));
            } else if(e.target.value === "inch") {
               let plw = adWidth;
               let w = plw*12;
               setADWidth(w.toFixed(2))
               let plh = adHeight;
               let h = plh*12;
               setADHeight(h.toFixed(2))
               setADArea((w*h).toFixed(2));
            }
         }
         setArtUOMLabel(e.target.value)
         setArtDim(e.target.value)

      }
      
   }

   const handleUnit = (e) => {
      if(e.target.value.trim() === "none") {
         setUnit("")
      } else {
         setUnit(e.target.value);
         resetErrorMessage("unit")
      }
   }

   const handleProdLayoutUOM = (e) => {
      if(e.target.value.trim() === "none") {
         setProdLayoutUOM("")
         setProdLayoutWidth(0)
         setProdLayoutHeight(0)
         setProdLayoutArea(0)
         setProdLayoutWidthUps(0)
         setProdLayoutHeightUps(0)
         setProdLayoutTotalUps(0)
         setbomUOM("")
         setbomUOMLabel("")
         setProdLayoutUOMLabel("")
         setbomWidth(0)
         setbomHeight(0)
         setbomArea(0)
      } else {
         let srs = [...uoms];
         let naam = srs.filter(pc=>{
            return pc._id.trim() === e.target.value.trim();
         })
         setProdLayoutUOM(e.target.value);
         setProdLayoutUOMLabel((naam === undefined || naam[0] === undefined)? "":naam[0].name);
         if(prodLayoutWidth > 0 || prodLayoutHeight > 0) {
            console.log("!!! USER selected UNIT is !!!! ", naam[0].name);
            console.log("!!! PREVIOUS selected UNIT WAS !!!! ", prodLayoutUOMLabel);
            //convert from "mm" to "other" units
            if(prodLayoutUOMLabel === "mm") {
               if(naam[0].name === "cm") {
                  let plw = prodLayoutWidth;
                  let w = plw/10;
                  setProdLayoutWidth(w.toFixed(2))
                  let plh = prodLayoutHeight;
                  let h = plh/10;
                  setProdLayoutHeight(h.toFixed(2))
                  setProdLayoutArea((w*h).toFixed(2));
               } else if(naam[0].name === "inch") {
                  let plw = prodLayoutWidth;
                  let w = plw/25.4;
                  setProdLayoutWidth(w.toFixed(2))
                  let plh = prodLayoutHeight;
                  let h = plh/25.4;
                  setProdLayoutHeight(h.toFixed(2))
                  setProdLayoutArea((w*h).toFixed(2));
               } else if(naam[0].name === "ft") {
                  let plw = prodLayoutWidth;
                  let w = plw/304.8;
                  setProdLayoutWidth(w.toFixed(2))
                  let plh = prodLayoutHeight;
                  let h = plh/304.8;
                  setProdLayoutHeight(h.toFixed(2))
                  setProdLayoutArea((w*h).toFixed(2));
               }
            }
            //convert from "cm" to other "units"
            if(prodLayoutUOMLabel === "cm") {
               if(naam[0].name === "mm") {
                  let plw = prodLayoutWidth;
                  let w = plw*10;
                  setProdLayoutWidth(w.toFixed(2))
                  let plh = prodLayoutHeight;
                  let h = plh*10;
                  setProdLayoutHeight(h.toFixed(2))
                  setProdLayoutArea((w*h).toFixed(2));
               } else if(naam[0].name === "inch") {
                  let plw = prodLayoutWidth;
                  let w = plw/2.54;
                  setProdLayoutWidth(w.toFixed(2))
                  let plh = prodLayoutHeight;
                  let h = plh/2.54;
                  setProdLayoutHeight(h.toFixed(2))
                  setProdLayoutArea((w*h).toFixed(2));
               } else if(naam[0].name === "ft") {
                  let plw = prodLayoutWidth;
                  let w = plw/30.48;
                  setProdLayoutWidth(w.toFixed(2))
                  let plh = prodLayoutHeight;
                  let h = plh/30.48;
                  setProdLayoutHeight(h.toFixed(2))
                  setProdLayoutArea((w*h).toFixed(2));
               }
            }
            //convert from "inch" to other "units"
            if(prodLayoutUOMLabel === "inch") {
               if(naam[0].name === "mm") {
                  let plw = prodLayoutWidth;
                  let w = plw*25.4;
                  setProdLayoutWidth(w.toFixed(2))
                  let plh = prodLayoutHeight;
                  let h = plh*25.4;
                  setProdLayoutHeight(h.toFixed(2))
                  setProdLayoutArea((w*h).toFixed(2));
               } else if(naam[0].name === "cm") {
                  let plw = prodLayoutWidth;
                  let w = plw*2.54;
                  setProdLayoutWidth(w.toFixed(2))
                  let plh = prodLayoutHeight;
                  let h = plh*2.54;
                  setProdLayoutHeight(h.toFixed(2))
                  setProdLayoutArea((w*h).toFixed(2));
               } else if(naam[0].name === "ft") {
                  let plw = prodLayoutWidth;
                  let w = plw*0.0833333;
                  setProdLayoutWidth(w.toFixed(2))
                  let plh = prodLayoutHeight;
                  let h = plh*0.0833333;
                  setProdLayoutHeight(h.toFixed(2))
                  setProdLayoutArea((w*h).toFixed(2));
               }
            }
            //convert from "ft" to other "units"
            if(prodLayoutUOMLabel === "ft") {
               if(naam[0].name === "mm") {
                  let plw = prodLayoutWidth;
                  let w = plw*304.8;
                  setProdLayoutWidth(w.toFixed(2))
                  let plh = prodLayoutHeight;
                  let h = plh*304.8;
                  setProdLayoutHeight(h.toFixed(2))
                  setProdLayoutArea((w*h).toFixed(2));
               } else if(naam[0].name === "cm") {
                  let plw = prodLayoutWidth;
                  let w = plw*30.48;
                  setProdLayoutWidth(w.toFixed(2))
                  let plh = prodLayoutHeight;
                  let h = plh*30.48;
                  setProdLayoutHeight(h.toFixed(2))
                  setProdLayoutArea((w*h).toFixed(2));
               } else if(naam[0].name === "inch") {
                  let plw = prodLayoutWidth;
                  let w = plw*12;
                  setProdLayoutWidth(w.toFixed(2))
                  let plh = prodLayoutHeight;
                  let h = plh*12;
                  setProdLayoutHeight(h.toFixed(2))
                  setProdLayoutArea((w*h).toFixed(2));
               }
            }
            calculateBOMArea(naam[0].name);
         }
        
         
         resetErrorMessage("prodLayoutUOM");
         //setProdLayoutUOM(e.target.value.trim());
      }
   }

   const handleLayoutWidth = (value) => {
      setProdLayoutWidth(value)
      calculateArea("width", value);
      resetErrorMessage("prodLayoutWidth");
   }
   
   const handleLayoutHeight = (value) => {
      setProdLayoutHeight(value)
      //logger(">>>>> Inside handleLayoutHeight and value is ", value)
      calculateArea("height", value);
      resetErrorMessage("prodLayoutHeight");
   }

   const calculateArea = (propertyName, value) => {
      //logger("Propaert  mane is ", propertyName)
      //logger("Value is ", value)
      let width = 0;
      let height = 0;
      if(propertyName === "height") {
         width = prodLayoutWidth;
         height = value;
      }
      if(propertyName === "width") {
         height = prodLayoutHeight;
         width = value;
      }
         
      
      let area = height * width;
      setProdLayoutArea(area.toFixed(2));
   }

   const handleLayoutWidthUps = (value) => {
      setProdLayoutWidthUps(value)
      calculateTotalUps("width", value);
      resetErrorMessage("prodLayoutWidthUps");
   }
   
   const handleLayoutHeightUps = (value) => {
      setProdLayoutHeightUps(value)
      calculateTotalUps("height", value);
      resetErrorMessage("prodLayoutHeightUps");
   }

   const calculateTotalUps = (propertyName, value) => {
      
      let width = 0;
      let height = 0;
      if(propertyName === "height") {
         width = prodLayoutWidthUps;
         height = value;
      }
      if(propertyName === "width") {
         height = prodLayoutHeightUps;
         width = value;
      }
         
      let area = height * width;
      setProdLayoutTotalUps(area);
   }

   const handlebomUOM = (value) => {
      if(value.trim() === "none") {
         setbomUOM("")
         setbomUOMLabel("")
         setbomWidth(0);
         setbomHeight(0);
         setbomArea(0);
      } else {
         let srs = [...uoms];
         let naam = srs.filter(pc=>{
            return pc._id.trim() === value.trim();
         })
         //logger("NAAMA is ", naam)
         setbomUOM(value);
         setbomUOMLabel((naam === undefined || naam[0] === undefined)? "":naam[0].name);
         calculateBOMArea(naam[0].name);
         resetErrorMessage("bomUOM")
      }
   }

   const calculateADArea = (e) => {
      let value = e.target.value;
      let name = e.target.name;
      if(value === 0 || value === "" || value === "0" || value === undefined){
         if(name === 'adWidth') {
            setADWidth(0)
         } else if(name === 'adHeight') {
            setADHeight(0)
         }
      }
      setADArea((adWidth*adHeight).toFixed(2));
   }

   const manageBOMArea = (value) => {
      console.log("value s ", value)
      if(value === 0 || value === "" || value === "0" || value === undefined){
         setbomWidth(0);
         setbomHeight(0);
         setbomArea(0);
         return;
      }
      //calculateBOMArea("inch");
      let width = 0;
      let height = 0;
      let area = 0;

      width = prodLayoutWidth/prodLayoutWidthUps;
      height = prodLayoutHeight/prodLayoutHeightUps;
      area = width * height

      setbomWidth(width.toFixed(2));
      setbomHeight(height.toFixed(2));
      setbomArea(area.toFixed(2));
   }

   const calculateBOMArea = (bomunit) => {
     // logger("prodLayoutUOM is ", prodLayoutUOMLabel)
      console.log("prodLayoutUOM >>>>>>>>>> ", prodLayoutUOM)
      console.log("bomunit >>>>>>>>>> ", bomunit)
      let srs = [...uoms];
      let naam = srs.filter(pc=>{
         return pc._id.trim() === prodLayoutUOM.trim();
      })
      //logger("NAAMA is ", naam)
      let unit = (naam === undefined || naam[0] === undefined)? "":naam[0].name;

      console.log(">>>>>>>>> Selected Customer ===== ", unit)
     //console.log("prodLayoutUOM ", prodLayoutUOM)
      let width = 0;
      let height = 0;
      let area = 0;

      
      //
      if(unit === "mm") {
         if(bomunit === "cm") {
            width = ((prodLayoutWidth/10)/prodLayoutWidthUps);
            height = ((prodLayoutHeight/10)/prodLayoutHeightUps);
         } else if(bomunit === "inch") {
            width = ((prodLayoutWidth/25.4)/prodLayoutWidthUps);
            height = ((prodLayoutHeight/25.4)/prodLayoutHeightUps);
         } else if(bomunit === "ft") {
            width = ((prodLayoutWidth/304.8)/prodLayoutWidthUps);
            height = ((prodLayoutHeight/304.8)/prodLayoutHeightUps);
         } else {
            width = (prodLayoutWidth / prodLayoutWidthUps);
            height = (prodLayoutHeight / prodLayoutHeightUps);
         }
      } else if(unit === "cm") {
         if(bomunit === "mm") {
            width = ((prodLayoutWidth*10)/prodLayoutWidthUps);
            height = ((prodLayoutHeight*10)/prodLayoutHeightUps);
         } else if(bomunit === "inch") {
            width = ((prodLayoutWidth/2.54)/prodLayoutWidthUps);
            height = ((prodLayoutHeight/2.54)/prodLayoutHeightUps);
         } else if(bomunit === "ft") {
            width = ((prodLayoutWidth/30.48)/prodLayoutWidthUps);
            height = ((prodLayoutHeight/30.48)/prodLayoutHeightUps);
         } else {
            width = (prodLayoutWidth / prodLayoutWidthUps);
            height = (prodLayoutHeight / prodLayoutHeightUps);
         }
      } else if(unit === "inch") {
         if(bomunit === "mm") {
            width = ((prodLayoutWidth*25.4)/prodLayoutWidthUps);
            height = ((prodLayoutHeight*25.4)/prodLayoutHeightUps);
         } else if(bomunit === "cm") {
            width = ((prodLayoutWidth*2.54)/prodLayoutWidthUps);
            height = ((prodLayoutHeight*2.54)/prodLayoutHeightUps);
         } else if(bomunit === "ft") {
            width = ((prodLayoutWidth*0.0833333)/prodLayoutWidthUps);
            height = ((prodLayoutHeight*0.0833333)/prodLayoutHeightUps);
         } else {
            width = (prodLayoutWidth / prodLayoutWidthUps);
            height = (prodLayoutHeight / prodLayoutHeightUps);
         }
      } else if(unit === "ft") {
         if(bomunit === "mm") {
            width = ((prodLayoutWidth*304.8)/prodLayoutWidthUps);
            height = ((prodLayoutHeight*304.8)/prodLayoutHeightUps);
         } else if(bomunit === "cm") {
            width = ((prodLayoutWidth*30.48)/prodLayoutWidthUps);
            height = ((prodLayoutHeight*30.48)/prodLayoutHeightUps);
         } else if(bomunit === "inch") {
            width = ((prodLayoutWidth*12)/prodLayoutWidthUps);
            height = ((prodLayoutHeight*12)/prodLayoutHeightUps);
         } else {
            width = (prodLayoutWidth / prodLayoutWidthUps);
            height = (prodLayoutHeight / prodLayoutHeightUps);
         }
      }
      setbomWidth(width.toFixed(2))
      setbomHeight(height.toFixed(2))
      setbomArea((width*height).toFixed(2))
      resetErrorMessage("bomUOM")
   }

   // 3.1 Functions to set dynamic form fields state
   const handleChangeInput = (id, event, fieldName='') => {
      const newInputFields = inputFields.map(i => {
         if(id === i.id) {
            
            if(fieldName === 'customerPODate') {
               i['customerPODate'] = event
            } else {
               console.log("<<<<<<< event.target ", event.target.name)
               if(event.target.name === "customerId"){
                  i[event.target.name] = event.target.value
                  resetErrorMessage("customerId")
                  let srs = [...customers];
                  let naam = srs.filter(cust=>{
                     return cust._id.trim() === event.target.value.trim();
                  })
                  console.log(">>>>>>>>> Selected Customer ===== ", naam[0])
                  i['customer'] = naam[0].custCode
                  setCustCode(naam[0].custCode)
               }
               if(event.target.name === "customerPrice") {
                  i[event.target.name] = event.target.value
                  resetErrorMessage("customerPrice")
               }
               if(event.target.name === "customerPONumber") {
                  console.log("<<<<<<< event.target customerPONumber ", event.target.name)
                  i[event.target.name] = event.target.value
                  resetErrorMessage("customerPONumber")
               }
               if(event.target.name === "revision") {
                  console.log("<<<<<<< event.target revision ", event.target.name)
                  i[event.target.name] = event.target.value
                  resetErrorMessage("revision")
               }//
               if(event.target.name === "tmo") {
                  console.log("<<<<<<< event.target tmo ", event.target.name)
                  i[event.target.name] = event.target.value
                  resetErrorMessage("tmo")
               }//
               if(event.target.name === "isCustomerPOActive") {
                  console.log("<<<<<<< event.target isCustomerPOActive ", event.target.name)
                  i[event.target.name] = event.target.value
                  resetErrorMessage("isCustomerPOActive")
               }
            }
         }
         return i;
      })
      console.log("New Input Fields are ", newInputFields)
      setInputFields(newInputFields);
      
     
   }

   const handleAddFields = () => {
      setInputFields([...inputFields, { 
         id: uuidv4(),  
         customerId: '', 
         customerPrice: '', 
         customer: '',
         customerPONumber:'',
         customerPODate: null,
         isCustomerPOActive: 'Yes', 
         revision: '1.0',
         tmo: 0
      }])
   }
  
   const handleRemoveFields = id => {
      const values  = [...inputFields];
      values.splice(values.findIndex(value => value.id === id), 1);
      setInputFields(values);
   }

   // 4. Validate the "FORM" before submit
   
   const findFormErrors = () => {
      const newErrors = {};
      
      if ( jcProdCategory.trim().length === 0 ) {
         newErrors.jcProdCategory = 'Select a Product Category!'
      }
      if ( jcProdCode.trim().length === 0 ) {
         newErrors.jcProdCode = 'Select a Product Code!'
      }
      if ( jcDescription.trim().length === 0 ) {
         newErrors.jcDescription = 'Job Code Name cannot be blank!'
      }
      if ( unit.trim().length === 0 ) {
         newErrors.unit = 'Unit cannot be blank!!'
      }
      // if ( hsn.trim().length === 0 ) {
      //    newErrors.hsn = 'HSN/SAC Code cannot be blank!'
      // }
      if ( prodLayoutUOM.trim().length === 0 ) {
         newErrors.prodLayoutUOM = 'Select a Production Layout UOM!'
      }
      if ( prodLayoutWidth === 0 ) {
         newErrors.prodLayoutWidth = 'Production Layout Width cannot be blank!'
      }
      if ( prodLayoutHeight === 0 ) {
         newErrors.prodLayoutHeight = 'Production Layout Height cannot be blank!'
      }
      if ( prodLayoutWidthUps === 0 ) {
         newErrors.prodLayoutWidthUps = 'Width Ups cannot be blank!'
      }
      if ( prodLayoutHeightUps === 0 ) {
         newErrors.prodLayoutHeightUps = 'Height Ups cannot be blank!'
      }
      if ( bomUOM.trim().length === 0 ) {
         newErrors.bomUOM = 'Select a BOM UOM!'
      }
      //console .log("Now printing inputFields of customer ==== ", inputFields)
      
      inputFields.map(inputField => {
         console .log(">>>>. inputFields of customer customerPrice ==== ", inputField)
         // if(inputField.customerId.id.trim().length === 0) {
         //    newErrors.customerId = 'Select a Customer !'
         // }
         if(inputField.customerPrice === 0) {
            newErrors.customerPrice = 'Customer Price Cannot be blank !'
         }
      });
      //logger("Error Object is ", newErrors)
      return newErrors;
   }

   const resetErrorMessage = (name) => {
      if ( !!errors[name] ) setErrors({
         ...errors,
         [name]: null
      })
   }

   const handleJCActive = (e) => {
      console.log("e.target.value Active = ", e.target.value)
      //setActive(e.target.value)
      setIsActive(e.target.value)
   }

   // 5. Reset and Submit Form functions

   const handleReset = () => {
      // setJCNo("");
      // setJCProdCategory("");
      // setJCProdCode("");
      // setjcDescription("");
      // setUnit("");
      // setCustomerPartNumber("");
      // setHSN("");
      // setProdLayoutUOM("");
      // setProdLayoutUOMLabel("");
      // setProdLayoutWidth(0);
      // setProdLayoutHeight(0);
      // setProdLayoutArea(0);
      // setProdLayoutWidthUps(0);
      // setProdLayoutHeightUps(0);
      // setProdLayoutTotalUps(0);
      // setbomUOM("");
      // setbomWidth(0);
      // setbomHeight(0);
      // setbomArea(0);
      // setColour1("");
      // setColour2("");
      // setColour3("");
      // setColour4("");
      // setColour5("");
      // setColour6("");
      // setColour7("");
      // setColour8("");
      // setColour9("");
      // setColour10("");
      // setColour11("");
      // setColour12("");
      // setColour13("");
      // setColour14("");
      // setColour15("");
      // setColour16("");
      // setTotalColors(0);
      // setProposedMachine("");
      // setPositiveRemarks("");
      // setProdRemarks("");
      // setbomUOMLabel("");
      // setProdLayoutUOMLabel("");
      
      // setInputFields([
      //    { id: uuidv4(), customerId: '', customerPrice: '' },
      // ]);
      window.location.reload();
      setErrors({});
       
      window.scrollTo(0, 0);
   }

   const submitHandler = (e) => {
      e.preventDefault();
      const newErrors = findFormErrors();
      if ( Object.keys(newErrors).length > 0 ) {
         setErrors(newErrors)
         window.scrollTo(0, 0);  
       } else {
         dispatch(
            updateJCMaster({
               _id: jcMasterId,
               jcno,
               company,
               jcProdCategory,
               jcProdCode,
               jcDescription,
               customerPartNumber,
               unit,
               hsn,
               artUOM,
               adWidth,
               adHeight,
               adArea,
               prodLayoutUOM,
               prodLayoutUOMLabel,
               bomUOMLabel,
               prodLayoutWidth,
               prodLayoutHeight,
               prodLayoutArea,
               prodLayoutWidthUps,
               prodLayoutHeightUps,
               prodLayoutTotalUps,
               bomUOM,
               bomWidth,
               bomHeight,
               bomArea,
               colour1,
               colour2,
               colour3,
               colour4,
               colour5,
               colour6,
               colour7,
               colour8,
               colour9,
               colour10,
               colour11,
               colour12,
               colour13,
               colour14,
               colour15,
               colour16,
               totalColors,
               proposedMachine,
               prodRemarks,
               positiveRemarks,
               isActive,
               jcCustomerDetails: inputFields
            })
         )
      }
		
	}

   // 6. On "Successful" "FORM" submission navigate user to appropriate screen

   return (
      <FormContainer>
         <Breadcrumb
            listPage = "jcmasterlist"
         />
         <br></br>
         {loadingMasterData ? (
            <Loader />
         ) : errorRecord  ? (
            <Message variant='danger'>{ errorRecord }</Message>
         ) : (
            <>
               <FormFieldsContainer frameTitle = "Please Edit JC Details !!!" >   
                  <Form onSubmit={submitHandler}>
                     <Col>
                        {/* START of 1st row in the form */}
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='jcno'>
                              <Form.Label>Job Code #<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='jcno'
                                 readOnly
                                 placeholder=''
                                 value={jcno}
                                 onChange={(e) => setJCNo(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='jcProdCategory'>
                                 <Form.Label>Product Category<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    name='jcProdCategory'
                                    placeholder='Select Product Category'
                                    value={jcProdCategory}
                                    disabled
                                    onChange={(e) => handleProdCategory(e)}
                                 >
                                    <option value="none">Select Product Category</option>
                                    {productCategories!==undefined?(productCategories.map(prodcat => {
                                       return <option key={prodcat._id} value={prodcat._id}>{prodcat.name}</option>
                                    })):null}
                                 </Form.Control>
                                 <p className="validation-error">{errors.jcProdCategory}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='jcProdCode'>
                                 <Form.Label>Product Code<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    name='jcProdCode'
                                    placeholder='Select Product Code'
                                    value={jcProdCode}
                                    onChange={(e) => handleProdCode(e)}
                                 >
                                    <option value="none">Select Product Code</option>
                                    {prodCodes!==undefined?(prodCodes.map(prodcode => {
                                       return <option key={prodcode._id}  value={prodcode._id}>{prodcode.name}</option>
                                    })):null}
                                 </Form.Control>
                                 <p className="validation-error">{errors.jcProdCode}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* end of 1st row in the form */}
                        
                        {/* START of 2nd row in the form */}
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='jcDescription'>
                              <Form.Label>Job Code Name<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name="jcDescription"
                                 placeholder=''
                                 value={jcDescription}
                                 onChange={(e) => handlejcDescription(e.target.name, e.target.value)}
                                 isInvalid={ !!errors.jcDescription }
                              ></Form.Control>
                              <Form.Control.Feedback type='invalid' className="validation-error">
                                 { errors.jcDescription }
                              </Form.Control.Feedback>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='customerPartNumber'>
                              <Form.Label>Customer Part Number(CPN)</Form.Label>
                              <Form.Control
                                 type='text'
                                 name='customerPartNumber'
                                 placeholder=''
                                 value={customerPartNumber}
                                 onChange={(e) => setCustomerPartNumber(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='unit'>
                                 <Form.Label>Unit<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    name='unit'
                                    placeholder='Select Unit'
                                    value={unit}
                                    onChange={(e) => handleUnit(e)}
                                 >
                                    <option value="none">Select Unit</option>
                                    <option value="No.s">No.s</option>
                                    <option value="Set">Set</option>
                                    
                                 </Form.Control>
                                 <p className="validation-error">{errors.unit}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='hsn'>
                              <Form.Label>HSN/SAC Code<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 readOnly
                                 type='text'
                                 name='hsn'
                                 placeholder=''
                                 value={hsn}
                                 onChange={(e) => setHSN(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='isActive'>
                                 <Form.Label>Status<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    name='isActive'
                                    placeholder='Select'
                                    value={isActive}
                                    onChange={(e) => setIsActive(e.target.value)}
                                 >
                                    <option value="A">Active</option>
                                    <option value="I">Inactive</option>
                                 </Form.Control>
                                 <p className="validation-error">{errors.active}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* end of 2nd row in the form */}

                        {/* START of Actual Dimension Details in the form */}
                        <hr style={{ borderTop:"8px solid #ff6347", borderRadius:"0.35rem!important" }}></hr>
                        <Row>
                           <Col><h5>Actual Label Dimensions</h5></Col>
                        </Row>
                        <Row>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='artUOM'>
                                 <Form.Label>Unit of Measurement<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    name='artUOM'
                                    placeholder='Select Unit'
                                    value={artUOM}
                                    onChange={(e) => handleArtDim(e)}
                                 >
                                    <option value="none">Select Unit</option>
                                    {uoms!==undefined?(uoms.map(uom => {
                                       return <option key={uom._id}  value={uom.name}>{uom.name}</option>
                                    })):null}
                                 </Form.Control>
                                 <p className="validation-error">{errors.artUOM}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='adWidth'>
                              <Form.Label>Label Width <span className="mandatory"></span>
                                 <span style={{fontWeight:"bold"}}>{artUOMLabel.trim().length>0?"["+artUOMLabel+"]":""}</span>
                              </Form.Label>
                              <Form.Control
                                 type='text'
                                 name='adWidth'
                                 placeholder=''
                                 value={adWidth}
                                 onChange={(e) => setADWidth(e.target.value)}
                                 onBlur={(e) => calculateADArea(e)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='adHeight'>
                              <Form.Label>Label Height <span className="mandatory"></span>
                                 <span style={{fontWeight:"bold"}}>{artUOMLabel.trim().length>0?"["+artUOMLabel+"]":""}</span>
                              </Form.Label>
                              <Form.Control
                                 type='text'
                                 name='adHeight'
                                 placeholder=''
                                 value={adHeight}
                                 onChange={(e) => setADHeight(e.target.value)}
                                 onBlur={(e) => calculateADArea(e)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='adArea'>
                              <Form.Label>Label Area&nbsp;
                              <span style={{fontWeight:"bold"}}>{artUOMLabel.trim().length>0?""+artUOMLabel+"":""}
                              </span>{artUOMLabel.trim().length>0?<sup style={{fontWeight:"bold"}}>2</sup>:null}
                              </Form.Label>
                              <Form.Control
                                 readOnly
                                 type='text'
                                 name='adArea'
                                 placeholder=''
                                 value={adArea}
                                 onChange={(e) => setADArea(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>       
                        </Row>
                        <br></br>
                        {/* END of Actual Dimension Details in the form */}

                        {/* START of 3rd row in the form */}
                        <hr style={{ borderTop:"8px solid #ff6347", borderRadius:"0.35rem!important" }}></hr>
                        <Row>
                           <Col><h5>Production Layout Details</h5></Col>
                        </Row>
                        <br></br>
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='prodLayoutUOM'>
                                 <Form.Label>Unit of Measurement<span className="mandatory">* </span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    name='prodLayoutUOM'
                                    placeholder='Select Unit'
                                    value={prodLayoutUOM}
                                    onChange={(e) => handleProdLayoutUOM(e)}
                                 >
                                    <option value="none">Select</option>
                                    {uoms!==undefined?(uoms.map(uom => {
                                       return <option key={uom._id}  value={uom._id}>{uom.name}</option>
                                    })):null}
                                 </Form.Control>
                                 <p className="validation-error">{errors.prodLayoutUOM}</p>
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* end of 3rd row in the form */}
                        
                        {/* START of 4th row in the form */}
                        <Row>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='prodLayoutWidth'>
                              <Form.Label>Layout Width <span className="mandatory">* </span>
                                 <span style={{fontWeight:"bold"}}>{prodLayoutUOMLabel.trim().length>0?"["+prodLayoutUOMLabel+"]":""}</span>
                              </Form.Label>
                              <Form.Control
                                 className="numberInputStyle"
                                 type='number'
                                 name='prodLayoutWidth'
                                 placeholder=''
                                 value={prodLayoutWidth}
                                 onChange={(e) => handleLayoutWidth(e.target.value)}
                                 onBlur={(e) => manageBOMArea(e.target.value)}
                              ></Form.Control>
                              <p className="validation-error">{errors.prodLayoutWidth}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='prodLayoutHeight'>
                              <Form.Label>Layout Height <span className="mandatory">*  </span>
                                 <span style={{fontWeight:"bold"}}>{prodLayoutUOMLabel.trim().length>0?"["+prodLayoutUOMLabel+"]":""}</span>
                              </Form.Label>
                              <Form.Control
                                 className="numberInputStyle"
                                 type='number'
                                 name='prodLayoutHeight'
                                 placeholder=''
                                 value={prodLayoutHeight}
                                 onChange={(e) => handleLayoutHeight(e.target.value)}
                                 onBlur={(e) => manageBOMArea(e.target.value)}
                              ></Form.Control>
                              <p className="validation-error">{errors.prodLayoutHeight}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='prodLayoutArea'>
                              <Form.Label>Layout Area <span className="mandatory">* </span>
                                 <span 
                                    style={{fontWeight:"bold"}}>{prodLayoutUOMLabel.trim().length>0?""+prodLayoutUOMLabel+"":""}
                                 </span>{prodLayoutUOMLabel.trim().length>0?<sup style={{fontWeight:"bold"}}>2</sup>:null}
                              </Form.Label>
                              <Form.Control
                                 readOnly
                                 type='text'
                                 name='prodLayoutArea'
                                 placeholder=''
                                 value={prodLayoutArea}
                                 onChange={(e) => handleLayoutHeight(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>   
                        </Row>
                        {/* end of 4th row in the form */}
                        
                        {/* START of 5th row in the form */}
                        <Row>
                           <Col lg={4} md={12} xs={12} >
                              <Form.Group controlId='prodLayoutWidthUps' >
                                 <Form.Label>Width Ups<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    className="numberInputStyle"
                                    type='number'
                                    name='prodLayoutWidthUps'
                                    placeholder=''
                                    value={prodLayoutWidthUps}
                                    onChange={(e) => handleLayoutWidthUps(e.target.value)}
                                    onBlur={(e) => manageBOMArea(e.target.value)}
                                 ></Form.Control>
                                 <p className="validation-error">{errors.prodLayoutWidthUps}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='prodLayoutHeightUps'>
                                 <Form.Label>Height Ups<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    className="numberInputStyle"
                                    type='number'
                                    name='prodLayoutHeightUps'
                                    placeholder=''
                                    value={prodLayoutHeightUps}
                                    onChange={(e) => handleLayoutHeightUps(e.target.value)}
                                    onBlur={(e) => manageBOMArea(e.target.value)}
                                 ></Form.Control>
                                 <p className="validation-error">{errors.prodLayoutHeightUps}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={4} md={12} xs={12}>
                              <Form.Group controlId='prodLayoutTotalUps'>
                              <Form.Label>Total Ups<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 readOnly
                                 type='text'
                                 name='prodLayoutTotalUps'
                                 placeholder=''
                                 value={prodLayoutTotalUps}
                                 onChange={(e) => setProdLayoutTotalUps(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>   
                        </Row>
                        {/* end of 5th row in the form */}
                        <br></br>
                        <hr style={{ borderTop:"8px solid #ff6347", borderRadius:"0.35rem!important" }}></hr>
                        
                        {/* START of 6th row in the form */}
                        <Row>
                           <Col><h5>BOM Dimensions</h5></Col>
                        </Row>
                        <Row>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='bomUOM'>
                                 <Form.Label>Unit of Measurement<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    name='bomUOM'
                                    placeholder='Select Unit'
                                    value={bomUOM}
                                    onChange={(e) => handlebomUOM(e.target.value)}
                                    disabled={(
                                          prodLayoutUOMLabel.trim().length === 0 || 
                                          prodLayoutArea === 0 || 
                                          prodLayoutTotalUps === 0
                                       )
                                    }
                                 >
                                    <option value="none">Select Unit</option>
                                    {uoms!==undefined?(uoms.map(uom => {
                                       return <option key={uom._id}  value={uom._id}>{uom.name}</option>
                                    })):null}
                                 </Form.Control>
                                 <p className="validation-error">{errors.bomUOM}</p>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='bomWidth'>
                              <Form.Label>Width <span className="mandatory"></span>
                                 <span style={{fontWeight:"bold"}}>{bomUOMLabel.trim().length>0?"["+bomUOMLabel+"]":""}</span>
                              </Form.Label>
                              <Form.Control
                                 readOnly
                                 type='text'
                                 name='bomWidth'
                                 placeholder=''
                                 value={bomWidth}
                                 onChange={(e) => setbomWidth(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='bomHeight'>
                              <Form.Label>Height <span className="mandatory"></span>
                                 <span style={{fontWeight:"bold"}}>{bomUOMLabel.trim().length>0?"["+bomUOMLabel+"]":""}</span>
                              </Form.Label>
                              <Form.Control
                                 readOnly
                                 type='text'
                                 name='bomHeight'
                                 placeholder=''
                                 value={bomHeight}
                                 onChange={(e) => setbomHeight(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='bomArea'>
                              <Form.Label>
                                 BOM Area(OD) <span className="mandatory"></span>
                                 <span style={{fontWeight:"bold"}}>{bomUOMLabel.trim().length>0?""+bomUOMLabel+"":""}
                                 </span>{bomUOMLabel.trim().length>0?<sup style={{fontWeight:"bold"}}>2</sup>:null}
                              </Form.Label>
                              <Form.Control
                                 readOnly
                                 type='text'
                                 name='bomArea'
                                 placeholder=''
                                 value={bomArea}
                                 onChange={(e) => setbomArea(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>       
                        </Row>
                        {/* end of 6th row in the form */}
                        
                        {/* START of 7th row in the form */}
                        <br></br>
                        <hr style={{ borderTop:"8px solid #ff6347", borderRadius:"0.35rem!important" }}></hr>
                        <Row>
                           <Col><h5>Colours</h5></Col>
                        </Row>
                        <Row>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='colour1'>
                              <Form.Label>Colour 1<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='colour1'
                                 placeholder=''
                                 value={colour1}
                                 onChange={(e) => setColour1(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='colour2'>
                              <Form.Label>Colour 2<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='colour2'
                                 placeholder=''
                                 value={colour2}
                                 onChange={(e) => setColour2(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='colour3'>
                              <Form.Label>Colour 3<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='colour3'
                                 placeholder=''
                                 value={colour3}
                                 onChange={(e) => setColour3(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='colour4'>
                              <Form.Label>Colour 4<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='colour4'
                                 placeholder=''
                                 value={colour4}
                                 onChange={(e) => setColour4(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* end of 7th row in the form */}
                        
                        {/* START of 8th row in the form */}
                        <Row>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='colour5'>
                              <Form.Label>Colour 5<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='colour5'
                                 placeholder=''
                                 value={colour5}
                                 onChange={(e) => setColour5(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='colour6'>
                              <Form.Label>Colour 6<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='colour6'
                                 placeholder=''
                                 value={colour6}
                                 onChange={(e) => setColour6(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='colour7'>
                              <Form.Label>Colour 7<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='colour7'
                                 placeholder=''
                                 value={colour7}
                                 onChange={(e) => setColour7(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='colour8'>
                              <Form.Label>Colour 8<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='colour8'
                                 placeholder=''
                                 value={colour8}
                                 onChange={(e) => setColour8(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* end of 8th row in the form */}
                        
                        {/* START of 9th row in the form */}
                        <Row>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='colour9'>
                              <Form.Label>Colour 9<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='colour9'
                                 placeholder=''
                                 value={colour9}
                                 onChange={(e) => setColour9(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='colour10'>
                              <Form.Label>Colour 10<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='colour10'
                                 placeholder=''
                                 value={colour10}
                                 onChange={(e) => setColour10(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='colour11'>
                              <Form.Label>Colour 11<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='colour11'
                                 placeholder=''
                                 value={colour11}
                                 onChange={(e) => setColour11(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='colour12'>
                              <Form.Label>Colour 12<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='colour12'
                                 placeholder=''
                                 value={colour12}
                                 onChange={(e) => setColour12(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* end of 9th row in the form */}
                        
                        {/* START of 10th row in the form */}
                        <Row>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='colour13'>
                              <Form.Label>Colour 13<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='colour13'
                                 placeholder=''
                                 value={colour13}
                                 onChange={(e) => setColour13(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='colour14'>
                              <Form.Label>Colour 14<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='colour14'
                                 placeholder=''
                                 value={colour14}
                                 onChange={(e) => setColour14(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='colour15'>
                              <Form.Label>Colour 15<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='colour15'
                                 placeholder=''
                                 value={colour15}
                                 onChange={(e) => setColour15(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='colour16'>
                              <Form.Label>Colour 16<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='colour16'
                                 placeholder=''
                                 value={colour16}
                                 onChange={(e) => setColour16(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* end of 10th row in the form */}
                        
                        {/* START of 11th row in the form */}
                        <Row>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='totalColors'>
                              <Form.Label>Total No. of Colors<span className="mandatory">*</span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='totalColors'
                                 placeholder=''
                                 value={totalColors}
                                 onChange={(e) => setTotalColors(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>
                           <Col lg={3} md={12} xs={12}>
                              <Form.Group controlId='proposedMachine'>
                                 <Form.Label>Proposed Machine<span className="mandatory">*</span></Form.Label>
                                 <Form.Control
                                    as='select'
                                    custom
                                    name='proposedMachine'
                                    placeholder='Select Unit'
                                    value={proposedMachine}
                                    onChange={(e) => setProposedMachine(e.target.value)}
                                 >
                                    {machineMasters!==undefined?(machineMasters.map(machineMaster => {
                                       return <option key={machineMaster._id}  value={machineMaster._id}>{machineMaster.name}</option>
                                    })):null}
                                 </Form.Control>
                              </Form.Group>
                           </Col> 
                           <Col lg={6} md={12} xs={12}>
                              <Form.Group controlId='prodRemarks'>
                              <Form.Label>Production Remarks<span className="mandatory"></span></Form.Label>
                              <Form.Control
                                 type='text'
                                 name='prodRemarks'
                                 placeholder=''
                                 value={prodRemarks}
                                 onChange={(e) => setProdRemarks(e.target.value)}
                              ></Form.Control>
                              </Form.Group>
                           </Col>  
                        </Row>
                        {/* end of 11th row in the form */}
                        
                        {/* START of 11th row in the form */}
                        <Row>
                           <Col lg={12} md={12} xs={12}>
                              <Form.Group controlId='positiveRemarks'>
                                 <Form.Label>Positive Remarks<span className="mandatory"></span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='positiveRemarks'
                                    placeholder=''
                                    value={positiveRemarks}
                                    onChange={(e) => setPositiveRemarks(e.target.value)}
                                 ></Form.Control>
                              </Form.Group>
                           </Col>
                        </Row>
                        {/* end of 11th row in the form */}

                        {/* START of 12th row in the form */}
                        <br></br>
                        <hr style={{ borderTop:"8px solid #ff6347", borderRadius:"0.35rem!important" }}></hr>
                        <Row>
                           <Col lg={6} md={12} xs={12}><h5>Customer Wise Selling Price</h5></Col>
                           <Col lg={2} md={12} xs={12} style={{textAlign:"end"}}>
                              
                           </Col>
                           <Col lg={4} md={12} xs={12} style={{textAlign:"end"}}>
                              <Button
                                 className="btn-md"
                                 onClick={handleAddFields}
                              >Add Customer</Button>
                           </Col>
                        </Row>
                        { inputFields.map(inputField => (
                           <Row className="my-2" key={inputField.id}>
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='customerId'>
                                    <Form.Label>Customer<span className="mandatory">*</span></Form.Label>
                                    <Form.Control
                                       as='select'
                                       custom
                                       placeholder='Select Customer'
                                       value={inputField.customerId}
                                       name="customerId"
                                       onChange={event => handleChangeInput(inputField.id, event)}
                                    >
                                       <option value="none">Select</option>
                                       {customers!==undefined?(customers.map(customer => {
                                          return <option key={customer._id}  value={customer._id}>{customer.custName}</option>
                                       })):null}
                                    </Form.Control>
                                    <p className="validation-error">{errors.customerId}</p>
                                 </Form.Group>
                              </Col>
                              <Col lg={4} md={12} xs={12}>
                                 <Form.Group controlId='customerPrice'>
                                    <Form.Label>Price Exclusive Of GST <span><b>₹</b></span><span className="mandatory">*</span></Form.Label>
                                    <Form.Control
                                       type='text'
                                       placeholder=''
                                       value={inputField.customerPrice}
                                       name="customerPrice"
                                       onChange={event => handleChangeInput(inputField.id, event)}
                                    ></Form.Control>
                                    <p className="validation-error">{errors.customerPrice}</p>
                                 </Form.Group>
                              </Col>
                              <Col 
                                 style={{ display: (inputField.customer!==undefined?(inputField.customer.trim() !== "C0022" ? 'none' : 'block'):"") }}
                                 lg={3} md={12} xs={12}>
                                 <Form.Group controlId='tmo'>
                                 <Form.Label>Tentative Monthly Offtake<span className="mandatory"></span></Form.Label>
                                 <Form.Control
                                    type='number'
                                    name='tmo'
                                    value={inputField.tmo}
                                    onChange={event => handleChangeInput(inputField.id, event)}
                                 ></Form.Control>
                                 <p className="validation-error">{errors.tmo}</p>
                                 </Form.Group>
                              </Col>
                              <Col 
                                 style={{ display: (inputField.customer!==undefined?(inputField.customer.trim() !== "C0022" ? 'none' : 'block'):"") }}
                                 lg={3} md={12} xs={12}>
                                 <Form.Group controlId='customerPONumber'>
                                 <Form.Label>P.O. #<span className="mandatory"></span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='customerPONumber'
                                    value={inputField.customerPONumber}
                                    onChange={event => handleChangeInput(inputField.id, event)}
                                 ></Form.Control>
                                 <p className="validation-error">{errors.customerPONumber}</p>
                                 </Form.Group>
                              </Col>
                              <Col 
                                 style={{ display: (inputField.customer!==undefined?(inputField.customer.trim() !== "C0022" ? 'none' : 'block'):"") }}
                                 lg={3} md={12} xs={12}>
                                 <Form.Group controlId='customerPODate'>
                                 <Form.Label>P.O. Date<span className="mandatory"></span></Form.Label>
                                 <DatePicker 
                                    className="form-control"
                                    dateFormat="dd-MMM-yyyy" 
                                    name='customerPODate'
                                    selected={new Date(inputField.customerPODate)} 
                                    onChange={event => handleChangeInput(inputField.id, event, 'customerPODate')}
                                    maxDate={new Date()}
                                 />
                                 <p className="validation-error">{errors.customerPODate}</p>
                                 </Form.Group>
                              </Col>
                              <Col 
                                 style={{ display: (inputField.customer!==undefined?(inputField.customer.trim() !== "C0022" ? 'none' : 'block'):"") }}
                                 lg={2} md={12} xs={12}>
                                 <Form.Group controlId='revision'>
                                 <Form.Label>Revision #<span className="mandatory"></span></Form.Label>
                                 <Form.Control
                                    type='text'
                                    name='revision'
                                    value={inputField.revision}
                                    onChange={event => handleChangeInput(inputField.id, event)}
                                 ></Form.Control>
                                 <p className="validation-error">{errors.revision}</p>
                                 </Form.Group>
                              </Col>
                              <Col 
                                 style={{ display: (inputField.customer!==undefined?(inputField.customer.trim() !== "C0022" ? 'none' : 'block'):"") }}
                                 lg={2} md={12} xs={12}>
                                 <Form.Group controlId='isCustomerPOActive'>
                                    <Form.Label>Active<span className="mandatory">*</span></Form.Label>
                                    <Form.Control
                                       as='select'
                                       custom
                                       name='isCustomerPOActive'
                                       placeholder='Select'
                                       value={inputField.isCustomerPOActive}
                                       onChange={event => handleChangeInput(inputField.id, event)}
                                    >
                                       <option value="Yes">Yes</option>
                                       <option value="No">No</option>
                                    </Form.Control>
                                    <p className="validation-error">{errors.active}</p>
                                 </Form.Group>
                           </Col>
                              <Col lg={(inputField.customer!==undefined?(inputField.customer.trim() !== "C0022" ? 4 : 2):2)} md={12} xs={12} style={{textAlign:"end"}}>
                                 <Button
                                    variant="danger" 
                                    className="btn-md"
                                    style={{marginTop:"25px", textAlign:"end"}}
                                    disabled={inputFields.length === 1} 
                                    onClick={() => handleRemoveFields(inputField.id)}
                                 > Remove </Button>
                                 
                              </Col>
                           </Row>
                        )) }
                        <br></br>
                        
                        {/* end of 12th row in the form */}

                        {/* START of 12th row in the form */}
                        <Row>
                           <Col style={{textAlign:"end"}}>
                              <Button type='reset' className='reset-button-class mx-3 my-3 btn-md' onClick={handleReset}><i className="fas fa-undo"></i> Reset</Button>
                              <Button type='submit' className=' my-3 btn-md button-class' onClick={(e) => e.currentTarget.blur()}><i className="fas fa-save"></i> Save</Button>
                           </Col>
                        </Row>
                        <Row>
                                    
                        </Row>
                        {/* end of 12th row in the form */}
                        

                     </Col>
                  </Form>
               </FormFieldsContainer>
            </>
         )}
      </FormContainer>
   )
}

export default EditJCMasterScreen
