import React from 'react'
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const YieldReportTable = ({ data }) => {

   const removeColumns = ['markCompleted'];

   const headings = [
      '#',
      'Date',
      'Input Qty',
      'Output Qty',
      'Job Card #',
      '',
      'ID',
      '',
      'JC #',
      'JC Description',
      'Input Sqm',
      'Output Sqm',
      'Waste Sqm',
      'Yield %'

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
         Header: 'Job Card #',
         Footer: 'Job Card #',
         accessor: 'jobCardNo',
         disableFilters: true,
      },
      {
         Header: 'Job Card Date',
         Footer: 'Job Card Date',
         accessor: 'batchDate',
         disableFilters: true,
         Cell: ({ value }) => {
               return format(new Date(value), 'dd-MMM-yyyy')
          }
      },
      {
         Header: 'JC #',
         Footer: 'JC #',
         accessor: 'jcNumber',
         disableFilters: true,
      },
      {
         Header: 'JC Description',
         Footer: 'JC Description',
         accessor: 'jcDesc',
         disableFilters: true,
         Cell: row => <div style={{ textAlign: "left" }}>{row.value}</div>
      },
      {
         Header: 'Input Qty',
         Footer: 'Input Qty',
         accessor: 'inputQuantity',
         disableFilters: true,
      },
      {
         Header: 'Output Qty',
         Footer: 'Output Qty',
         accessor: 'totalOutputQuantity',
         disableFilters: true,
      },
      {
         Header: 'Input Sqm',
         Footer: 'Input Sqm',
         accessor: 'inputSqm',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'Output Sqm',
         Footer: 'Output Sqm',
         accessor: 'outputSqm',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'Waste Sqm',
         Footer: 'Waste Sqm',
         accessor: 'wasteSqm',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'Yield %',
         Footer: 'Yield %',
         accessor: 'yieldPercent',
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
         exportFileName = "yield_report"
         removeColumns = {removeColumns}
         headings = {headings}
      />
         
   )
}

export default YieldReportTable
