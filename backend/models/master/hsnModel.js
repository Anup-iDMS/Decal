import mongoose from 'mongoose';

const hsnSchema = mongoose.Schema(
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
      provisionType: { 
         type: String, 
         required: true, 
      },
      hsnCode: { 
         type: String, 
         required: true,
      },
      isActive: { 
         type: String, 
         required: true,
         default: "Y"
      },
      goodsDescription: { 
         type: String,
         required: true, 
      },
      sacCode: { 
         type: String, 
         required: false,
         default: "-"
      },
      serviceDescription: { 
         type: String,
         required: false, 
      },
      gstRate: { 
         type: Number,
         required: true, 
      },
      igstRate: { 
         type: Number,
         required: true, 
      },
      sgstRate: { 
         type: Number,
         required: true, 
      },
      cgstRate: { 
         type: Number,
         required: true, 
      },
      ugstRate: { 
         type: Number,
         required: true, 
      },
   },
   {
        timestamps: true,
   }
)

const HSNSAC = mongoose.model('HSNSAC', hsnSchema);

export default HSNSAC;