import mongoose from 'mongoose';

const menuItem = mongoose.Schema(
   {
     name: {
         type: String,
         required: true
      },
      link: {
         type: String,
         required: true
      },
      styleclass: {
         type: String,
         required: false
      },
      hasSubMenu: {
         type: Boolean,
         required: false
      },
      subMenuItems: [{
         subMenuName: {
            type: String,
            required: false
         },
         subMenuLink: {
            type: String,
            required: false
         },
         subMenuStyleClass: {
            type: String,
            required: false
         },
      }]
   },
   {
       timestamps: true,
   }
);

const MenuItem = mongoose.model("MenuItem", menuItem);

export default MenuItem;