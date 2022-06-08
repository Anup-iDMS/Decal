
import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from '../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const SalesInvoiceWithTaxTable = ({ data }) => {

   const removeColumns = [
      'salesInvoiceStatus',
      'supplierAddressIndex',
      'customerBillingAddressIndex',
      'customerShipingAddressIndex',
      'salesInvoiceTotalUGSTAmount',
      'drnNumber',
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
      'Invoice Date',
      'Total CGST Amount',
      'Total SGST Amount',
      'Total IGST Amount',
      'Total Tax Amount',
      'Invoice Amount With Tax',
      'Invoice #',
      'Customer',
      'State',
      'Taxable Value'

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
         Header: 'Customer Name',
         Footer: 'Customer Name',
         accessor: 'customer.custName',
         disableFilters: true,
      },
      {
         Header: 'State',
         Footer: 'State',
         accessor: 'billState',
         disableFilters: true,
      },
      {
         Header: 'Taxable Value (₹)',
         Footer: 'Taxable Value (₹)',
         accessor: 'salesInvoiceTotalAmount',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'SGST (₹)',
         Footer: 'SGST (₹)',
         accessor: 'salesInvoiceTotalSGSTAmount',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'CGST (₹)',
         Footer: 'CGST (₹)',
         accessor: 'salesInvoiceTotalCGSTAmount',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'IGST (₹)',
         Footer: 'IGST (₹)',
         accessor: 'salesInvoiceTotalIGSTAmount',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
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
    
   ]
   
   return (
     
      <MakeTable
         tableColumns={tableColumns}
         tabledata={data} 
         removeColumns = {removeColumns}
         headings = {headings}
         exportFileName = "sales_register_with_tax_details"
      />
         
   )
}

export default SalesInvoiceWithTaxTable
