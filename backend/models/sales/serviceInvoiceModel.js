import mongoose from 'mongoose';

const serviceInvoiceSchema = mongoose.Schema(
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
      serviceInvoiceNumber: {
         type: String, 
         required: true,
         unique: true 
      },
      serviceInvoiceDate: { 
         type: Date, 
         required: true,
         default: new Date() 
      },
      serviceInvoiceStatus: { 
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
      serviceInvoiceTotalAmount: { 
         type: Number, 
         required: true, 
      },
      serviceInvoiceTotalCGSTAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      serviceInvoiceTotalSGSTAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      serviceInvoiceTotalIGSTAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      serviceInvoiceTotalUGSTAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      serviceInvoiceTotalTaxAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      serviceInvoiceTotalAmountWithTax: { 
         type: Number, 
         required: false,
         default: 0 
      },
      isActive: { 
         type: String, 
         required: true,
         default: 'A' 
      },
      serviceInvoiceDetails: [{
         serviceInvoiceLineNumber: {
            type: Number,
            required: true
         },
         serviceNo: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'ServiceMaster',
         },
         invoicedQty: {
            type: Number,
            required: false,
            default: 1
         },
         serviceInvoiceUnitRate: {
            type: Number,
            required: true
         },
         serviceInvoiceLineValue: {
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


const ServiceInvoice = mongoose.model('ServiceInvoice', serviceInvoiceSchema);

export default ServiceInvoice;