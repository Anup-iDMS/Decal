import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const InpectionParametersTable = ({ data }) => {

   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false
      },
      {
         Header: 'Inspection Parameter Code',
         Footer: 'Inspection Parameter Code',
         accessor: 'inspectionParameterCode',
         disableFilters: true,
      },
      {
         Header: 'Inspection Parameter',
         Footer: 'Inspection Parameter',
         accessor: 'inspectionParameterName',
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
               <Link to={`/inspectionparameter/${row.allCells[0].value}/edit`}>
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
         exportFileName = "inspection_paramsters_details"
      />
         
   )
}

export default InpectionParametersTable
