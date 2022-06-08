import mongoose from 'mongoose';

const ppmSchema = mongoose.Schema(
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
         reportYear: { 
            type: String, 
            required: true, 
         },
         reportType: { 
            type: String, 
            required: true,
            default: "ADJUST" 
         },
         month: [String],
         dispatchedQuantity: [Number],
         customerComplaintQty: [Number],
         targetPPMLevel: [Number],
         actualPPMLevel: [Number]
	},
   {
      timestamps: true,
   }
)

const PPMReport = mongoose.model('PPMReport', ppmSchema);

export default PPMReport;