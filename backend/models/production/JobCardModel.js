import mongoose from 'mongoose';

const jobCardSchema = mongoose.Schema(
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
      jobCardNo: { 
         type: String, 
         required: true, 
      },
      jobCardStatus: { 
         type: Number, 
         required: true,
         default: 1 
      },
      jcNo: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'JCMaster',
      },
      jcProdCode: { 
         type: mongoose.Schema.Types.ObjectId,
         required: true, 
         ref: 'ProductCode',
      },
      batchDate: { 
         type: Date, 
         required: true,
         default: new Date() 
      },
      inputQuantity: { 
         type: Number, 
         required: true,
         default: 0 
      },
      totalOutputQuantity: { 
         type: Number, 
         required: false,
         default: 0 
      },
      markCompleted: { 
         type: String, 
         required: false,
         default: "N" 
      },
      jobCardOutputDetails: [{
         outputDate: { 
            type: Date, 
            required: false,
         },
         outputQuantity: { 
            type: Number, 
            required: false,
         },
      }]
   },
   {
        timestamps: true,
   }
)

const JobCard = mongoose.model('JobCard', jobCardSchema);

export default JobCard;