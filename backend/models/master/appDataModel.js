import mongoose from 'mongoose';

const productCategorySchema = mongoose.Schema(
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
         name: {
            type: String,
            required: true,
         },
         isActive: {
               type: Boolean,
               required: false,
               default: true
         }
    },
    {
        timestamps: true,
    }
);

const ProductCategory = mongoose.model("ProductCategory", productCategorySchema);

const productCodeSchema = mongoose.Schema(
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
         name: {
            type: String,
            required: true,
         },
         hsn: {
            type: String,
            required: true,
         },
         isActive: {
            type: Boolean,
            required: false,
            default: true
         }
   },
   {
       timestamps: true,
   }
);

const ProductCode = mongoose.model("ProductCode", productCodeSchema);

const uomSchema = mongoose.Schema(
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
         name: {
            type: String,
            required: true,
         },
         isActive: {
               type: Boolean,
               required: false,
               default: true
         }
   },
   {
       timestamps: true,
   }
);

const UOM = mongoose.model("UOM", uomSchema);

const machineMasterSchema = mongoose.Schema(
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
      machineCode: { 
         type: String, 
         required: true,
      },
      name: {
         type: String,
         required: true,
      },
      isActive: {
            type: String,
            required: false,
            default: "Y"
      },
      modelNo: {
         type: String,
         required: true,
         default:"-"
      },
      serialNo: {
         type: String,
         required: true,
         default:"-"
      },
      purchaseDate: {
         type: Date,
         required: false,
         default:new Date()
      },
   },
   {
       timestamps: true,
   }
);

const MachineMaster = mongoose.model("MachineMaster", machineMasterSchema);

export {
   ProductCategory,
   ProductCode,
   UOM,
   MachineMaster
} 