import mongoose from 'mongoose'

const supplierSchema = mongoose.Schema(
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
    supplierCode: {
      type: String,
      required: true,
      default: 'S0001',
    },
    supplierName: {
      type: String,
      required: true,
    },
    supplierNickName: {
      type: String,
      required: false,
    },
    isSupplierActive: {
      type: String,
      required: false,
      default: 'A',
    },
    supplierCompanyType: {
      type: String,
      required: true,
    },
    supplierCIN: {
      type: String,
      required: false,
      default: '-',
    },
    supplierUdyogAadhar: {
      type: String,
      required: false,
      default: '-',
    },
    supplierGST: {
      type: String,
      required: true,
    },
    supplierURD: {
      type: String,
      required: false,
      default: '-',
    },
    supplierPAN: {
      type: String,
      required: true,
    },
    supplierMSMENo: {
      type: String,
      required: false,
      default: '-',
    },
    supplierVendorCode: {
      type: String,
      required: false,
      default: '-',
    },
    supplierBillingAddress: [
      {
        supplierBillAddressLine1: {
          type: String,
          required: true,
        },
        supplierBillAddressLine2: {
          type: String,
          required: true,
        },
        supplierBillAddressLine3: {
          type: String,
          required: false,
          default: '-',
        },
        supplierBillState: {
          type: String,
          required: true,
        },
        supplierBillCity: {
          type: String,
          required: true,
        },
        supplierBillDistrict: {
          type: String,
          required: true,
        },
        supplierBillPinCode: {
          type: String,
          required: true,
        },
      },
    ],
    supplierShipingAddress: [
      {
        supplierShipAddressLine1: {
          type: String,
          required: true,
        },
        supplierShipAddressLine2: {
          type: String,
          required: true,
        },
        supplierShipAddressLine3: {
          type: String,
          required: false,
          default: '-',
        },
        supplierShipState: {
          type: String,
          required: true,
        },
        supplierShipCity: {
          type: String,
          required: true,
        },
        supplierShipDistrict: {
          type: String,
          required: true,
        },
        supplierShipPinCode: {
          type: String,
          required: true,
        },
      },
    ],
    supplierAddress: [
      {
        addressType: {
          type: String,
          required: false,
        },
        addressLine1: {
          type: String,
          required: false,
        },
        addressLine2: {
          type: String,
          required: false,
        },
        addressLine3: {
          type: String,
          required: false,
          default: '-',
        },
        state: {
          type: String,
          required: false,
        },
        city: {
          type: String,
          required: false,
        },
        district: {
          type: String,
          required: false,
        },
        pinCode: {
          type: String,
          required: false,
        },
        contactPersonName: {
          type: String,
          required: false,
        },
        contactPersonNumber: {
          type: String,
          required: false,
        },
      },
    ],
    supplierContactPersonName: {
      type: String,
      required: true,
    },
    supplierContactPersonDesignation: {
      type: String,
      required: true,
    },
    supplierContactPersonNumber: {
      type: String,
      required: true,
    },
    supplierContactPersonAltNum: {
      type: String,
      required: false,
      default: '-',
    },
    supplierContactPersonEmail: {
      type: String,
      required: false,
      default: '-',
    },
    supplierTelNo: {
      type: String,
      required: false,
      default: '-',
    },
    supplierWebsite: {
      type: String,
      required: false,
      default: '-',
    },
    //    custAlsoSupplier: {
    //       type: String,
    //       required: false,
    //       default: "N"
    //    },
    supplierBefName: {
      type: String,
      required: false,
      default: '-',
    },
    supplierBankName: {
      type: String,
      required: false,
      default: '-',
    },
    supplierAccountNumber: {
      type: String,
      required: false,
      default: '-',
    },
    supplierAccType: {
      type: String,
      required: false,
      default: '-',
    },
    supplierBankIFSCCode: {
      type: String,
      required: false,
      default: '-',
    },
  },
  {
    timestamps: true,
  }
)

const Supplier = mongoose.model('Supplier', supplierSchema)

export default Supplier
