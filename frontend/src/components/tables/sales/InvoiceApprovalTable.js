import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from '../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const InvoiceApprovalTable = ({ data }) => {

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
      //   Header: 'JC #',
      //   Footer: 'JC #',
      //   accessor: 'jcProdCode.name',
      //   disableFilters: true,
      // },
      // {
      //   Header: 'JC Description',
      //   Footer: 'JC Description',
      //   accessor: 'jcDescription',
      //   disableFilters: true,
      // },
      // {
      //   Header: 'SO Qty',
      //   Footer: 'SO Qty',
      //   accessor: 'soQty',
      //   disableFilters: true,
      // },
      // {
      //   Header: 'Unit Rate',
      //   Footer: 'Unit Rate',
      //   accessor: 'hsn',
      //   disableFilters: true,
      // },
      // {
      //    Header: 'SO Val',
      //    Footer: 'SO Val',
      //    accessor: 'soValue',
      //    disableFilters: true,
      // },
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
         <>
            <div>
               <Link to={`/invoiceapproval/${row.allCells[0].value}/edit`}>
                  <span className = "tableIcon" style={{color:"#e20513"}}>
                     Approve/Reject
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
         exportFileName = "drn_approval_details"
      />
         
   )
}

export default InvoiceApprovalTable
