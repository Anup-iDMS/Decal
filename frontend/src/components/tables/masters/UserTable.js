import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const UserTable = ({ data }) => {

   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false
      },
      {
         Header: 'User Code',
         Footer: 'User Code',
         accessor: 'userCode',
         disableFilters: true,
      },
      {
         Header: 'Login Id',
         Footer: 'Login Id',
         accessor: 'email',
         disableFilters: true,
      },
      {
         Header: 'Name',
         Footer: 'Name',
         accessor: 'name',
         disableFilters: true,
      },
      {
         Header: 'Role',
         Footer: 'Role',
         accessor: 'role.role',
         disableFilters: true,
      },
      {
         Header: 'Active',
         Footer: 'Active',
         accessor: 'isActive',
         disableFilters: true,
         Cell: ({ value }) => {
            if (value)
               return "Yes"
            else 
               return "No"
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
               <Link to={`/user/${row.allCells[0].value}/edit`}>
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
         exportFileName = "user_details"
      />
         
   )
}

export default UserTable
