import mongoose from 'mongoose';

const serviceCodeSchema = mongoose.Schema(
   {
         company: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Company',
         },
         user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
         },
         code: {
            type: String,
            required: true,
         },
         name: {
            type: String,
            required: true,
         },
         sacId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'SAC',
         },
         sac: {
            type: String,
            required: true,
         },
         isActive: {
            type: String,
            required: false,
            default: "Yes"
         }
   },
   {
       timestamps: true,
   }
);

const ServiceCode = mongoose.model("ServiceCode", serviceCodeSchema);

export default ServiceCode;