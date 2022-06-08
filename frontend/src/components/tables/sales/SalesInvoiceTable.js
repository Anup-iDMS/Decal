import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from '../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const SalesInvoiceTable = ({ data }) => {

   const removeColumns = [
      'salesInvoiceStatus',
      'supplierAddressIndex',
      'customerBillingAddressIndex',
      'customerShipingAddressIndex',
      'salesInvoiceTotalUGSTAmount',
      'drnNumber',
      'billState',
      'billPinCode',
      'shipState',
      'shipPinCode',
      'salesInvoiceDetails',
      'supplierAddress',
      'customerBillingAddress',
      'customerShipingAddress',
      'customerAddressIndex',
      'paymentTerms'
   ];

   const headings = [
      'Tax Invoice Date',
      'Total CGST Amount',
      'Total SGST Amount',
      'Total IGST Amount',
      'Total Tax Amount',
      'Invoice Amount With Tax',
      'Invoice #',
      'Customer',
      'Invoice Amount Without Tax'

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
        Header: 'Invoice #',
        Footer: 'Invoice #',
        accessor: 'salesInvoiceNumber',
        disableFilters: true,
      },
      {
        Header: 'Invoice Date',
        Footer: 'Invoice Date',
        accessor: 'salesInvoiceDate',
        disableFilters: true,
        Cell: ({ value }) => {
              return format(new Date(value), 'dd-MMM-yyyy')
         }
      },
      {
         Header: 'Invoice Value (₹)',
         Footer: 'Invoice Value (₹)',
         accessor: 'salesInvoiceTotalAmountWithTax',
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
      },
      // {
      //   Header: 'View',
      //   Footer: 'View',
      //   accessor: '',
      //   disableFilters: true,
      //   Cell: ({row}) => (
      //    <React.Fragment>
      //       <div>
      //          <Link to={`/taxinvoice/${row.allCells[0].value}/edit`}>
      //             <span className = "tableIcon">
      //                <i 
      //                   className = "fas fa-eye" 
      //                   style={{color:"green", fontSize:"1.5rem", }}>
      //                </i>
      //             </span>
      //          </Link>
      //       </div>
      //    </React.Fragment>
      //   )
      // },
      {
         Header: 'View/Print',
         Footer: 'View/Print',
         accessor: '',
         disableFilters: true,
         Cell: ({row}) => (
          <React.Fragment>
             <div>
                <Link to={`/taxinvoice/${row.allCells[0].value}/edit`} target="_blank" rel="noopener noreferrer">
                  <span className = "tableIcon">
                     <i 
                        className = "fas fa-print" 
                        style={{color:"red", fontSize:"1.5rem", }}>
                     </i>
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
         removeColumns = {removeColumns}
         headings = {headings}
         exportFileName = "sales_invoice_details"
      />
         
   )
}

export default SalesInvoiceTable
