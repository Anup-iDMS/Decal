import mongoose from 'mongoose'

const connectDB = async () => {
  let connectionString = "";
  try {
    if (process.env.NODE_ENV === 'dev') {
      connectionString = process.env.MONGO_URI_LOCAL;
    } else if (process.env.NODE_ENV === 'qa') {
      connectionString = process.env.MONGO_URI_QA;
    } else if (process.env.NODE_ENV === 'production') {
      connectionString = process.env.MONGO_URI_PROD;
    }
    console.log("Connected to ", connectionString)
    const conn = await mongoose.connect(connectionString, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold)
    process.exit(1)
  }
}

export default connectDB
