const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

const mergepdfs = async (paths) => {
  const mergedPdf = await PDFDocument.create();

  for (const filePath of paths) {
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }

    const fileBytes = fs.readFileSync(absolutePath);
    const pdf = await PDFDocument.load(fileBytes);

    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  // Optional metadata
  mergedPdf.setTitle('Merged PDF');
  mergedPdf.setAuthor('Yash Raj');
  mergedPdf.setCreator('Yash Raj');
  mergedPdf.setProducer('pdf-lib based script');

  const mergedPdfBytes = await mergedPdf.save();

  // ✅ Save to a temp path (safe on Render)
  const outputPath = path.join('/tmp', `merged_${Date.now()}.pdf`);
  fs.writeFileSync(outputPath, mergedPdfBytes);

  return outputPath; // return path so caller can send/download
};

module.exports = { mergepdfs };
