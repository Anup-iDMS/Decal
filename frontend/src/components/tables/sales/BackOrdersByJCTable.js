import React from 'react'

//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const BackOrdersByJCTable = ({ data }) => {

   const tableColumns = [
  
      {
         Header: 'JC #',
         Footer: 'JC #',
         accessor: 'jcNo',
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
         Header: 'Balance Qty',
         Footer: 'Balance Qty',
         accessor: 'balancedQty',
         disableFilters: true,
      }
      ,
      {
         Header: 'Balance Value  (₹)',
         Footer: 'Balance Value  (₹)',
         accessor: 'balanceValue',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      }
   ]
   
   return (
     
      <MakeTable
         tableColumns={tableColumns}
         tabledata={data} 
         exportFileName = "back_order_report_by_jc"
      />
         
   )
}

export default BackOrdersByJCTable
