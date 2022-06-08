//React Components
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

//Application Custom Components
import MakeTable from './../formtable/MakeTable';
import JCProdLayoutModal from '../../modals/JCProdLayoutModal';

//CSS properties for table
import './../css/table.css'

const JCMasterTable = ({ data }) => {
   const [showCustProdLayoutModal, setShowCustProdLayoutModal] = useState(false);
   const [prodLayoutData, setProdLayoutData] = useState({});

   const handleClose = () => setShowCustProdLayoutModal(false);
   const handleShow = (row) => {
      setProdLayoutData(data[row])
      setShowCustProdLayoutModal(true);
   }

   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false
       },
      {
        Header: 'JC#',
        Footer: 'JC#',
        accessor: 'jcno',
        disableFilters: true,
      },
      {
        Header: 'Product Category',
        Footer: 'Product Category',
        accessor: 'jcProdCategory.name',
        disableFilters: true,
      },
      {
        Header: 'Product Type',
        Footer: 'Product Type',
        accessor: 'jcProdCode.name',
        disableFilters: true,
      },
      {
        Header: 'JC Description',
        Footer: 'JC Description',
        accessor: 'jcDescription',
        disableFilters: true,
 
      },
      {
        Header: 'PL Layout Details',
        Footer: 'PL Layout Details',
        accessor: '',
        disableFilters: true,
        Cell: ({row}) => (
         <div>
            <span className = "tableIcon">
            <i 
               onClick={ () => {handleShow(row.index)} } 
               className = "fas fa-th-large" 
               style={{color:"red", fontSize:"1.5rem", }}>
            </i>
            </span>
         </div>
         )
      },
      {
        Header: 'HSN/SAC',
        Footer: 'HSN/SAC',
        accessor: 'hsn',
        disableFilters: true,
      },
      {
        Header: 'Edit',
        Footer: 'Edit',
        accessor: '',
        disableFilters: true,
        width: "5%",
        Cell: ({row}) => (
         <>
            <div>
               <Link to={`/jcmasters/${row.allCells[0].value}/edit`}>
                  <span className = "tableIcon">
                     <i 
                        className = "fas fa-edit" 
                        style={{color:"green", fontSize:"1.5rem", }}>
                     </i>
                  </span>
               </Link>
            </div>
         </>
        )
      },
      {
        Header: 'Delete',
        Footer: 'Delete',
        accessor: 'Delete',
        disableFilters: true,
        show: false
      },
   ]

   return (
      <React.Fragment> 
         <JCProdLayoutModal 
            onShow={showCustProdLayoutModal} 
            jcData={prodLayoutData} 
            onClose={handleClose} 
         />
         <MakeTable
            tableColumns={tableColumns}
            tabledata={data} 
            exportFileName = "jc_master"
         />
      </React.Fragment>
   )
}

export default JCMasterTable
