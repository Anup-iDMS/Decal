import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const RoleTable = ({ data }) => {

   const tableColumns = [
      {
         Header: 'ID',
         Footer: 'ID',
         accessor: '_id',
         disableFilters: true,
         show: true
      },
      {
         Header: 'Role',
         Footer: 'Role',
         accessor: 'role',
         disableFilters: true,
      },
     
      {
        Header: 'Edit',
        Footer: 'Edit',
        accessor: '',
        disableFilters: true,
        Cell: ({row}) => (
         <>
            <div>
               <Link to={`/role/${row.allCells[0].value}/edit`}>
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
         exportFileName = "role_details"
      />
         
   )
}

export default RoleTable
