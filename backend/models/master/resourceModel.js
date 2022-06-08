import mongoose from 'mongoose';

const resourceSchema = mongoose.Schema(
   {
      name: {
         type: String,
         required: true
      },
      isParent: {
         type: Boolean,
         required: true
      },
      isChild: {
         type: Boolean,
         required: false
      }
   },
   {
      timestamps: true,
   }
);

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;