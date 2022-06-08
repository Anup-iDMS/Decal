import mongoose from 'mongoose';

const companySchema = mongoose.Schema(
    {
      updatedBy: {
         type: mongoose.Schema.Types.ObjectId,
         required: false,
         ref: 'User',
      },
      name: {
         type: String,
         required: true,
      },
      address: {
            type: String,
            required: true,
      },
      pinCode: {
            type: String,
            required: true,
      },
      logo: {
            type: String,
            required: false,
      },
      contactNumber: {
         type: String,
         required: false,
      },
      alternateContactNumber: {
         type: String,
         required: false,
      },
      website: {
         type: String,
         required: false,
      },
      contactPerson: {
         type: String,
         required: false,
      },
      isCompanyActive: {
            type: Boolean,
            required: false,
            default: true
      },
      companyAddress: [{
         addressType: {
            type: String,
            required: false
         },
         addressLine1: {
            type: String,
            required: false
         },
         addressLine2: {
            type: String,
            required: false
         },
         addressLine3: {
            type: String,
            required: false,
            default: "-"
         },
         state: {
            type: String,
            required: false
         },
         city: {
            type: String,
            required: false
         },
         district: {
            type: String,
            required: false
         },
         pinCode: {
            type: String,
            required: false
         }
      }],
    },
    {
        timestamps: true,
    }
);

const Company = mongoose.model("Company", companySchema);

export default Company;