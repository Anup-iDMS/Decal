import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'

//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const MachineMasterTable = ({ data }) => {

   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false
      },
      {
        Header: 'Machine Code',
        Footer: 'Machine Code',
        accessor: 'machineCode',
        disableFilters: true,
      },
      {
         Header: 'Machine Name',
         Footer: 'Machine Name',
         accessor: 'name',
         disableFilters: true,
      },
      {
         Header: 'Model',
         Footer: 'Model',
         accessor: 'modelNo',
         disableFilters: true,
      },
      {
         Header: 'Serial #',
         Footer: 'Serial #',
         accessor: 'serialNo',
         disableFilters: true,
      },
      {
         Header: 'Purchase Date',
         Footer: 'Purchase Date',
         accessor: 'purchaseDate',
         disableFilters: true,
         Cell: ({ value }) => {
            return format(new Date(value), 'dd-MMM-yyyy')
         }
      },
      {
        Header: 'Edit',
        Footer: 'Edit',
        accessor: '',
        disableFilters: true,
        Cell: ({row}) => (
         <>
            <div>
               <Link to={`/machine/${row.allCells[0].value}/edit`}>
                  <span className = "tableIcon">
                     <i 
                        className = "fas fa-edit" 
                        style={{color:"green", fontSize:"1.5rem", }}>
                     </i>
                  </span>
               </Link>
            </div>
         </>
        )
      }
   ]
   
   return (
     
      <MakeTable
         tableColumns={tableColumns}
         tabledata={data} 
         exportFileName = "machine_master_details"
      />
         
   )
}

export default MachineMasterTable
