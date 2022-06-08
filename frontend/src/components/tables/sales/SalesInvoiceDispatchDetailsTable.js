import React from 'react'
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const SalesInvoiceDispatchDetailsTable = ({ data }) => {

   const headings = ['Invoice #', 'Invoice Date', 'Customer Name', 'JC No', 'JC Description', 'Part Number', 'Batch Date', 'Dispatched Qty', 'ASN', 'Transporter', 'Docket Date', 'Docket #'];
   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false,
         export: false
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
         Header: 'Part Number',
         Footer: 'Part Number',
         accessor: 'cpin',
         disableFilters: true
      },
      {
         Header: 'Batch Date',
         Footer: 'Batch Date',
         accessor: 'batchDate',
         disableFilters: true,
         Cell: ({ value }) => {
               return format(new Date(value), 'dd-MMM-yy')
          }
      },
      {
         Header: 'JC Description',
         Footer: 'JC Description',
         accessor: 'jcDescription',
         disableFilters: true
      },
      {
         Header: 'Dispatched Qty',
         Footer: 'Dispatched Qty',
         accessor: 'dispatchQty',
         disableFilters: true
      },
      {
         Header: 'ASN',
         Footer: 'ASN',
         accessor: 'deliveryNumber',
         disableFilters: true,
         // Cell: ({ value }) => {
         //    return parseFloat(value).toFixed(2)
         // }
      },
      {
         Header: 'Transporter',
         Footer: 'Transporter',
         accessor: 'transporter',
         disableFilters: true
      },
      {
         Header: 'Docket Date',
         Footer: 'Docket Date',
         accessor: 'docketDate',
         disableFilters: true,
         Cell: ({ value }) => {
               return format(new Date(value), 'dd-MMM-yy')
          }
      },
      {
         Header: 'Docket #',
         Footer: 'Docket #',
         accessor: 'docketNumber',
         disableFilters: true,
         Cell: ({ value }) => <div className="text-wrap">{value}</div>
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
         headings = {headings}
         exportFileName = "tax_invoice_dispatch_details"
      />
         
   )
}

export default SalesInvoiceDispatchDetailsTable
