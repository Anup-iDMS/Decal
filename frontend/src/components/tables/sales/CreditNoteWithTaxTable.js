
import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from '../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const CreditNoteWithTaxTable = ({ data }) => {

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
      'Credit Note #',
      'Credit Note Date',
      'Customer',
      'Customer GST',
      'Taxable Value',
      'Total Tax Amount',
      'Total IGST Amount',
      'Total SGST Amount',
      'Total CGST Amount',
      'Invoice Amount With Tax'
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
        Header: 'Credit Note #',
        Footer: 'Credit Note #',
        accessor: 'creditNoteNumber',
        disableFilters: true,
      },
      {
        Header: 'Date',
        Footer: 'Date',
        accessor: 'creditNoteDate',
        disableFilters: true,
        Cell: ({ value }) => {
              return format(new Date(value), 'dd-MMM-yyyy')
         }
      },
      {
         Header: 'Customer Name',
         Footer: 'Customer Name',
         accessor: 'name',
         disableFilters: true,
      },
      {
         Header: 'GST',
         Footer: 'GST',
         accessor: 'custGST',
         disableFilters: true,
      },
      {
         Header: 'Taxable Value (₹)',
         Footer: 'Taxable Value (₹)',
         accessor: 'creditNoteTotalAmount',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'Total Tax (₹)',
         Footer: 'Total Tax (₹)',
         accessor: 'creditNoteTotalTaxAmount',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'IGST (₹)',
         Footer: 'IGST (₹)',
         accessor: 'creditNoteTotalIGSTAmount',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'CGST (₹)',
         Footer: 'CGST (₹)',
         accessor: 'creditNoteTotalCGSTAmount',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'SGST (₹)',
         Footer: 'SGST (₹)',
         accessor: 'creditNoteTotalSGSTAmount',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'Invoice Value (₹)',
         Footer: 'Invoice Value (₹)',
         accessor: 'creditNoteTotalAmountWithTax',
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
         exportFileName = "credit_note_with_tax_details"
      />
         
   )
}

export default CreditNoteWithTaxTable
