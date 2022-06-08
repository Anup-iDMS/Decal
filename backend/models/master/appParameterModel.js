import mongoose from 'mongoose';

const appParameter = mongoose.Schema(
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
         appParameterCode: { 
            type: String, 
            required: true, 
         },
         appParameterAppCode: { 
            type: String, 
            required: true, 
         },
         appParameterName: { 
            type: String, 
            required: true, 
         },
         appParameterValue: { 
            type: String, 
            required: true, 
         },
	},
   {
      timestamps: true,
   }
)

const AppParameter = mongoose.model('AppParameter', appParameter);

export default AppParameter;