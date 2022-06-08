import mongoose from 'mongoose';

const inspectionParameterSchema = mongoose.Schema(
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
         inspectionParameterCode: { 
            type: String, 
            required: true, 
         },
         inspectionParameterName: { 
            type: String, 
            required: true, 
         },
	},
   {
      timestamps: true,
   }
)

const InspectionParameter = mongoose.model('InspectionParameter', inspectionParameterSchema);

export default InspectionParameter;