import mongoose from 'mongoose';

const drnSchema = mongoose.Schema(
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
      drnNumber: { 
         type: String, 
         required: true, 
      },
      drnDate: { 
         type: Date, 
         required: true,
         default: new Date() 
      },
      drnStatus: { 
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
      qaRemark: { 
         type: String, 
         required: false,
         default: "-" 
      },
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
      drnTotalAmount: { 
         type: Number, 
         required: true, 
      },
      drnTotalCGSTAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      drnTotalSGSTAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      drnTotalIGSTAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      drnTotalUGSTAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      drnTotalTaxAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      drnTotalAmountWithTax: { 
         type: Number, 
         required: false,
         default: 0 
      },
      isActive: { 
         type: String, 
         required: true,
         default: 'A' 
      },
      drnDetails: [{
         drnLineNumber: {
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
            required: true,
            default:1,
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
         drnUnitRate: {
            type: Number,
            required: true
         },
         drnLineValue: {
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


const DRN = mongoose.model('DRN', drnSchema);

export default DRN;