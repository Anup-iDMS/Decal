import mongoose from 'mongoose';

const deliveryNoteSchema = mongoose.Schema(
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
      deliveryNumber: { 
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
      deliveryStatus: {
         type: String,
         required: true,
         default: "DN"
      },
      dispatchDate: {
         type: Date,
         required: false
      },
      invoiceValue: {
         type: Number,
         required: false
      },
      transporter: { 
         type: String, 
         required: false, 
      },
      modeOfTransport: { 
         type: String, 
         required: false, 
      },
      freightCharges: { 
         type: Number, 
         required: false, 
      },
      freightType: { 
         type: String, 
         required: false, 
      },
      deliveryType: { 
         type: String, 
         required: false, 
      },
      docketNumber: { 
         type: String, 
         required: false, 
      },
      docketDate: { 
         type: Date, 
         required: false, 
      },
      freightPercent: { 
         type: Number, 
         required: false, 
      },
      totalBoxes: { 
         type: Number, 
         required: false, 
      },
      totalBoxWeight: { 
         type: Number, 
         required: false, 
      },
      deliveryDetails: [{
         descriptionOfGoods: { 
            type: String, 
            required: false, 
         },
         quantity: { 
            type: Number, 
            required: false, 
         },
         batchDate: { 
            type: Date, 
            required: false, 
         },
         poNumber: { 
            type: String, 
            required: false, 
         },
         boxNumber: { 
            type: String, 
            required: false, 
         },
      }],
   },
   {
      timestamps: true,
   }
)


const DeliveryNote = mongoose.model('DeliveryNote', deliveryNoteSchema);

export default DeliveryNote;