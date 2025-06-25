require('dotenv').config();
const express = require('express')
const path = require('path')
const multer = require('multer')
const {mergepdfs} = require("./merge")
const uploadPath = process.env.UPLOAD_PATH || 'pdf_tools/uploads/';
const app = express()
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({storage: storage})
app.use('/static', express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"templates/index.html"))
})
app.post('/merge', upload.array('pdfs'), async (req, res, next) => {
  console.log(req.files);
  const filePaths = req.files.map(file => path.join(__dirname, file.path));
  await mergepdfs(filePaths);
  res.redirect("/static/merged.pdf");
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
})
