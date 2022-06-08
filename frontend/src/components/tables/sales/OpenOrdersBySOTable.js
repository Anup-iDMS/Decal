import React, { useState } from 'react'
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

import SOCancelConfirmModal from './../../modals/SOCancelConfirmModal';

const OpenOrdersBySOTable = ({ data, submitCancelSO }) => {

   const [showCustProdLayoutModal, setShowCustProdLayoutModal] = useState(false);
   const [soLineItemData, setSOLineItemData] = useState({});
   const [rowIndex, setRowIndex] = useState(-1);

   const handleClose = () => setShowCustProdLayoutModal(false);
   const handleShow = (row) => {
      console.log("Selected Row ==== ", row)
      console.log("Selected Row Data ==== ", data[row])
      setSOLineItemData(data[row])
      setShowCustProdLayoutModal(true);
      setRowIndex(row)
   }

   const handleSubmit = (canceledReason) => {
      console.log("inside handleSubmit and selected Row is ==== ", rowIndex)
      console.log("inside handleSubmit and don't know what I get ==== ", canceledReason)
      submitCancelSO(rowIndex, canceledReason)
   };

   const removeColumns = ['customer'];

   const headings = [
      'SO #',
      'SO Date',
      'Line #',
      'JC #',
      'JC Description',
      'Ordered Qty',
      'Invoiced Qty',
      'Balance Qty',
      'Balance Value',
      'Unit Rate',
      'SO Line Value'

   ];

   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false
      },
      {
         Header: 'SO Date',
         Footer: 'SO Date',
         accessor: 'soDate',
         disableFilters: true,
         Cell: ({ value }) => {
               return format(new Date(value), 'dd-MMM-yyyy')
          }
      },
      {
        Header: 'SO #',
        Footer: 'SO #',
        accessor: 'soNumber',
        disableFilters: true,
      },
      {
         Header: 'Line #',
         Footer: 'Line #',
         accessor: 'lineNumber',
         disableFilters: true,
      },
      {
         Header: 'JC #',
         Footer: 'JC #',
         accessor: 'jcno',
         disableFilters: true,
      },
      {
         Header: 'JC Description',
         Footer: 'JC Description',
         accessor: 'jcDescription',
         disableFilters: true,
         Cell: row => <div style={{ textAlign: "left" }}>{row.value}</div>
      },
      {
         Header: 'Bal Qty',
         Footer: 'Bal Qty',
         accessor: 'balancedQty',
         disableFilters: true,
      },
      {
         Header: 'Bal Value (₹)',
         Footer: 'Bal Value (₹)',
         accessor: 'balanceValue',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'Customer Name',
         Footer: 'Customer Name',
         accessor: 'name',
         disableFilters: true,
         Cell: row => <div style={{ textAlign: "left" }}>{row.value}</div>
      },
      {
         Header: 'Cancel SO Line #',
         Footer: 'Cancel SO Line #',
         accessor: '',
         disableFilters: true,
         Cell: ({row}) => (
          <div>
             <span className = "tableIcon">
             <i 
                onClick={ () => {handleShow(row.index)} } 
                className = "far fa-window-close" 
                style={{color:"red", fontSize:"1.5rem", }}>
             </i>
             </span>
          </div>
          )
      },
   ]
   
   return (
      <React.Fragment>
         <SOCancelConfirmModal 
            onShow={showCustProdLayoutModal} 
            soLineItemData={soLineItemData} 
            onClose={handleClose} 
            onSubmit={handleSubmit} 
         />
         <MakeTable
            tableColumns={tableColumns}
            tabledata={data} 
            exportFileName = "open_order_report_by_SO"
            //removeColumns = {removeColumns}
            headings = {headings}
         />
      </React.Fragment>
   )
}

export default OpenOrdersBySOTable
