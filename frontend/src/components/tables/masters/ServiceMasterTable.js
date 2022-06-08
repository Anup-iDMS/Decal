import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const ServiceMasterTable = ({ data }) => {
   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false
      },
      {
         Header: 'Service #',
         Footer: 'Service #',
         accessor: 'serviceCode',
         disableFilters: true,
      },
      {
         Header: 'Description',
         Footer: 'Description',
         accessor: 'serviceDescription',
         disableFilters: true,
         Cell: row => <div style={{ textAlign: "left" }}>{row.value}</div>
      },
      {
         Header: 'HSN/SAC #',
         Footer: 'HSN/SAC #',
         accessor: 'sac.sacCode',
         disableFilters: true,
      },
      {
         Header: 'CGST',
         Footer: 'CGST',
         accessor: 'sac.cgstRate',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'SGST',
         Footer: 'SGST',
         accessor: 'sac.sgstRate',
         disableFilters: true,
         Cell: ({ value }) => {
            return parseFloat(value).toFixed(2)
         }
      },
      {
         Header: 'IGST',
         Footer: 'IGST',
         accessor: 'sac.igstRate',
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
         <React.Fragment>
            <div>
               <Link to={`/servicemaster/${row.allCells[0].value}/edit`}>
                  <span className = "tableIcon">
                     <i 
                        className = "fas fa-edit" 
                        style={{color:"green", fontSize:"1.5rem", }}>
                     </i>
                  </span>
               </Link>
            </div>
         </React.Fragment>
        )
      },
   ]
   
   return (
     
      <MakeTable
         tableColumns={tableColumns}
         tabledata={data} 
         exportFileName = "service_master_details"
      />
         
   )
}

export default ServiceMasterTable
