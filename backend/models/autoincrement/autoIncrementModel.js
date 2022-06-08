import mongoose from 'mongoose';

const AutoIncrementSchema = new mongoose.Schema(
   {
      module: { 
         type: String, 
         required: true, 
         index: { unique: true } 
      },
      moduleName: { 
         type: String, 
         required: false, 
      },
      autoIncrementValue: { 
         type: Number, 
         default: 1 
      }
});

AutoIncrementSchema.statics.getNextId = async function(moduleName, callback) {
   //console.log("I am inside getNext Id of module of AutoIncrementSchema and Module is.....  ", moduleName)
   let autoIncrement = await this.findOne({ module: moduleName });

   if (!autoIncrement) autoIncrement = await new this({ module: moduleName }).save();
   //incr.idx++;
   //incr.save();
   //console.log("The value of Auto Incremented module is ==== ", autoIncrement.autoIncrementValue)
   return autoIncrement.autoIncrementValue;
};

AutoIncrementSchema.statics.setNextId = async function(moduleName, callback) {
   //console.log(">>> Inside setNext Id of module of AutoIncrementSchema and Module is.....  ", moduleName)
   let autoIncrement = await this.findOne({ module: moduleName });

   if (!autoIncrement) autoIncrement = await new this({ module: moduleName }).save();
   autoIncrement.autoIncrementValue++;
   autoIncrement.save();
   //console.log(">>> setNext autoIncrement.autoIncrementValue == .....  ", autoIncrement)
   return autoIncrement.autoIncrementValue;
};

AutoIncrementSchema.statics.resetNextId = async function(value, moduleName, callback) {
   console.log(">>> Inside setNext Id of module of AutoIncrementSchema and Module is.....  ", moduleName)
   console.log(">>> Inside setNext Id of module of AutoIncrementSchema and Module is.....  ", value)
   let autoIncrement = await this.findOne({ module: moduleName });

   if (!autoIncrement) autoIncrement = await new this({ module: moduleName }).save();
   autoIncrement.autoIncrementValue = value;
   autoIncrement.save();
   console.log(">>> setNext autoIncrement.autoIncrementValue == .....  ", autoIncrement)
   return autoIncrement.autoIncrementValue;
};

const AutoIncrement = mongoose.model('AutoIncrement', AutoIncrementSchema)

export default AutoIncrement;