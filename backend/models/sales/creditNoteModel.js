import mongoose from 'mongoose';

const creditNoteSchema = mongoose.Schema(
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
      creditNoteNumber: { 
         type: String, 
         required: true, 
      },
      creditNoteDate: { 
         type: Date, 
         required: true, 
         default: new Date()
      },
      customer: { 
         type: mongoose.Schema.Types.ObjectId,
         required: false,
         ref: 'Customer',
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
      creditNoteAmount: { 
         type: Number, 
         required: true, 
      },
      creditNoteReason: { 
         type: String, 
         required: false, 
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
      creditNoteTotalAmount: { 
         type: Number, 
         required: true, 
      },
      creditNoteTotalCGSTAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      creditNoteTotalSGSTAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      creditNoteTotalIGSTAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      creditNoteTotalUGSTAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      creditNoteTotalTaxAmount: { 
         type: Number, 
         required: false,
         default: 0 
      },
      creditNoteTotalAmountWithTax: { 
         type: Number, 
         required: false,
         default: 0 
      },
      creditNoteDetails: [{
         creditNoteLineNumber: {
            type: Number,
            required: true
         },
         jcNo: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'JCMaster',
         },
         jcDescription: {
            type: String,
            required: false,
         },
         returnedQty: {
            type: Number,
            required: false,
            default: 0
         },
         unitRate: {
            type: Number,
            required: true
         },
         creditLineValue: {
            type: Number,
            required: true
         },
         debitNoteRef: {
            type: String,
            required: false,
         },
         taxInvoiceRef: {
            type: String,
            required: false,
         },
         gstRate: {
            type: Number,
            required: false,
            default: 0
         },
         igstRate: {
            type: Number,
            required: false,
            default: 0
         },
         cgstRate: {
            type: Number,
            required: false,
            default: 0
         },
         sgstRate: {
            type: Number,
            required: false,
            default: 0
         },
         ugstRate: {
            type: Number,
            required: false,
            default: 0
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
         },
         creditLineReason: {
            type: String,
            required: false
         }
      }]
   },
   {
      timestamps: true,
   }
)


const CreditNote = mongoose.model('CreditNote', creditNoteSchema);

export default CreditNote;