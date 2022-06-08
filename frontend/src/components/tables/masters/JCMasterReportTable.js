//React Components
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const JCMasterReportTable = ({ data }) => {

   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false
       },
      {
        Header: 'JC #',
        Footer: 'JC #',
        accessor: 'JC #',
        disableFilters: true,
      },
      {
        Header: 'JC Description',
        Footer: 'JC Description',
        accessor: 'JC Description',
        disableFilters: true,
 
      },
      {
         Header: 'Customer',
         Footer: 'Customer',
         accessor: 'Customer Name',
         disableFilters: true,
  
       },
      {
         Header: 'Part Number',
         Footer: 'Part Number',
         accessor: 'Part Number',
         disableFilters: true,
  
      },
      {
         Header: 'Total Colors',
         Footer: 'Total Colors',
         accessor: 'Total Colors',
         disableFilters: true,
  
      },
      {
         Header: 'Rate (₹)',
         Footer: 'Rate (₹)',
         accessor: 'Rate',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
  
      },
      {
        Header: 'HSN',
        Footer: 'HSN',
        accessor: 'HSN',
        disableFilters: true,
      },
   ]

   return (
      <React.Fragment> 
         <MakeTable
            tableColumns={tableColumns}
            tabledata={data} 
            exportFileName = "JC Master List Report"
         />
      </React.Fragment>
   )
}

export default JCMasterReportTable
