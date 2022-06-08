import React from 'react'
import { Link } from 'react-router-dom';
import { format } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
//Application Custom Components
import MakeTable from './../formtable/MakeTable';

//CSS properties for table
import './../css/table.css'
import { deletePDIR } from '../../../actions/qa/pdirActions';

const PDIRTemplateTable = (props) => {
   const { data, onDelete} = props;
   const dispatch = useDispatch();

   // const deleteHandler = (id) => {
   //    if (window.confirm('Are you sure you want delete the record?')) {
   //      dispatch(deletePDIR(id))
   //      window.location.reload();
   //    }
   // }
  
   const tableColumns = [
      {
         Header: 'deva',
         Footer: 'deva',
         accessor: '_id',
         disableFilters: true,
         show: false
      },
      {
         Header: 'PDIR #',
         Footer: 'PDIR #',
         accessor: 'pdirCode',
         disableFilters: true,
      },
      {
         Header: 'PDIR Date',
         Footer: 'PDIR Date',
         accessor: 'pdirDate',
         disableFilters: true,
         Cell: ({ value }) => {
            return format(new Date(value), 'dd-MMM-yyyy')
         }
      },
      {
         Header: 'Invoice #',
         Footer: 'Invoice #',
         accessor: 'salesInvoiceNumber.salesInvoiceNumber',
         disableFilters: true,
      },
      {
         Header: 'Customer',
         Footer: 'Customer',
         accessor: 'customer.custName',
         disableFilters: true,
         Cell: row => <div style={{ textAlign: "left" }}>{row.value}</div>
      },
      {
        Header: 'Edit',
        Footer: 'Edit',
        accessor: '',
        disableFilters: true,
        Cell: ({row}) => (
         <React.Fragment>
            <div>
               <Link to={`/pdir/${row.allCells[0].value}/edit`}>
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
      {
         Header: 'Delete',
         Footer: 'Delete',
         accessor: '',
         disableFilters: true,
         Cell: ({row}) => (
          <React.Fragment>
            <div>
               <Button
                  variant='danger'
                  className='btn-sm'
                  onClick={() => onDelete(row.allCells[0].value)}
               >
                  <i className='fas fa-trash'></i>
               </Button>
            </div>
          </React.Fragment>
         )
       },
      {
         Header: 'Print',
         Footer: 'Print',
         accessor: '',
         disableFilters: true,
         Cell: ({row}) => (
          <React.Fragment>
             <div>
                <Link to={`/pdir/${row.allCells[0].value}/print`} target="_blank" rel="noopener noreferrer">
                  <span className = "tableIcon">
                     <i 
                        className = "fas fa-print" 
                        style={{color:"red", fontSize:"1.5rem", }}>
                     </i>
                  </span>
                </Link>
             </div>
          </React.Fragment>
         )
      }
   ]
   
   return (
     
      <MakeTable
         tableColumns={tableColumns}
         tabledata={data} 
         exportFileName = "pdir_details"
      />
         
   )
}

export default PDIRTemplateTable
