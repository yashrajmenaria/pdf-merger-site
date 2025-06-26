require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const { mergepdfs } = require("./merge");

const uploadPath = process.env.UPLOAD_PATH || 'pdf_tools/uploads/';
const app = express();

// Middleware
app.use('/static', express.static('public'));
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "templates/index.html"));
});

// Handle PDF merge
app.post('/merge', async (req, res) => {
  if (!req.files || !req.files.pdfs) {
    return res.status(400).send('No files were uploaded.');
  }

  const uploadedFiles = Array.isArray(req.files.pdfs) ? req.files.pdfs : [req.files.pdfs];

  const filePaths = [];
  for (let file of uploadedFiles) {
    const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 1e6)}-${file.name}`;
    const savePath = path.join(uploadPath, uniqueName);
    await file.mv(savePath);
    filePaths.push(savePath);
  }

  await mergepdfs(filePaths);

  res.redirect('/static/merged.pdf');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
