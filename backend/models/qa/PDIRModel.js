import mongoose from 'mongoose';

const pdirSchema = mongoose.Schema(
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
         isActive: { 
            type: String, 
            required: true,
            default:"Yes" 
         },
         productCode: { 
            type: String, 
            required: false, 
         },
         pdirCode: { 
            type: String, 
            required: true, 
         },
         salesInvoiceNumber: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'SalesInvoice',
         },
         customer: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Customer',
         },
         pdirDate: {
            type: Date,
            required: false
         },
         disposition: {
            type: String,
            required: false
         },
         approvedBy: {
            type: String,
            required: false
         },
         invoiceLineDetails: [{
            lineDisposition: {
               type: String,
               required: false,
               default: "Approved"
            },
            lineCustomerDisposition: {
               type: String,
               required: false,
            },
            lineNumber: {
               type: Number,
               required: false
            },
            jcDescription: {
               type: String,
               required: false
            },
            partNumber: {
               type: String,
               required: false
            },
            productDescription: {
               type: String,
               required: false
            },
            batchDate: {
               type: Date,
               required: false
            },
            invoicedQty: {
               type: Number,
               required: false
            },
            pdirDetails: [{
               inspectionParameter: {
                  type: String,
                  required: false,
               },
               inspectionMethod: {
                  type: String,
                  required: false,
               },
               inspectionStandard: {
                  type: String,
                  required: false,
               },
               inspectionObservations: {
                  type: String,
                  required: false,
               },
               customerFeedback: {
                  type: String,
                  required: false,
               },
            }]
            
         }]
	},
   {
      timestamps: true,
   }
)

const PDIR = mongoose.model('PDIR', pdirSchema);

export default PDIR;