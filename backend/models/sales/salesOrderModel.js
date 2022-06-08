import mongoose from 'mongoose';

const salesOrderSchema = mongoose.Schema(
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
      soId: { 
         type: Number, 
         required: false, 
      },
      soNumber: { 
         type: String, 
         required: true, 
      },
      soDate: { 
         type: Date, 
         required: true,
         default: new Date() 
      },
      soStatus: { 
         type: Number, 
         required: true,
         default: -1 // //-1: Created 1: Open, 2: Invoiced, 0: Cancelled
      },
      customer: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
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
      soTotalAmount: { 
         type: Number, 
         required: true, 
      },
      isActive: { 
         type: String, 
         required: true,
         default: 'A' 
      },
      poNumber: { 
         type: String, 
         required: true, 
      },
      poDate: { 
         type: Date, 
         required: true, 
      },
      poFileName: { 
         type: String, 
         required: false, 
      },
      soTargetDate: { 
         type: Date, 
         required: false, 
      },
      soCancellationReason: { 
         type: String, 
         required: false, 
      },
      soDetails: [{
         lineNumber: {
            type: Number,
            required: true
         },
         jcNo: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'JCMaster',
         },
         orderedQty: {
            type: Number,
            required: true
         },
         invoicedQty: {
            type: Number,
            required: false,
            default: 0
         },
         balancedQty: {
            type: Number,
            required: false,
            default: 0
         },
         canceledQty: {
            type: Number,
            required: false,
            default: 0
         },
         canceledReason: {
            type: String,
            required: false,
            default: ''
         },
         soUnitRate: {
            type: Number,
            required: true
         },
         lineValue: {
            type: Number,
            required: true
         },
         soLineTargetDate: { 
            type: Date, 
            required: false, 
         },
         customerPONumber: { 
            type: String, 
            required: false, 
            default: "-"
         },
         customerPODate: { 
            type: Date, 
            required: false, 
         },
      }]
	},
    {
        timestamps: true,
    }
)


const SalesOrder = mongoose.model('SalesOrder', salesOrderSchema);

export default SalesOrder;