import React from 'react'
import { Link } from 'react-router-dom';


//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'

const CompanyMasterTable = ({ data }) => {

   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false
      },
      {
        Header: 'Company Name',
        Footer: 'Company Name',
        accessor: 'name',
        disableFilters: true,
      },
      {
         Header: 'Address',
         Footer: 'Address',
         accessor: 'address',
         disableFilters: true,
      },
      {
         Header: 'Pincode',
         Footer: 'Pincode',
         accessor: 'pinCode',
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
               <Link to={`/company/${row.allCells[0].value}/edit`}>
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
         exportFileName = "company_details"
      />
         
   )
}

export default CompanyMasterTable
