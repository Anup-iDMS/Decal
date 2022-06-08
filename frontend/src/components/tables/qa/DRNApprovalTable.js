import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from '../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const DRNApprovalTable = ({ data }) => {

   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false
      },
      {
        Header: 'DRN #',
        Footer: 'DRN #',
        accessor: 'drnNumber',
        disableFilters: true,
      },
      {
        Header: 'DRN Date',
        Footer: 'DRN Date',
        accessor: 'drnDate',
        disableFilters: true,
        Cell: ({ value }) => {
              return format(new Date(value), 'dd-MMM-yyyy')
         }
      },
      // {
      //    Header: 'Total DRN Value (₹)',
      //    Footer: 'Total DRN Value (₹)',
      //    accessor: 'drnTotalAmount',
      //    disableFilters: true,
      //    Cell: ({ value }) => {
      //       return parseFloat(value).toFixed(2)
      //    }
      // },
      {
         Header: 'Customer Name',
         Footer: 'Customer Name',
         accessor: 'customer.custName',
         disableFilters: true,
      },
      // {
      //    Header: 'Status',
      //    Footer: 'Status',
      //    accessor: 'drnStatus',
      //    disableFilters: true,
      //    Cell: ({ value }) => {
      //       if (value==="O")
      //          return "Open"
      //       else if (value==="P")
      //          return "Pending Approval"
      //       else if (value==="A")
      //          return "Approved"
      //       else if (value==="R")
      //          return "Rejected"
      //       else
      //          return value
      //    }
      // },
      {
        Header: 'Action',
        Footer: 'Action',
        accessor: '',
        disableFilters: true,
        Cell: ({row}) => (
         <React.Fragment>
            <div>
               <Link to={`/drnapproval/${row.allCells[0].value}/edit`}>
                  <span className = "tableIcon" style={{color:"#e20513"}}>
                     Approve/Reject
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
         exportFileName = "drn_details"
      />
         
   )
}

export default DRNApprovalTable
