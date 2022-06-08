//React Components
import React, { useMemo } from 'react'

//React Table Components
import { 
   useTable, 
   useFilters, 
   useGlobalFilter, 
   usePagination,
   useSortBy 
} from 'react-table'

//React Table Custom Components
import { GlobalFilter } from './../reacttable/GlobalFilter';
import { ColumnFilter } from './../reacttable/ColumnFilter';

//Application Custom Components
import ExportCSV from './../../exports/ExportCSV';

//CSS properties for table
import './../css/table.css'

import jsPDF from "jspdf";
import "jspdf-autotable";
import Button from 'react-bootstrap/Button';



const MakeTable = ({ tableColumns, tabledata, exportFileName, removeColumns=[], headings=[] }) => {

   const columns = useMemo(() => tableColumns, [])
   const data = useMemo(() => tabledata, [])
   
   const defaultColumn = React.useMemo(
      () => ({
        Filter: ColumnFilter
      }),
      []
   )

   const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      footerGroups,
      rows,
      prepareRow,
      state,
      setGlobalFilter,
      page,
      nextPage,
      previousPage,
      canPreviousPage,
      canNextPage,
      pageOptions,
      gotoPage,
      pageCount,
      setPageSize,
   } = useTable(
      {
         columns,
         data,
         defaultColumn,
         initialState: { 
            pageIndex: 0,
            hiddenColumns: columns.map(column => {
               if (column.show === false) return column.accessor || column.id;
            }),
         }
      },
      
      useFilters,
      useGlobalFilter,
      useSortBy,
      usePagination
   )

   const { globalFilter, pageIndex, pageSize } = state

   const download_pdf = () => {
      console.log("--- inside download pdf ------------")
      //const doc = new jsPDF();
      const unit = "pt";
      const size = "A4"; // Use A1, A2, A3 or A4
      const orientation = "portrait"; // portrait or landscape

      const marginLeft = 40;
      const doc = new jsPDF(orientation, unit, size);

      doc.setFontSize(15);

      const columns_data_for_export = columns
      .slice(0, tableColumns.length - 1)
      .map((d) => {
         if(d.Header.indexOf('deva') !== -1 || d.Header.indexOf('JC Description') !== -1 ){
            console.log("--------- IF HEAD ER ===== ", d.Header)
         } else {
            console.log("--------- ELSE HEAD ER ===== ", d.Header)
            return d.Header;
         }
      });

      console.log("--- inside download pdf columns_data_for_export ------------ ", columns_data_for_export)

      const temp_rows = tabledata.map((d1) =>
        columns
          .slice(0, tableColumns.length - 1)
          .map((d2) => d2.accessor)
          .map((d3) => d1[d3])
      );

      console.log("--- inside download pdf temp_rows ------------ ", temp_rows)

      doc.autoTable({
        head: [columns_data_for_export],
        body: temp_rows
      });
      console.log(columns_data_for_export, temp_rows);
      doc.save("client_list.pdf");
   }

   return (
      <React.Fragment>
         <div className="tablePlacement">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <span className="mx-3">
               <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
               &nbsp;{'<<'}&nbsp;
               </button>{' '}
               <button onClick={() => previousPage()} disabled={!canPreviousPage}>
               &nbsp;Previous&nbsp;
               </button>{' '}
               <button onClick={() => nextPage()} disabled={!canNextPage}>
                  &nbsp;Next&nbsp;
               </button>{' '}
               <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
               &nbsp;{'>>'}&nbsp;
               </button>{' '}
               <span>
                  Page{' '}
                  <strong>
                     {pageIndex + 1} of {pageOptions.length}
                  </strong>{' '}
               </span>
               <span>
                  | Go to page:{' '}
                  <input
                     type='number'
                     defaultValue={pageIndex + 1}
                     onChange={e => {
                     const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
                     gotoPage(pageNumber)
                     }}
                     style={{ width: '50px' }}
                  />
               </span>{' '}
               <select
                  value={pageSize}
                  onChange={e => setPageSize(Number(e.target.value))}>
                  {[10, 25, 50, "All"].map(pageSize => (
                     <option key={pageSize} value={pageSize==="All"?10000:pageSize}>
                     Show {pageSize}
                     </option>
                  ))}
               </select>
            </span>
            <span style={{float:"right", marginRight:"15px", marginTop:"10px", marginBottom:"10px"}}>
               <ExportCSV csvData={data} fileName={exportFileName}  removeColumns={removeColumns} headings={headings} />
               {/*<Button
                  variant="primary"
                  onClick={download_pdf}
               ></Button>*/}
            </span>
         </div>
         <div className="exportCSV">
            <table {...getTableProps()} className='table-sm customerTable table my-2' >
               <thead>
               {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                     {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                           {column.render('Header')}
                           <span>
                              {column.isSorted
                                 ? column.isSortedDesc
                                    ? ' 🔽'
                                    : ' 🔼'
                                 : ''}
                           </span>
                           <div>{column.canFilter ? column.render('Filter') : null}</div>
                        </th>
                     ))}
                  </tr>
               ))}
               </thead>

               <tbody {...getTableBodyProps()}>
               {page.map(row => {
                  prepareRow(row)
                  return (
                     <tr {...row.getRowProps()} >
                     {row.cells.map(cell => {
                        
                        if(cell.column.Header === "Mark Completed") {
                           if(cell.value === "Y") {
                              return ( 
                                 <td style={{background:"lightgreen"}} {...cell.getCellProps()}>{cell.render("Cell")}
                                 </td>
                              )
                           }
                           //logger("Cell Properties are ", cell.value)
                        }
                        return ( 
                           <td {...cell.getCellProps()}>{cell.render("Cell")}
                           </td>
                        )
                     })}
                     </tr>
                  )
               })}
               </tbody>
               <tfoot>
                  {footerGroups.map(footerGroup => (
                     <tr {...footerGroup.getFooterGroupProps()}>
                     {footerGroup.headers.map(column => (
                        <td {...column.getFooterProps()}>{column.render('Footer')}</td>
                     ))}
                     </tr>
                  ))}
               </tfoot>
            </table>
         </div>
         <br></br>
      </React.Fragment>
   )
}

export default MakeTable
