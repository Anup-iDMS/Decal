import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from '../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const DRNTable = ({ data }) => {

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
      {
         Header: 'Status',
         Footer: 'Status',
         accessor: 'drnStatus',
         disableFilters: true,
         Cell: ({ value }) => {
            if (value==="O")
               return "Open"
            else if (value==="P")
               return "Pending Approval"
            else if (value==="A")
               return "Approved"
            else if (value==="R")
               return "Rejected"
            else
               return value
         }
      },
      {
         Header: 'View/Edit',
         Footer: 'View/Edit',
         accessor: '',
         disableFilters: true,
         Cell: ({row}) => (
          <>
            <div>
               <Link to={`/drn/${row.allCells[0].value}/edit/${"save"}`}>
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
        Header: 'Action',
        Footer: 'Action',
        accessor: '',
        disableFilters: true,
        Cell: ({row}) => (
         <React.Fragment>
            {/*logger(row.allCells[4].value)*/}
            <div>
               {row.allCells[4].value==="P"?"No Action Pending":(
                  <Link to={`/drn/${row.allCells[0].value}/edit/${"approve"}`}>
                     <span className = "tableIcon" style={{color:"#e20513"}}>
                        Send for Approval
                     </span>
                  </Link>
               )}
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

export default DRNTable
