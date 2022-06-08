import React from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom';
//Application Custom Components
import MakeTable from '../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const DeliveryNoteTable = ({ data }) => {

   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false
      },
      {
        Header: 'Invoice #',
        Footer: 'Invoice #',
        accessor: 'salesInvoiceNumber.salesInvoiceNumber',
        disableFilters: true,
      },
      {
         Header: 'Customer Name',
         Footer: 'Customer Name',
         accessor: 'customer.custName',
         disableFilters: true,
         // Cell: ({ value }) => {
         //    return parseFloat(value).toFixed(2)
         // }
      },
      {
         Header: 'State of Supply',
         Footer: 'State of Supply',
         accessor: 'salesInvoiceNumber.billState',
         disableFilters: true,
      },
      {
         Header: 'Total Boxes',
         Footer: 'Total Boxes',
         accessor: 'totalBoxes',
         disableFilters: true,
      },
      {
         Header: 'Total Weight (Kgs)',
         Footer: 'Total Weight (Kgs)',
         accessor: 'totalBoxWeight',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'Edit',
         Footer: 'Edit',
         accessor: '',
         disableFilters: true,
         Cell: ({row}) => (
          <>
             <div>
                <Link to={`/deliverynote/${row.allCells[0].value}/edit`}>
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
      }
   ]
   
   return (
     
      <MakeTable
         tableColumns={tableColumns}
         tabledata={data} 
         exportFileName = "delivery_note_details"
      />
         
   )
}

export default DeliveryNoteTable
