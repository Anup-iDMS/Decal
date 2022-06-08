//React Components
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './../css/table.css';

//Application Custom Components
import CustomerAddressModal from '../../modals/CustomerAddressModal';
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const CustomerTable = ({ customers, onDelete }) => {

  const [showCustAddressModal, setShowCustAddressModal] = useState(false);
  const [customerData, setCustomerData] = useState({});

  const handleClose = () => setShowCustAddressModal(false);
  const handleShow = (row) => {
    setCustomerData(customers[row])
    setShowCustAddressModal(true);
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
      Header: 'Customer Code',
      Footer: 'Customer Code',
      accessor: 'custCode',
      disableFilters: true,
      
    },
    {
      Header: 'Customer Name',
      Footer: 'Customer Name',
      accessor: 'custName',
      disableFilters: true,
    },
    {
      Header: 'GSTIN',
      Footer: 'GSTIN',
      accessor: 'custGST',
      disableFilters: true,
    },
    {
      Header: 'State of Supply',
      Footer: 'State of Supply',
      accessor: 'custShipingAddress[0].custShipState',
      disableFilters: true,
    },
    {
      Header: 'Contact Person',
      Footer: 'Contact Person',
      accessor: 'custContactPersonName',
      disableFilters: true,
    },
    {
      Header: 'View Address',
      Footer: 'View Address',
      accessor: 'hsn',
      disableFilters: true,
      Cell: ({row}) => (
        <div >
          <span className = "tableIcon">
            <i 
              onClick={ () => {handleShow(row.index)} } 
              className = "fas fa-address-card" 
              style={{color:"red", fontSize:"1.5rem", }}>
            </i>
          </span>
        </div>
      )
    },
    {
      Header: 'Edit',
      Footer: 'Edit',
      accessor: '',
      disableFilters: true,
      Cell: ({row}) => (
        <div>
          <Link to={`/customers/${row.allCells[0].value}/edit`}>
            <span className = "tableIcon">
              <i 
                className = "fas fa-edit" 
                style={{color:"green", fontSize:"1.5rem", }}>
              </i>
            </span>
          </Link>
        </div>
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
    <>
      <> 
        <CustomerAddressModal onShow={showCustAddressModal} customerData={customerData} onClose={handleClose} />
        <MakeTable
          tableColumns={tableColumns}
          tabledata={customers} 
          exportFileName = "customer_master"
        />
      </>
    </>
  )
}

export default CustomerTable
