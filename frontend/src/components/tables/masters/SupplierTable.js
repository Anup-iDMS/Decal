//React Components
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import './../css/table.css'

//Application Custom Components
import SupplierAddressModal from '../../modals/SupplierAddressModal.js'
import MakeTable from './../formtable/MakeTable'

//CSS properties for table
import './../css/table.css'

const SupplierTable = ({ suppliers, onDelete }) => {
  const [showSupplierAddressModal, setShowSupplierAddressModal] =
    useState(false)
  const [supplierData, setSupplierData] = useState({})

  const handleClose = () => setShowSupplierAddressModal(false)
  const handleShow = (row) => {
    setSupplierData(suppliers[row])
    setShowSupplierAddressModal(true)
  }

  const tableColumns = [
    {
      Header: 'deva',
      Footer: 'deva',
      accessor: '_id',
      disableFilters: true,
      show: false,
    },
    {
      Header: 'Supplier Code',
      Footer: 'Supplier Code',
      accessor: 'supplierCode',
      disableFilters: true,
    },
    {
      Header: 'Supplier Name',
      Footer: 'Supplier Name',
      accessor: 'supplierName',
      disableFilters: true,
    },
    {
      Header: 'GSTIN',
      Footer: 'GSTIN',
      accessor: 'supplierGST',
      disableFilters: true,
    },
    {
      Header: 'State of Supply',
      Footer: 'State of Supply',
      accessor: 'supplierShipingAddress[0].supplierShipState',
      disableFilters: true,
    },
    {
      Header: 'Contact Person',
      Footer: 'Contact Person',
      accessor: 'supplierContactPersonName',
      disableFilters: true,
    },
    {
      Header: 'View Address',
      Footer: 'View Address',
      accessor: 'hsn',
      disableFilters: true,
      Cell: ({ row }) => (
        <div>
          <span className='tableIcon'>
            <i
              onClick={() => {
                handleShow(row.index)
              }}
              className='fas fa-address-card'
              style={{ color: 'red', fontSize: '1.5rem' }}
            ></i>
          </span>
        </div>
      ),
    },
    {
      Header: 'Edit',
      Footer: 'Edit',
      accessor: '',
      disableFilters: true,
      Cell: ({ row }) => (
        <div>
          <Link to={`/suppliers/${row.allCells[0].value}/edit`}>
            <span className='tableIcon'>
              <i
                className='fas fa-edit'
                style={{ color: 'green', fontSize: '1.5rem' }}
              ></i>
            </span>
          </Link>
        </div>
      ),
    },
    {
      Header: 'Delete',
      Footer: 'Delete',
      accessor: 'Delete',
      disableFilters: true,
      show: false,
    },
  ]

  return (
    <>
      <>
        <SupplierAddressModal
          onShow={showSupplierAddressModal}
          supplierData={supplierData}
          onClose={handleClose}
        />
        <MakeTable
          tableColumns={tableColumns}
          tabledata={suppliers}
          exportFileName='supplier_master'
        />
      </>
    </>
  )
}

export default SupplierTable
