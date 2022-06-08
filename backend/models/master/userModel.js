import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import mongooseSeq from 'mongoose-sequence';
//import ModelIncrement from './modelIncrement.js';
//import Role from './roleModel.js';

var AutoIncrement = mongooseSeq(mongoose);

const userSchema = mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Company',
        },
        name: {
            type: String,
            required: true,
        },
        userCode: {
            type: String,
            required: false,
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Role',
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            required: false,
            default: true
        },
        userId: {
            type: Number
        }

    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre('save', async function (next) {
    // if (this.isNew) {
    //     const id = await ModelIncrement.getNextId('User');
    //     this.userId = id; // Incremented
    //     next();
    // } else {
    //     next();
    // }

    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.plugin(AutoIncrement, { id: 'order_seq', inc_field: 'userId' });

const User = mongoose.model('User', userSchema)

export default User;