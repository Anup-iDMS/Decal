import React from 'react'
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const SalesInvoiceLineDetailsTable = ({ data }) => {
   
   const headings = [
      'Invoice #',
      'Invoice Date',
      'Line #',
      'JC #',
      'Part Number',
      'JC Description',
      'Invoiced Qty',
      'Unit Rate (₹)',
      'Total Line Value (₹)',
      'Customer Name'
   ]
   const removeColumns = [];
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
        accessor: 'salesInvoiceNumber',
        disableFilters: true
      },
      {
        Header: 'Invoice Date',
        Footer: 'Invoice Date',
        accessor: 'salesInvoiceDate',
        disableFilters: true,
        Cell: ({ value }) => {
              return format(new Date(value), 'dd-MMM-yy')
         }
      },
      ,
      {
         Header: 'Line #',
         Footer: 'Line #',
         accessor: 'salesInvoiceLineNumber',
         disableFilters: true
      },
      {
         Header: 'JC Description',
         Footer: 'JC Description',
         accessor: 'jcDescription',
         disableFilters: true
      },
      {
         Header: 'CPN',
         Footer: 'CPN',
         accessor: 'customerPartNumber',
         disableFilters: true
      },
      {
         Header: 'Invoiced Qty',
         Footer: 'Invoiced Qty',
         accessor: 'dispatchQty',
         disableFilters: true
      },
      {
         Header: 'Unit (₹)',
         Footer: 'Unit (₹)',
         accessor: 'salesInvoiceUnitRate',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'Total Line Value (₹)',
         Footer: 'Total Line Value (₹)',
         accessor: 'salesInvoiceLineValue',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'Customer Name',
         Footer: 'Customer Name',
         accessor: 'name',
         disableFilters: true
      }
   ]
   
   return (
     
      <MakeTable
         tableColumns={tableColumns}
         tabledata={data} 
         removeColumns = {removeColumns}
         headings = {headings}
         exportFileName = "tax_invoice_line_details"
      />
         
   )
}

export default SalesInvoiceLineDetailsTable
