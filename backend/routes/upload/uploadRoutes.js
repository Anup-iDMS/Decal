import path from 'path'
import express from 'express'
import multer from 'multer'
import fs from 'fs'
import csv from 'fast-csv';
import mongoose from 'mongoose';

const router = express.Router()

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename(req, file, cb) {
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//     )
//   },
// })

// function checkFileType(file, cb) {
//   const filetypes = /PDF/ ///jpg|jpeg|png/
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
//   const mimetype = filetypes.test(file.mimetype)

//   if (extname && mimetype) {
//     return cb(null, true)
//   } else {
//     cb('Images only!')
//   }
// }

// const upload = multer({
//   storage,
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb)
//   },
// })

// //router.post('/', (req, res) => {
// router.post('/', upload.single('image'), (req, res) => {
//   //console..log("1. ye kanha aa gaye hum..............")
//   res.send(`/${req.file.path}`)
// })


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //console..log("--------- diskStorage and file is ", file)
    cb(null, 'uploads/sales/po/')
  },
  filename: function (req, file, cb) {
    //console..log("--- recahed heer and fine mae ", file.originalname)
    //cb(null, Date.now() + '-' +file.originalname )
    cb(null, file.originalname )
  }
})

var upload = multer({ storage: storage }).single('file')

router.post('/po', (req, res) => {
  //console..log("------ Found The URL Upload PO file ----------- ")
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
       //console..log("-------- 1 2 1 2 annd error is ", err)
       return res.status(500).json(err)
    } else if (err) {
     //console..log("-------- tala re fatla annd error is ", err)
       return res.status(500).json(err)
    }
    return res.status(200).send(req.file)
  })
})

router.get('/pofile', (req, res) => {
  //console..log("------ Route to get PDF file ----------- ")
  let filename = req.query.fileName
  //console..log("------ Route to get PDF file NAME OF FILE IS ----------- ", filename)
  const __dirname = path.resolve()
  //DEBIT NOTE 2.pdf
  //var filename = "1637662479874-DTPL - VEGA AUTO BELGAUM DESIGN DEV INVOICE 09.pdf"
  var filePath = `${__dirname}`+'/uploads/sales/po/'+`${filename}`;
  //res.json(filePath)
  fs.readFile(filePath , function (err,data){
    if(err) {
      //console..log("Error in reading file ------> ", err);
    }
    ////console..log("Data Found is ", data);
    // res.contentType("application/pdf");
    // res.send(data);
    res.sendFile(filePath);

  });
})

router.get('/jcmastertemplate', (req, res) => {
  //console..log("------ Route to get PDF file ----------- ")
  //let filename = req.query.fileName
  //console..log("------ Route to get PDF file NAME OF FILE IS ----------- ", filename)
  const __dirname = path.resolve()
  //DEBIT NOTE 2.pdf
  let filename = "authors.csv"
  var filePath = `${__dirname}`+'/uploads/jcmasters/template/'+`${filename}`;
  //res.json(filePath)
  fs.readFile(filePath , function (err,data){
    if(err) {
      console.log("Error in reading file ------> ", err);
    }
    ////console.log("Data Found is ", data);
    // res.contentType("application/pdf");
    // res.send(data);
    res.sendFile(filePath);

  });
})

router.post('/jcmastertemplate', (req, res) => {
  console.log("------Inside Upload File Not sure will come here ----------- ")
  //let filename = req.query.fileName
  if (!req.files)
		return res.status(400).send('No files were uploaded.');
	
	var authorFile = req.files.file;
	console.log("File are ", authorFile)
	var authors = [];

  csv
	 .fromString(authorFile.data.toString(), {
		 headers: true,
		 ignoreEmpty: true
	 })
	 .on("data", function(data){
		 data['_id'] = new mongoose.Types.ObjectId();
		 
		 authors.push(data);
	 })
	 .on("end", function(){
		//  Author.create(authors, function(err, documents) {
		// 	if (err) throw err;
			
		// 	res.send(authors.length + ' authors have been successfully uploaded.');
		//  });
    res.json(authors);
  });
})

export default router
