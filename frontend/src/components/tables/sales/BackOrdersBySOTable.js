import React from 'react'
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const BackOrdersBySOTable = ({ data }) => {

   const headings = [
      'SO #',
      'SO Date',
      'Target Date',
      'Line #',
      'JC #',
      'JC Description',
      'Ordered Qty',
      'Invoiced Qty',
      'Balance Qty',
      'Balance Value',
      'Unit Rate',
      'SO Line Value',
      'Customer'

   ];

   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false
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
        Header: 'SO #',
        Footer: 'SO #',
        accessor: 'soNumber',
        disableFilters: true,
      },
      {
         Header: 'Line #',
         Footer: 'Line #',
         accessor: 'lineNumber',
         disableFilters: true,
      },
      {
         Header: 'JC #',
         Footer: 'JC #',
         accessor: 'jcno',
         disableFilters: true,
      },
      {
         Header: 'JC Description',
         Footer: 'JC Description',
         accessor: 'jcDescription',
         disableFilters: true,
         Cell: row => <div style={{ textAlign: "left" }}>{row.value}</div>
      },
      {
         Header: 'Bal Qty',
         Footer: 'Bal Qty',
         accessor: 'balancedQty',
         disableFilters: true,
      },
      {
         Header: 'Bal Value (₹)',
         Footer: 'Bal Value (₹)',
         accessor: 'balanceValue',
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
         Cell: row => <div style={{ textAlign: "left" }}>{row.value}</div>
      },
      {
         Header: 'TD Date',
         Footer: 'TD Date',
         accessor: 'soTargetDate',
         disableFilters: true,
         Cell: ({ value }) => {
            return format(new Date(value), 'dd-MMM-yyyy')
         }
      },
   ]
   
   return (
     
      <MakeTable
         tableColumns={tableColumns}
         tabledata={data} 
         exportFileName = "back_order_report_by_SO"
         headings = {headings}
      />
         
   )
}

export default BackOrdersBySOTable
