import React from 'react'
import { format } from 'date-fns'

//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const FGMITable = ({ data }) => {

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
        accessor: 'jcNo.jcno',
        disableFilters: true,
      },
      {
         Header: 'JC Description',
         Footer: 'JC Description',
         accessor: 'jcNo.jcDescription',
         disableFilters: true,
      },
      {
         Header: 'Batch Qty',
         Footer: 'Batch Qty',
         accessor: 'batchQuantity',
         disableFilters: true,
      },
      {
         Header: 'Batch Date',
         Footer: 'Batch Date',
         accessor: 'batchDate',
         disableFilters: true,
         Cell: ({ value }) => {
            return format(new Date(value), 'dd-MMM-yyyy')
         }
      },
      {
         Header: 'Batch Status',
         Footer: 'Batch Status',
         accessor: 'batchStatus',
         disableFilters: true,
      },
 
   ]
   
   return (
     
      <MakeTable
         tableColumns={tableColumns}
         tabledata={data} 
         exportFileName = "fgmi_details"
      />
         
   )
}

export default FGMITable
