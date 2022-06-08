import mongoose from 'mongoose';
import ModelIncrement from './modelIncrement.js';

const serviceMasterSchema = mongoose.Schema(
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
      serviceCode: { 
         type: String, 
         required: true, 
      },
      serviceDescription: { 
         type: String, 
         required: true, 
         default: "-"
      },
      unit: { 
         type: String, 
         required: true, 
         default: "-"
      },
      sac: { 
         type: mongoose.Schema.Types.ObjectId,
         required: true, 
         ref: 'HSNSAC',
      },
      isActive: { 
         type: String, 
         required: true, 
         default: "Yes"
      },
      servicePrice: { 
         type: Number, 
         required: true, 
         default: 0
      },
   },
   {
       timestamps: true,
   }
);

const ServiceMaster = mongoose.model("ServiceMaster", serviceMasterSchema);

export default ServiceMaster;