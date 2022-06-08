import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from '../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const RejectedDRNTable = ({ data }) => {

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
      {
         Header: 'Customer Name',
         Footer: 'Customer Name',
         accessor: 'customer.custName',
         disableFilters: true,
      }
   ]
   
   return (
     
      <MakeTable
         tableColumns={tableColumns}
         tabledata={data} 
         exportFileName = "rejected_drn_details"
      />
         
   )
}

export default RejectedDRNTable
