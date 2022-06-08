import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const AppParametersTable = ({ data }) => {

   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false
      },
      {
         Header: 'App Param Code',
         Footer: 'App Param Code',
         accessor: 'appParameterCode',
         disableFilters: true,
      },
      {
         Header: 'App Code',
         Footer: 'App Code',
         accessor: 'appParameterAppCode',
         disableFilters: true,
      },
      {
         Header: 'Param Name',
         Footer: 'Param Name',
         accessor: 'appParameterName',
         disableFilters: true,
      },
      {
         Header: 'Param Value',
         Footer: 'Param Value',
         accessor: 'appParameterValue',
         disableFilters: true,
      },
      {
         Header: 'Active',
         Footer: 'Active',
         accessor: 'isActive',
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
               <Link to={`/parameters/${row.allCells[0].value}/edit`}>
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
         exportFileName = "app_parameters_details"
      />
         
   )
}

export default AppParametersTable
