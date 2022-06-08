import mongoose from 'mongoose';

const inspectionMethodSchema = mongoose.Schema(
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
         inspectionMethodCode: { 
            type: String, 
            required: true, 
         },
         inspectionMethodName: { 
            type: String, 
            required: true, 
         },
	},
   {
      timestamps: true,
   }
)

const InspectionMethod = mongoose.model('InspectionMethod', inspectionMethodSchema);

export default InspectionMethod;