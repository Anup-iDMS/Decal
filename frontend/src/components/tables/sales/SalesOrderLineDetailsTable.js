import React from 'react'
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const SalesOrderLineDetailsTable = ({ data }) => {

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
        disableFilters: true
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
      ,
      {
         Header: 'Line #',
         Footer: 'Line #',
         accessor: 'lineNumber',
         disableFilters: true
      },
      {
         Header: 'JC Description',
         Footer: 'JC Description',
         accessor: 'jcDescription',
         disableFilters: true
      },
      {
         Header: 'SO Qty',
         Footer: 'SO Qty',
         accessor: 'orderedQty',
         disableFilters: true
      },
      {
         Header: 'Unit (₹)',
         Footer: 'Unit (₹)',
         accessor: 'soUnitRate',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'Total Line Value (₹)',
         Footer: 'Total Line Value (₹)',
         accessor: 'lineValue',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'Customer Name',
         Footer: 'Customer Name',
         accessor: 'customer.custName',
         disableFilters: true
      },
      {
         Header: 'TD Date',
         Footer: 'TD Date',
         accessor: 'soTargetDate',
         disableFilters: true,
         Cell: ({ value }) => {
            return format(new Date(value), 'dd-MMM-yyyy')
         }
      }
   ]
   
   return (
     
      <MakeTable
         tableColumns={tableColumns}
         tabledata={data} 
         exportFileName = "sales_order_line_details"
      />
         
   )
}

export default SalesOrderLineDetailsTable
