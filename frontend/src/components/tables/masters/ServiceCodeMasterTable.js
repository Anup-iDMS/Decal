import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const ServiceCodeMasterTable = ({ data }) => {

   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false
      },
      {
         Header: 'Service Code',
         Footer: 'Service Code',
         accessor: 'code',
         disableFilters: true,
      },
      {
         Header: 'Service Name',
         Footer: 'Service Name',
         accessor: 'name',
         disableFilters: true,
      },
      {
         Header: 'SAC #',
         Footer: 'SAC #',
         accessor: 'sac',
         disableFilters: true,
      },
      {
         Header: 'Active',
         Footer: 'Active',
         accessor: 'isActive',
         disableFilters: true,
         // Cell: ({ value }) => {
         //    if (value)
         //       return "Yes"
         //    else 
         //       return "No"
         // }
      },
      {
        Header: 'Edit',
        Footer: 'Edit',
        accessor: '',
        disableFilters: true,
        Cell: ({row}) => (
         <>
            <div>
               <Link to={`/servicecode/${row.allCells[0].value}/edit`}>
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
         exportFileName = "service_code_details"
      />
         
   )
}

export default ServiceCodeMasterTable
