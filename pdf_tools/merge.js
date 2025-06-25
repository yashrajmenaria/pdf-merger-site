const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const path = require('path');

const mergepdfs = async (paths) => {
  const mergedPdf = await PDFDocument.create();

  for (const filePath of paths) {
    const fileBytes = fs.readFileSync(filePath);
    const pdf = await PDFDocument.load(fileBytes);

    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  // Add metadata (similar to what you had with pdf-merger-js)
  mergedPdf.setTitle('Merged pdf');
  mergedPdf.setAuthor('Yash Raj');
  mergedPdf.setCreator('Yash Raj');
  mergedPdf.setProducer('pdf-lib based script');

  const mergedPdfBytes = await mergedPdf.save();
  fs.writeFileSync(path.join(__dirname, '../public/merged.pdf'), mergedPdfBytes);
};

module.exports = { mergepdfs };
