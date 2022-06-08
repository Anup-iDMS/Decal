
import React from 'react'
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { format } from 'date-fns'
import downloadExcel from './../../assets/download_excel.png'

const ExportCSV = ({ csvData, fileName, removeColumns=[], headings=[] }) => {
  
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let defaultRemoveColumns = ["createdBy", "_id", "soId", "jcId", "company", "updatedBy","updatedBy","createdAt","updatedAt","__v","isActive", "soStatus", "soDetails"]
  const fileExtension = '.xlsx';
  if(removeColumns.length === 0) {
    removeColumns = [...defaultRemoveColumns]
  } else {
    removeColumns = [...defaultRemoveColumns, ...removeColumns]
  }
  console.log("Columns to be removed are ")
  console.log(removeColumns)
  const exportToCSV = (csvData, fileName) => {
    csvData.forEach(function(data) {
      let sdk = Object.keys(data);
      for (let index = 0; index < sdk.length; index++) {
        for (let i = 0; i < removeColumns.length; i++) {
          if(sdk[index]===removeColumns[i]) {
            delete data[removeColumns[i]];
          }
        }
      }
    })

    csvData.forEach(d=>{
      let objPropLen = Object.keys(d);
      console.log("Object is ==== ", d)
      for (let index = 0; index < objPropLen.length; index++) {
        const element = objPropLen[index];
        if(element.indexOf("Date") !== -1 || element.indexOf("date") !== -1) {
          console.log("Getting all keys of an object ==== ", d[element])
          if(d[element] !== undefined && d[element] !== "") {
            d[element] = format(new Date(d[element]), 'dd-MMM-yyyy')
          }
        }
        if(element.indexOf("Customer") !== -1 || element.indexOf("customer") !== -1) {
          console.log("????????????? d[element].custName ==== ", d[element].custName)
          console.log("????????????? d[element]  ==== ", d[element])
          if(d[element].custName !== undefined) {
            d[element] = d[element].custName
          }
        }
      }
      /*
      d.batchDate = format(new Date(d.batchDate), 'dd-MMM-yyyy')
      d.salesInvoiceDate = format(new Date(d.salesInvoiceDate), 'dd-MMM-yyyy')
      d.batchDate = format(new Date(d.batchDate), 'dd-MMM-yyyy')
      d.docketDate = format(new Date(d.docketDate), 'dd-MMM-yyyy')
      */
    })
    /*const nm = csvData.map(({
      machineCode: Machine_Code,
      modelNo: Model_No,
      serialNo: Serial_No,
      purchaseDate: Purchase_Date,
      name: Machine_Name,
      ...rest
    }) => ({
      Machine_Code,
      Model_No,
      Serial_No,
      Purchase_Date,
      Machine_Name,
      ...rest
    }));*/
    let ws;
    if(headings.length > 0) {
      ws = XLSX.utils.json_to_sheet(csvData, { origin: 'A2', skipHeader: true });
      XLSX.utils.sheet_add_aoa(ws, [headings]); //heading: array of arrays
    } else {
      ws = XLSX.utils.json_to_sheet(csvData);
    }
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    //XLSX.utils.book_append_sheet(wb, ws);
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  return (
    <Button
      className='btn-sm'
      variant="primary"
      style={{background:"#489A47", color:"black"}} 
      onClick={(e) => exportToCSV(csvData,fileName)}>
        <i className="fas fa-file-excel fa-2x"></i>&nbsp;&nbsp;Export to Excel
       { /*<Image src={downloadExcel} style={{height:"40px", width:"40px"}} fluid /> *?}
        {/*<i className="fas fa-file-download fa-2x"></i>*/}
    </Button>
  )
}

export default ExportCSV
