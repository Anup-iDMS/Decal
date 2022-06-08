import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'

//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const JobInputTable = ({ data }) => {

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
         Header: 'Batch Date',
         Footer: 'Batch Date',
         accessor: 'batchDate',
         disableFilters: true,
         Cell: ({ value }) => {
            return format(new Date(value), 'dd-MMM-yyyy')
         }
      },
      {
         Header: 'Input Qty',
         Footer: 'Input Qty',
         accessor: 'inputQuantity',
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
               <Link to={`/jobcardinput/${row.allCells[0].value}/edit`}>
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
         exportFileName = "job_cards"
      />
         
   )
}

export default JobInputTable
