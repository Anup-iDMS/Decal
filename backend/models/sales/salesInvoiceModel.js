import mongoose from 'mongoose';

const salesInvoiceSchema = mongoose.Schema(
	{
		company: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'Company',
      },
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         required: false,
         ref: 'User',
      },
      updatedBy: {
         type: mongoose.Schema.Types.ObjectId,
         required: false,
         ref: 'User',
      },
      salesInvoiceNumber: {
         type: String, 
         required: true,
         unique: true 
      },
      drnNumber: { 
         type: String, 
         required: false, 
      },
      salesInvoiceDate: { 
         type: Date, 
         required: true,
         default: new Date() 
      },
      salesInvoiceStatus: { 
         type: String, 
         required: true,
         default: "O"
      },
      customer: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'Customer',
      },
      paymentTerms:{
         type: String, 
         required: true,
         default: "Within 30 Days"
      },
      supplierAddressIndex: { 
         type: Number, 
         required: false,
         default: 0 
      },
      supplierAddress: [{
         addressLine1: {
            type: String,
            required: false
         },
         addressLine2: {
            type: String,
            required: false
         },
         addressLine3: {
            type: String,
            required: false,
            default: "-"
         },
         state: {
            type: String,
            required: false
         },
         city: {
            type: String,
            required: false
         },
         district: {
            type: String,
            required: false
         },
         pinCode: {
            type: String,
            required: false
         }
      }],
      customerBillingAddressIndex: { 
         type: Number, 
         required: false,
         default: 0 
      },
      customerBillingAddress: [{
         addressLine1: {
            type: String,
            required: false
         },
         addressLine2: {
            type: String,
            required: false
         },
         addressLine3: {
            type: String,
            required: false,
            default: "-"
         },
         state: {
            type: String,
            required: false
         },
         city: {
            type: String,
            required: false
         },
         district: {
            type: String,
            required: false
         },
         pinCode: {
            type: String,
            required: false
         },
         contactPersonName: {
            type: String,
            required: false
         },
         contactPersonNumber: {
            type: String,
            required: false
         }
      }],
      customerShipingAddressIndex: { 
         type: Number, 
         required: false,
         default: 0 
      },
      customerShipingAddress: [{
         addressLine1: {
            type: String,
            required: false
         },
         addressLine2: {
            type: String,
            required: false
         },
         addressLine3: {
            type: String,
            required: false,
            default: "-"
         },
         state: {
            type: String,
            required: false
         },
         city: {
            type: String,
            required: false
         },
         district: {
            type: String,
            required: false
         },
         pinCode: {
            type: String,
            required: false
         },
         contactPersonName: {
            type: String,
            required: false
         },
         contactPersonNumber: {
            type: String,
            required: false
         }
      }],
      billState: { 
         type: String, 
         required: true, 
      },
      billPinCode: { 
         type: String, 
         required: true, 
      },
      shipState: { 
         type: String, 
         required: true, 
      },
      shipPinCode: { 
         type: String, 
         required: true, 
      },
      salesInvoiceTotalAmount: { 
         type: Number, 
         required: true, 
      },
      salesInvoiceTotalCGSTAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      salesInvoiceTotalSGSTAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      salesInvoiceTotalIGSTAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      salesInvoiceTotalUGSTAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      salesInvoiceTotalTaxAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      salesInvoiceTotalAmountWithTax: { 
         type: Number, 
         required: false,
         default: 0 
      },
      isActive: { 
         type: String, 
         required: true,
         default: 'A' 
      },
      salesInvoiceDetails: [{
         salesInvoiceLineNumber: {
            type: Number,
            required: true
         },
         soNo: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'SalesOrder',
         },
         soLineNumber: {
            type: Number,
            required: false
         },
         batchId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'FGMI'
         },
         batchDate: {
            type: Date,
            required: true
         },
         jcNo: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'JCMaster',
         },
         dispatchQty: {
            type: Number,
            required: true
         },
         invoicedQty: {
            type: Number,
            required: false,
            default: 0
         },
         salesInvoiceUnitRate: {
            type: Number,
            required: true
         },
         salesInvoiceLineValue: {
            type: Number,
            required: true
         },
         igstAmt: {
            type: Number,
            required: false,
            default: 0
         },
         cgstAmt: {
            type: Number,
            required: false,
            default: 0
         },
         sgstAmt: {
            type: Number,
            required: false,
            default: 0
         },
         ugstAmt: {
            type: Number,
            required: false,
            default: 0
         }
      }]
	},
   {
      timestamps: true,
   }
)


const SalesInvoice = mongoose.model('SalesInvoice', salesInvoiceSchema);

export default SalesInvoice;