const express = require('express')
const path = require('path')
const multer = require('multer')
const {mergepdfs} = require("./merge")
const app = express()
const upload = multer({dest: 'uploads/' })
app.use('/static', express.static('public'))
const port = 3000

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"templates/index.html"))
})
app.post('/merge', upload.array('pdfs'), async (req, res, next) => {
  console.log(req.files);
  const filePaths = req.files.map(file => path.join(__dirname, file.path));
  await mergepdfs(filePaths);
  res.redirect("/static/merged.pdf");
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
