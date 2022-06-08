import mongoose from 'mongoose';

const issueSchema = mongoose.Schema(
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
      issueNumber: { 
         type: String, 
         required: false, 
      },
      issueStatus: { 
         type: String, 
         required: true,
         default: "Open" 
      },
      issueTitle: { 
         type: String, 
         required: false, 
      },
      issueDescription: { 
         type: String, 
         required: false, 
      },
      issueDate: { 
         type: Date, 
         required: true,
         default: new Date() 
      },
      issueAttachment: { 
         type: String, 
         required: false, 
      },
      issueResolution: { 
         type: String, 
         required: false, 
      },
	},
   {
      timestamps: true,
   }
)

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;