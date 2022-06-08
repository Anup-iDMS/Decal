import mongoose from 'mongoose';

const messageSchema = mongoose.Schema(
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
         messageCode: { 
            type: String, 
            required: true, 
         },
         eventType: { 
            type: String, 
            required: true, 
         },
         eventTypeId: { 
            type: String, 
            required: false, 
         },
         eventTypeCode: { 
            type: String, 
            required: false, 
         },
         communicationType: {
            type: String, 
            required: false, 
         },
         successFlag: { 
            type: String, 
            required: true,
            default: "N" 
         },
         failedCount: {
            type: Number, 
            required: true,
            default: 0
         }
	},
   {
      timestamps: true,
   }
)

const Message = mongoose.model('Message', messageSchema);

export default Message;