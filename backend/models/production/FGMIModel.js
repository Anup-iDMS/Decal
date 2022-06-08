import mongoose from 'mongoose';

const fgmiSchema = mongoose.Schema(
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
      fgmiNo: { 
         type: String, 
         required: true, 
      },
      jcNo: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'JCMaster',
      },
      source: {
         type: String,
         required: true,
         default: "FGMI",
      },
      batchDate: { 
         type: Date, 
         required: true,
         default: new Date() 
      },
      batchStatus: { 
         type: String, 
         required: true,
         default: "O" 
      },
      entryDate: { 
         type: Date, 
         required: true,
         default: new Date() 
      },
      batchQuantity: { 
         type: Number, 
         required: true,
         default: 0 
      },
      totalBatchQuantity: { 
         type: Number, 
         required: false,
         default: 0 
      },
   },
   {
        timestamps: true,
   }
)

const FGMI = mongoose.model('FGMI', fgmiSchema);

const fgmCorrectionHistorySchema = mongoose.Schema(
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
      fgmiId: {
         type: mongoose.Schema.Types.ObjectId,
         required: false,
         ref: 'FGMI',
      },
      correctionType: { 
         type: String, 
         required: true,
      },
      sourceBatch: { 
         type: Date, 
         required: true,
      },
      destinationBatch: { 
         type: Date, 
         required: false,
      },
      transferQty: { 
         type: Number, 
         required: false,
         default: 0
      },
   },
   {
        timestamps: true,
   }
)

const FGMCorrectionHistory = mongoose.model('FGMCORRECTIONHISTORY', fgmCorrectionHistorySchema);

export {
   FGMI,
   FGMCorrectionHistory
}; 