import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import { customers } from './data/customers.js'
import { jcs } from './data/jcmaster.js';
import { sos } from './data/salesorders.js';
import { jobs } from './data/jobcards.js';
import { fgmis } from './data/fgmis.js';
import { drns } from './data/drns.js';
import { invoices } from './data/invoices.js';
import connectDB from './config/db.js';


import Customer from './models/master/customerModel.js';

import { JCMaster } from './models/master/jcMasterModel.js';
import SalesOrder from './models/sales/salesOrderModel.js'
import JobCard from './models/production/JobCardModel.js';
import { FGMI } from './models/production/FGMIModel.js';
import DRN from './models/drn/drnModel.js';
import SalesInvoice from './models/sales/salesInvoiceModel.js';
// const products = require("./data/products")

// const User = require("./models/userModel");

// const Product = require("./models/productModel");

// const Order = require("./models/orderModel");

//const connectDB = require("./config/db")

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Customer.deleteMany();

        const createdCustomers = await Customer.insertMany(customers);
        console.log("created all customers successfulyy..".cyan.underline)
        console.log("Data Imported Successfully !!!! ".green.bold);
        process.exit();

    } catch (error) {
        console.log("Error in importing data.... ".red.inverse);
        console.log(error);
        process.exit(1);
    }
}

const destroyData = async () => {
    try {
        await JCMaster.deleteMany();
        console.log("Data Deleted Successfully !!!! ".green.inverse);
        process.exit();

    } catch (error) {
        console.log("Error in deleting data.... ".red.inverse);
        console.log(error);
        process.exit(1);
    }
}

const destroyJCData = async () => {
    try {
        await JCMaster.deleteMany();
        console.log("JCMaster Data Deleted Successfully !!!! ".green.inverse);
        process.exit();

    } catch (error) {
        console.log("Error in deleting data.... ".red.inverse);
        console.log(error);
        process.exit(1);
    }
}


const importJCData = async () => {
    try {
        await JCMaster.deleteMany();
        console.log("JCMaster Data Deleted Successfully !!!! ".green.inverse);
        const createdSOs = await JCMaster.insertMany(jcs);
        console.log("created all JCs successfulyy..".cyan.underline)
        console.log("Data Imported Successfully !!!! ".green.bold);
        process.exit();

    } catch (error) {
        console.log("Error in importing data.... ".red.inverse);
        console.log(error);
        process.exit(1);
    }
}

const importSOData = async () => {
    try {
        await SalesOrder.deleteMany();
        console.log("SalesOrder Data Deleted Successfully !!!! ".red.inverse);
        const createdJCs = await SalesOrder.insertMany(sos);
        console.log("created all SalesOrders successfulyy..".cyan.underline)
        console.log("SalesOrder Data Imported Successfully !!!! ".green.bold);
        process.exit();

    } catch (error) {
        console.log("Error in importing SalesOrder data.... ".red.inverse);
        console.log(error);
        process.exit(1);
    }
}

const importJobCardData = async () => {
    try {
        await JobCard.deleteMany();
        console.log("JobCard Data Deleted Successfully !!!! ".red.inverse);
        const createdJobs = await JobCard.insertMany(jobs);
        console.log("created all JobCard successfulyy..".cyan.underline)
        console.log("JobCard Data Imported Successfully !!!! ".green.bold);
        process.exit();

    } catch (error) {
        console.log("Error in importing SalesOrder data.... ".red.inverse);
        console.log(error);
        process.exit(1);
    }
}

const importFGMIData = async () => {
    try {
        await FGMI.deleteMany();
        console.log("FGMI Data Deleted Successfully !!!! ".red.inverse);
        const createdFGMIs = await FGMI.insertMany(fgmis);
        console.log("created all FGMI successfulyy..".cyan.underline)
        console.log("FGMI Data Imported Successfully !!!! ".green.bold);
        process.exit();

    } catch (error) {
        console.log("Error in importing FGMI data.... ".red.inverse);
        console.log(error);
        process.exit(1);
    }
}

const importDRNData = async () => {
    try {
        await DRN.deleteMany();
        console.log("DRN Data Deleted Successfully !!!! ".red.inverse);
        const createdDRNs = await DRN.insertMany(drns);
        console.log("created all DRN successfulyy..".cyan.underline)
        console.log("DRN Data Imported Successfully !!!! ".green.bold);
        process.exit();

    } catch (error) {
        console.log("Error in importing DRN data.... ".red.inverse);
        console.log(error);
        process.exit(1);
    }
}

const importSalesInvoiceData = async () => {
    try {
        await SalesInvoice.deleteMany();
        console.log("SalesInvoice Data Deleted Successfully !!!! ".red.inverse);
        const createdSalesInvoices = await SalesInvoice.insertMany(invoices);
        console.log("created all SalesInvoice successfulyy..".cyan.underline)
        console.log("SalesInvoice Data Imported Successfully !!!! ".green.bold);
        process.exit();

    } catch (error) {
        console.log("Error in importing SalesInvoice data.... ".red.inverse);
        console.log(error);
        process.exit(1);
    }
}



if(process.argv[2] === "-d") {
    console.log("1........... Destroying CUSTOMER data..........")
    destroyData()
} else if(process.argv[2] === "-jc") {
    console.log("3........... Destroying JC data..........")
    destroyJCData()
} else if(process.argv[2] === "jc") { 
    console.log("4........... Adding JC MASTER data..........")
    importJCData();
}  else if(process.argv[2] === "so") { 
    console.log("4........... Adding SALES ORDER data..........")
    importSOData();
} else  if(process.argv[2] === "cust") { 
    console.log("2........... Adding CUSTOMER data..........")
    importData();
} else  if(process.argv[2] === "job") { 
    console.log("2........... Adding JobCardData data..........")
    importJobCardData();
} else  if(process.argv[2] === "fgmi") { 
    console.log("2........... Adding FGMI data..........")
    importFGMIData();
} else  if(process.argv[2] === "drn") { 
    console.log("2........... Adding DRN data..........")
    importDRNData();
} else  if(process.argv[2] === "si") { 
    console.log("2........... Adding Sales Invoices data..........")
    importSalesInvoiceData();
}






