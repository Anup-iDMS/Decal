import mongoose from 'mongoose';

const pdirTemplateSchema = mongoose.Schema(
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
         pdirTemplateCode: { 
            type: String, 
            required: true, 
         },
         pdirTemplateName: { 
            type: String, 
            required: true, 
         },
         pdirDetails: [{
            lineNumber: {
               type: Number,
               required: false
            },
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
         }]
	},
   {
      timestamps: true,
   }
)

const PDIRTemplate = mongoose.model('PDIRTemplate', pdirTemplateSchema);

export default PDIRTemplate;