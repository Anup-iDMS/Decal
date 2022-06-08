import React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';



const TableExample = ({ customers, onDelete }) => {
   const tableColumns= [
      {id:1, name:"Customer Code"},
      {id:2, name:"Customer Name"},
      {id:3, name:"GSTIN"},
      {id:4, name:"State of Supply"},
      {id:5, name:"Contact Person"},
      
      {id:7, name:"View Address"},
      {id:8, name:"Edit"},
      {id:9, name:"Delete"},
   ]
   
   //const [sortedField, setSortedField] = React.useState(null);
   const [sortConfig, setSortConfig] = React.useState({});

   //const { products } = props;
   let sortedCustomers = [...customers];

   
   // const requestSort = key => {
   //    let direction = 'ascending';
   //    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
   //      direction = 'descending';
   //    }
   //    setSortConfig({ key, direction });
   // }

   sortedCustomers.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
         return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
         return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
   });

   return (
      <Table className='customerTable table'>
      <Thead>
        <Tr>
         {tableColumns.map((col)=>(
            <Th>
               {col.name}
            </Th>
         ))}
        </Tr>
      </Thead>
      <Tbody>
         {customers.map((customer) => (
         <Tr key={customer._id}>
            <Td>{customer.custCode}</Td>
            <Td>{customer.custName}</Td>
            <Td>{customer.custGST}</Td>
            <Td>{customer.custShipingAddress[0].custShipState}</Td>
            <Td>{customer.custContactPersonName}</Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
         </Tr>
         ))}
      </Tbody>
    </Table>
   )
}

export default TableExample
