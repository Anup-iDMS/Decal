import React from 'react'
import { Link } from 'react-router-dom';


//Application Custom Components
import MakeTable from '../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const HSNTable = ({ data }) => {

   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false
      },
      {
        Header: 'HSN Code',
        Footer: 'HSN Code',
        accessor: 'hsnCode',
        disableFilters: true,
      },
      {
         Header: 'GST Rate (%)',
         Footer: 'GST Rate (%)',
         accessor: 'gstRate',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'I-GST Rate (%)',
         Footer: 'I-GST Rate (%)',
         accessor: 'igstRate',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'S-GST Rate (%)',
         Footer: 'S-GST Rate (%)',
         accessor: 'sgstRate',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'C-GST Rate (%)',
         Footer: 'C-GST Rate (%)',
         accessor: 'cgstRate',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
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
               <Link to={`/hsnsac/${row.allCells[0].value}/edit`}>
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
         exportFileName = "hsnsac_details"
      />
         
   )
}

export default HSNTable
