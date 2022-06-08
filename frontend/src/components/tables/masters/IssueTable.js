import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'


//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const IssueTable = ({ data }) => {

   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false
      },
      {
         Header: 'Ticket #',
         Footer: 'Ticket #',
         accessor: 'issueNumber',
         disableFilters: true,
      },
      {
         Header: 'Title',
         Footer: 'Title',
         accessor: 'issueTitle',
         disableFilters: true,
      },
      {
         Header: 'Description',
         Footer: 'Description',
         accessor: 'issueDescription',
         disableFilters: true,
      },
      {
         Header: 'Issue Resolution',
         Footer: 'Issue Resolution',
         accessor: 'issueResolution',
         disableFilters: true,
      },
      {
         Header: 'Status',
         Footer: 'Status',
         accessor: 'issueStatus',
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
                <Link to={`/issue/${row.allCells[0].value}/edit`}>
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
         exportFileName = "issue_details"
      />
         
   )
}

export default IssueTable
