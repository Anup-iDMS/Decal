import mongoose from 'mongoose';
import ModelIncrement from './modelIncrement.js';

const jcMasterSchema = mongoose.Schema(
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
         jcId: { 
            type: Number, 
            required: false, 
            default: 0,
         },
         jcno: { 
            type: String, 
            required: true, 
         },
         jcProdCategory: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true, 
            ref: 'ProductCategory',
         },
         jcProdCode: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true, 
            ref: 'ProductCode',
         },
         jcDescription: { 
            type: String, 
            required: true, 
            default: "-"
         },
         unit: { 
            type: String, 
            required: true, 
            default: "-"
         },
         customerPartNumber: { 
            type: String, 
            required: false, 
            default: "-"
         },
         hsn: { 
            type: Number, 
            required: true, 
         },
         artUOM: { 
            type: String, 
            required: false, 
            default: "-"
         },
         adWidth: { 
            type: Number, 
            required: false, 
            default: 0
         },
         adHeight: { 
            type: Number, 
            required: false, 
            default: 0
         },
         adArea: { 
            type: Number, 
            required: false, 
            default: 0
         },
         prodLayoutUOM: { 
            type: String, 
            required: true, 
            default: ""
         },
         prodLayoutWidth: { 
            type: Number, 
            required: true, 
            default: 0
         },
         prodLayoutHeight: { 
            type: Number, 
            required: true, 
            default: 0
         },
         prodLayoutWidthUps: { 
            type: Number, 
            required: true, 
            default: 0
         },
         prodLayoutHeightUps: { 
            type: Number, 
            required: true, 
            default: 0
         },
         prodLayoutArea: { 
            type: Number, 
            required: true, 
            default: 0
         },
         prodLayoutTotalUps: { 
            type: Number, 
            required: true, 
            default: 0
         },
         bomUOM: { 
            type: String, 
            required: true, 
            default: "-"
         },
         bomWidth: { 
            type: Number, 
            required: true, 
            default: 0
         },
         bomHeight: { 
            type: Number, 
            required: true, 
            default: 0
         },
         bomArea: { 
            type: Number, 
            required: true, 
            default: 0
         },
         colour1: { 
            type: String, 
            required: false, 
            default: "-"
         },
         colour2: { 
            type: String, 
            required: false, 
            default: "-"
         },
         colour3: { 
            type: String, 
            required: false, 
            default: "-"
         },
         colour4: { 
            type: String, 
            required: false, 
            default: "-"
         },
         colour5: { 
            type: String, 
            required: false, 
            default: "-"
         },
         colour6: { 
            type: String, 
            required: false, 
            default: "-"
         },
         colour7: { 
            type: String, 
            required: false, 
            default: "-"
         },
         colour8: { 
            type: String, 
            required: false, 
            default: "-"
         },
         colour9: { 
            type: String, 
            required: false, 
            default: "-"
         },
         colour10: { 
            type: String, 
            required: false, 
            default: "-"
         },
         colour11: { 
            type: String, 
            required: false, 
            default: "-"
         },
         colour12: { 
            type: String, 
            required: false, 
            default: "-"
         },
         colour13: { 
            type: String, 
            required: false, 
            default: "-"
         },
         colour14: { 
            type: String, 
            required: false, 
            default: "-"
         },
         colour15: { 
            type: String, 
            required: false, 
            default: "-"
         },
         totalColors: { 
            type: Number, 
            required: false, 
            default: 0
         },
         proposedMachine: {
            type: String, 
            required: false, 
            default: "-" 
            // type: mongoose.Schema.Types.ObjectId,
            // required: false,
            // ref: 'MachineMaster',
         },
         prodRemarks: { 
            type: String, 
            required: false, 
            default: "-"
         },
         isActive: { 
            type: String, 
            required: true, 
            default: "A"
         },
         positiveRemarks: { 
            type: String, 
            required: false, 
            default: "-"
         },
         jcCustomerDetails: [{
            customerId: {
               type: mongoose.Schema.Types.ObjectId,
               required: false,
               ref: 'Customer',
            },
            customerPrice: {
               type: Number, 
               required: false,
               default: 0
            },
            customer: {
               type: String, 
               required: false,
            },
            jc_desc: {
               type: String, 
               required: false,
            },
            cpin: {
               type: String, 
               required: false,
            },
            id: {
               type: String, 
               required: false,
            },
            srno: { 
               type: String, 
               required: false, 
               default: "1"
            },
            egst: { 
               type: Number, 
               required: false, 
               default: 0
            },
            isCustomerJCActive: { 
               type: String, 
               required: false, 
               default: "A"
            },
            customerPONumber: { 
               type: String, 
               required: false, 
               default: "-"
            },
            customerPODate: { 
               type: Date, 
               required: false, 
            },
            isCustomerPOActive: { 
               type: String, 
               required: false, 
               default: "Yes"
            },
            revision:{
               type: String, 
               required: false, 
               default: "1.0"
            },
            tmo:{
               type: Number, 
               required: false, 
               default: 0
            }
         }]
         // company: { 
         //    type: String, 
         //    required: true, 
         //    default: ""
         // },
         // createdBy: { 
         // type: String, 
         // required: true, 
         // default: ""
         // },
         // updatedBy: { 
         // type: String, 
         // required: true, 
         // default: ""
         // },
         
   },
   {
       timestamps: true,
   }
);

// jcMasterSchema.pre('save', async function (next) {
//    console.log("Inside presave ==== ")
//    if (this.isNew) {
//       console.log("Inside IFFFFFF presave ==== ")
//       const id = await ModelIncrement.getNextId('JCMaster');
//       console.log("Inside presave and id ==== ", id)
//       this.jcId = id; // Incremented
//       if(id < 10) {
//       this.jcno = "S000"+id;
//       } else if(id < 1000) {
//          this.jcno = "S0"+id;
//       } else if(id < 100) {
//          this.jcno = "S00"+id;
//       } else {
//          this.jcno = "S000"+id;
//       }
//       next();
//    } else {
//       next();
//    }
// })

jcMasterSchema.pre('insertMany', async function (next, docs) {
   
   docs.map(async function (doc, index) {
      //console.log(`For index ${index} record is `, doc)
      doc.jcId = index+1
      // if((index+1) < 10) {
      //    doc.custCode = "C00"+(index+1);
      // } else if((index+1) < 100) {
      //    doc.custCode = "C0"+(index+1);
      // } else {
      //    doc.custCode = "C"+(index+1);
      // }
   });
   next();
   
})

const JCMaster = mongoose.model("JCMaster", jcMasterSchema);

export {
   JCMaster
}