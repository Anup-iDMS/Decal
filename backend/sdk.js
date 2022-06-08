import  mongodb from 'mongodb';

var MongoClient = mongodb.MongoClient;
//const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

async function findOne() {
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

      const db = client.db("idmsprod");

      if(process.argv[2] === "si") {
        await processInvoiceData(db)
      } else if(process.argv[2] === "jc") {
        await processJCData(db)
      } else if(process.argv[2] === "so") {
        await processSOData(db)
      }
      else {
        console.log("Nothing found ----------- ")
      }
  } catch (err) {

    console.log(err);
  } finally {

    client.close();
  }
}

const processInvoiceData = async (db) => {
  try {
    console.log("here in processInvoiceData")
    let result = await db.collection('invoiceheader').aggregate([
      { $lookup:
         {
           from: 'invoicedetails',
           localField: 'drnNumber',
           foreignField: 'drnNumber',
           as: 'salesInvoiceDetails'
         }
       }
      ]).toArray();
  
    //console.log(result);
    //const d = await db.tempsalesinvoices.remove()
    const res1 = await db.collection("tempsalesinvoices").insertMany(result);
    console.log("All records inserted successfully ", res1.insertedCount);
  } catch (error) {
    console.log("Sales Invoice Migration Error ", error)
  }
}

const processJCData = async (db) => {
  try {
    console.log("here in processJCData")
    let result = await db.collection('jcheader').aggregate([
      { $lookup:
         {
           from: 'jcdetails',
           localField: 'jcno',
           foreignField: 'jcno',
           as: 'jcCustomerDetails'
         }
       }
      ]).toArray();
  
    //console.log(result);
    const res1 = await db.collection("tempjcmaster").insertMany(result);
    console.log("All records inserted successfully");
  } catch (error) {
    console.log("JC Master Migration Error ", error)
  }
} 

const processSOData = async (db) => {
  try {
    console.log("here in processSOData")
    let result = await db.collection('soheader').aggregate([
      { $lookup:
         {
           from: 'sodetails',
           localField: 'soNumber',
           foreignField: 'soNumber',
           as: 'soDetails'
         }
       }
      ]).toArray();
  
    //console.log(result);
    const res1 = await db.collection("tempsalesorder").insertMany(result);
    console.log("All records inserted successfully");
  } catch (error) {
    console.log("JC Master Migration Error ", error)
  }
} 


await findOne();