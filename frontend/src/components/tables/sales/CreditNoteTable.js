import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from '../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const CreditNoteTable = ({ data }) => {

   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false
      },
      {
        Header: 'Credit Note #',
        Footer: 'Credit Note #',
        accessor: 'creditNoteNumber',
        disableFilters: true,
      },
      {
         Header: 'Credit Note Date',
         Footer: 'Credit Note Date',
         accessor: 'creditNoteDate',
         disableFilters: true,
         Cell: ({ value }) => {
               return format(new Date(value), 'dd-MMM-yyyy')
          }
      },
      {
         Header: 'Credit Amount (₹)',
         Footer: 'Credit Amount (₹)',
         accessor: 'creditNoteAmount',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'Total Tax (₹)',
         Footer: 'Total Tax (₹)',
         accessor: 'creditNoteTotalTaxAmount',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'Total Credit Amount (₹)',
         Footer: 'Total Credit Amount (₹)',
         accessor: 'creditNoteTotalAmountWithTax',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'Customer Name',
         Footer: 'Customer Name',
         accessor: 'customer.custName',
         disableFilters: true,
      },
      {
        Header: 'Edit',
        Footer: 'Edit',
        accessor: '',
        disableFilters: true,
        Cell: ({row}) => (
         <React.Fragment>
            <div>
               <Link to={`/creditnote/${row.allCells[0].value}/edit`}>
                  <span className = "tableIcon">
                     <i 
                        className = "fas fa-edit" 
                        style={{color:"green", fontSize:"1.5rem", }}>
                     </i>
                  </span>
               </Link>
            </div>
         </React.Fragment>
        )
      },
      {
         Header: 'Print',
         Footer: 'Print',
         accessor: '',
         disableFilters: true,
         Cell: ({row}) => (
          <React.Fragment>
             <div>
                <Link to={`/creditnote/${row.allCells[0].value}/print`} target="_blank" rel="noopener noreferrer">
                  <span className = "tableIcon">
                     <i 
                        className = "fas fa-print" 
                        style={{color:"red", fontSize:"1.5rem", }}>
                     </i>
                  </span>
                </Link>
             </div>
          </React.Fragment>
         )
      }
 
   ]
   
   return (
     
      <MakeTable
         tableColumns={tableColumns}
         tabledata={data} 
         exportFileName = "credit_note_details"
      />
         
   )
}

export default CreditNoteTable
