import React from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom';
//Application Custom Components
import MakeTable from '../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const DispatchDetailsTable = ({ data }) => {

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
         Header: 'Invoice Value',
         Footer: 'Invoice Value',
         accessor: 'salesInvoiceNumber.salesInvoiceTotalAmountWithTax',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'Transporter',
         Footer: 'Transporter',
         accessor: 'transporter',
         disableFilters: true,
      },
      {
         Header: 'Docket #',
         Footer: 'Docket #',
         accessor: 'docketNumber',
         disableFilters: true,
      },
      {
         Header: 'Freight Charges (₹)',
         Footer: 'Freight Charges (₹)',
         accessor: 'freightCharges',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'Freight Rate (%)',
         Footer: 'Freight Rate (%)',
         accessor: 'freightPercent',
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
                <Link to={`/dispatchdetails/${row.allCells[0].value}/edit`}>
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
         Header: 'Print',
         Footer: 'Print',
         accessor: '',
         disableFilters: true,
         Cell: ({row}) => (
          <React.Fragment>
             <div>
                <Link to={`/dispatchdetails/${row.allCells[0].value}/print`} target="_blank" rel="noopener noreferrer">
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
         exportFileName = "dispatch_details"
      />
         
   )
}

export default DispatchDetailsTable
