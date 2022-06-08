import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const SalesOrderTable = ({ data }) => {

   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false
      },
      {
        Header: 'SO #',
        Footer: 'SO #',
        accessor: 'soNumber',
        disableFilters: true,
        //disableFilters: false,
      //   sticky: 'left'
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
         Header: 'PO #',
         Footer: 'PO #',
         accessor: 'poNumber',
         disableFilters: true,
      },
      {
         Header: 'PO Date',
         Footer: 'PO Date',
         accessor: 'poDate',
         disableFilters: true,
         Cell: ({ value }) => {
               return format(new Date(value), 'dd-MMM-yyyy')
          }
      },
      {
         Header: 'Customer Name',
         Footer: 'Customer Name',
         accessor: 'customer.custName',
         disableFilters: true,
      },
      {
         Header: 'SO Value (₹)',
         Footer: 'SO Value (₹)',
         accessor: 'soTotalAmount',
         disableFilters: true,
         Cell: ({ value }) => {
            return value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
         }
      },
      {
         Header: 'View',
         Footer: 'View',
         accessor: '',
         disableFilters: true,
         Cell: ({row}) => (
          <>
             <div>
                <Link to={`/salesorders/${row.allCells[0].value}/view`}>
                   <span className = "tableIcon">
                      <i 
                         className = "fas fa-eye" 
                         style={{color:"green", fontSize:"1.5rem", }}>
                      </i>
                   </span>
                </Link>
             </div>
          </>
         )
      },
      {
         Header: 'Cancel',
         Footer: 'Cancel',
         accessor: '',
         disableFilters: true,
         Cell: ({row}) => (
          <>
             <div>
                <Link to={`/salesorders/${row.allCells[0].value}/cancel`}>
                   <span className = "tableIcon">
                      <i 
                         className = "far fa-window-close" 
                         style={{color:"red", fontSize:"1.5rem", }}>
                      </i>
                   </span>
                </Link>
             </div>
          </>
         )
      }
      
      // {
      //   Header: 'Edit',
      //   Footer: 'Edit',
      //   accessor: '',
      //   disableFilters: true,
      //   Cell: ({row}) => (
      //    <>
      //       <div>
      //          <Link to={`/salesorders/${row.allCells[0].value}/edit`}>
      //             <span className = "tableIcon">
      //                <i 
      //                   className = "fas fa-edit" 
      //                   style={{color:"green", fontSize:"1.5rem", }}>
      //                </i>
      //             </span>
      //          </Link>
      //       </div>
      //    </>
      //   )
      // }
   ]
   
   return (
     
      <MakeTable
         tableColumns={tableColumns}
         tabledata={data} 
         exportFileName = "sales_order"
      />
         
   )
}

export default SalesOrderTable
