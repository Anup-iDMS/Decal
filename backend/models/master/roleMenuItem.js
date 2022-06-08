import mongoose from 'mongoose';

const roleMenuItemSchema = mongoose.Schema(
   {
      role: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'Role',
      },
      menuItems: [ {
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
            required: false,
            default: false
         },
         subMenuItems: [ {
            subMenuName: {
               type: String,
               required: false
            },
            subMenuLink: {
               type: String,
               required: true
            },
            subMenuStyleClass: {
               type: String,
               required: false
            }
         }],
      }],
      
      
   },
   {
       timestamps: true,
   }
);

const RoleMenuItem = mongoose.model("RoleMenuItem", roleMenuItemSchema);

export default RoleMenuItem;