require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const { mergepdfs } = require('./merge');

const uploadPath = process.env.UPLOAD_PATH || 'pdf_tools/uploads/';
const app = express();

// Ensure the upload directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Middleware
app.use('/static', express.static('public'));
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});

// Handle PDF merge
app.post('/merge', async (req, res) => {
  try {
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

    // Merge the PDFs and get output file path
    const mergedPdfPath = await mergepdfs(filePaths);

    // Send the file to the user
    res.download(mergedPdfPath, 'merged.pdf', (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Error sending merged file.');
      }

      // Clean up temp files
      for (let filePath of filePaths) {
        fs.unlink(filePath, () => {});
      }

      fs.unlink(mergedPdfPath, () => {});
    });

  } catch (err) {
    console.error('Merge error:', err);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
