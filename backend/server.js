if (process.env.NODE_ENV === 'qa' || process.env.NODE_ENV === 'production') {
  console.log = function () {}
}

import express from 'express'
import path from 'path'
import colors from 'colors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import createCron from './config/nodecron.js'
import createEmailCron from './config/nodecronforemail.js'
import testCron from './config/testcron.js'
import fileUpload from 'express-fileupload'

import userRoutes from './routes/master/userRoutes.js'
import companyRoutes from './routes/master/companyRoutes.js'
import adminRoutes from './routes/master/adminRoutes.js'
import customerRoutes from './routes/master/customerRoutes.js'
import autoIncrementRoutes from './routes/master/autoIncrementRoutes.js'
import appParameterRoutes from './routes/master/appParameterRoutes.js'
import appDataRoutes from './routes/master/appDataRoutes.js'
import hsnRoutes from './routes/master/hsnRoutes.js'
import sacRoutes from './routes/master/sacRoutes.js'
import serviceCodeRoutes from './routes/master/serviceCodeRoutes.js'
import jcMasterRoutes from './routes/master/jcMasterRoutes.js'
import serviceMasterRoutes from './routes/master/serviceMasterRoutes.js'
import issueRoutes from './routes/master/issueRoutes.js'
import salesOrderRoutes from './routes/sales/salesOrderRoutes.js'
import salesInvoiceRoutes from './routes/sales/salesInvoiceRoutes.js'
import deliveryNoteRoutes from './routes/sales/deliveryNoteRoutes.js'
import dispatchDetailsRoutes from './routes/sales/dispatchDetailsRoutes.js'
import creditNoteRoutes from './routes/sales/creditNoteRoutes.js'
import jobCardRoutes from './routes/production/jobCardRoutes.js'
import fgmiRoutes from './routes/production/fgmiRoutes.js'
import drnRoutes from './routes/drn/drnRoutes.js'
import dashboardRoutes from './routes/dashboard/dashboardRoutes.js'
import inspectionParameterRoutes from './routes/qa/inspectionParameterRoutes.js'
import inspectionMethodRoutes from './routes/qa/inspectionMethodRoutes.js'
import ppmReportRoutes from './routes/qa/ppmReportRoutes.js'
import pdirTemplateRoutes from './routes/qa/pdirTemplateRoutes.js'
import pdirRoutes from './routes/qa/pdirRoutes.js'
import messageRoutes from './routes/message/messageRoutes.js'
import uploadRoutes from './routes/upload/uploadRoutes.js'
import supplierRoutes from './routes/master/supplierRoutes.js'

dotenv.config()

connectDB()
/** Create a Cron Job Instance */
createCron()
createEmailCron()
//testCron();

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use(cors())

app.use(fileUpload())

//masters routes
app.use('/api/users', userRoutes)
app.use('/api/company', companyRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/autoincrement', autoIncrementRoutes)
app.use('/api/appdata', appDataRoutes)
app.use('/api/appparameters', appParameterRoutes)
app.use('/api/jcmasters', jcMasterRoutes)
app.use('/api/issues', issueRoutes)
app.use('/api/suppliers', supplierRoutes)
//HSN Master routes
app.use('/api/hsnsac', hsnRoutes)
//SAC Master routes
app.use('/api/sac', sacRoutes)
//Service Master routes
app.use('/api/servicemaster', serviceMasterRoutes)
//Service Code routes
app.use('/api/servicecode', serviceCodeRoutes)

//sales routes
app.use('/api/salesorders', salesOrderRoutes)
//sales invoice
app.use('/api/salesinvoice', salesInvoiceRoutes)
//credit note
app.use('/api/creditnote', creditNoteRoutes)
//dispatch details routes
app.use('/api/dispatchdetails', dispatchDetailsRoutes)
//delivery note routes
app.use('/api/deliverynote', deliveryNoteRoutes)

//job card routes
app.use('/api/jobcards', jobCardRoutes)
//FGMI routes
app.use('/api/fgmi', fgmiRoutes)
//DRN routes
app.use('/api/drn', drnRoutes)
//QA Routes
app.use('/api/qa/inspectionparams', inspectionParameterRoutes)
app.use('/api/qa/inspectionmethods', inspectionMethodRoutes)
app.use('/api/ppmreport', ppmReportRoutes)
app.use('/api/qa/pdirtemplates', pdirTemplateRoutes)
app.use('/api/qa/pdir', pdirRoutes)
//Message Routes
app.use('/api/messages', messageRoutes)
//Dashboard
app.use('/api/dashboard', dashboardRoutes)
//Upload File
app.use('/api/upload', uploadRoutes)

const __dirname = path.resolve()

// app.use(express.static(__dirname + '/uploads'));
// app.use('/uploads',express.static(__dirname + '/uploads'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
