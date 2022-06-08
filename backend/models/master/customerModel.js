import mongoose from 'mongoose';
import ModelIncrement from './modelIncrement.js';

const customerSchema = mongoose.Schema(
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
      custCode: {
         type: String,
         required: true,
         default: "C001"
      },
      custName: {
         type: String,
         required: true
      },
      custNickName: {
         type: String,
         required: false
      },
      isCustActive: {
         type: String,
         required: false,
         default: "A"
      },
      custCompanyType: {
         type: String,
         required: true
      },
      custCIN: {
         type: String,
         required: false,
         default: "-"
      },
      custUdyogAadhar: {
         type: String,
         required: false,
         default: "-"
      },
      custGST: {
         type: String,
         required: true
      },
      custURD: {
         type: String,
         required: false,
         default: "-"
      },
      custPAN: {
         type: String,
         required: true
      },
      custMSMENo: {
         type: String,
         required: false,
         default: "-"
      },
      custVendorCode: {
         type: String,
         required: false,
         default: "-"
      },
      custBillingAddress: [{
         custBillAddressLine1: {
            type: String,
            required: true
         },
         custBillAddressLine2: {
            type: String,
            required: true
         },
         custBillAddressLine3: {
            type: String,
            required: false,
            default: "-"
         },
         custBillState: {
            type: String,
            required: true
         },
         custBillCity: {
            type: String,
            required: true
         },
         custBillDistrict: {
            type: String,
            required: true
         },
         custBillPinCode: {
            type: String,
            required: true
         }
      }],
      custShipingAddress: [{
         custShipAddressLine1: {
            type: String,
            required: true
         },
         custShipAddressLine2: {
            type: String,
            required: true
         },
         custShipAddressLine3: {
            type: String,
            required: false,
            default: "-"
         },
         custShipState: {
            type: String,
            required: true
         },
         custShipCity: {
            type: String,
            required: true
         },
         custShipDistrict: {
            type: String,
            required: true
         },
         custShipPinCode: {
            type: String,
            required: true
         }
      }],
      customerAddress: [{
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
         },
         contactPersonName: {
            type: String,
            required: false
         },
         contactPersonNumber: {
            type: String,
            required: false
         }
      }],
      custContactPersonName: {
         type: String,
         required: true
      },
      custContactPersonDesignation: {
         type: String,
         required: true
      },
      custContactPersonNumber: {
         type: String,
         required: true
      },
      custContactPersonAltNum: {
         type: String,
         required: false,
         default: "-"
      },
      custContactPersonEmail: {
         type: String,
         required: false,
         default: "-"
      },
      custTelNo: {
         type: String,
         required: false,
         default: "-"
      },
      custWebsite: {
         type: String,
         required: false,
         default: "-"
      },
      custAlsoSupplier: {
         type: String,
         required: false,
         default: "N"
      },
      custBefName: {
         type: String,
         required: false,
         default: "-"
      },
      custBankName: {
         type: String,
         required: false,
         default: "-"
      },
      custAccountNumber: {
         type: String,
         required: false,
         default: "-"
      },
      custAccType: {
         type: String,
         required: false,
         default: "-"
      },
      custBankIFSCCode: {
         type: String,
         required: false,
         default: "-"
      }
   },
   {
       timestamps: true,
   }
);

// customerSchema.pre('insertMany', async function (next, docs) {
   
//    docs.map(async function (doc, index) {
//    //console.log(`For index ${index} record is `, doc)
//    doc.custId = index+1
//    if((index+1) < 10) {
//       doc.custCode = "C00"+(index+1);
//    } else if((index+1) < 100) {
//       doc.custCode = "C0"+(index+1);
//    } else {
//       doc.custCode = "C"+(index+1);
//    }
//    // if (doc.isNew) {
//    //    console.log("1. When document is new")
//    // } else {
//    //    const id = await ModelIncrement.getNextId('Customer');
//    //    console.log("2. Document is not new AND ID is === ", id)
//    //    //next();
//    // }
//    //const id = await ModelIncrement.getNextId('Customer');
//    //console.log("ID IS ", id)
//    // doc.custId = id; // Incremented
//    // if(id < 10) {
//    //    doc.custCode = "C00"+id;
//    // } else if(id < 100) {
//    //    doc.custCode = "C0"+id;
//    // } else {
//    //    doc.custCode = "C"+id;
//    // }
//    // console.log("And Customer Code is ==== ", doc.custCode)       
   
//       // } else {
//       //       next();
//       // }
//          // async hash password
//       //doc.password = await User.hashPassword(doc.password);
//     });
//    next();
   
// })

// customerSchema.pre('save', async function (next) {
//    if (this.isNew) {
//        const id = await ModelIncrement.getNextId('Customer');
//        this.custId = id; // Incremented
//        if(id < 10) {
//          this.custCode = "C00"+id;
//        } else if(id < 100) {
//          this.custCode = "C0"+id;
//        } else {
//          this.custCode = "C"+id;
//        }
       
//        next();
//    } else {
//        next();
//    }
// })


const Customer = mongoose.model("Customer", customerSchema);

export default Customer;