import mongoose from 'mongoose';

const sacSchema = mongoose.Schema(
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
         required: false,
      },
      isActive: { 
         type: String, 
         required: true,
         default: "Y"
      },
      goodsDescription: { 
         type: String,
         required: false, 
      },
      sacCode: { 
         type: String, 
         required: true,
      },
      serviceDescription: { 
         type: String,
         required: true, 
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

const SAC = mongoose.model('SAC', sacSchema);

export default SAC;