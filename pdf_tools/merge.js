const PDFMerger = require('pdf-merger-js').default;
const mergepdfs = async (paths) => {
  const merger = new PDFMerger();
  for (const p of paths) {
    await merger.add(p);
  }
  await merger.setMetadata({
    producer: "pdf-merger-js based script",
    author: "yash raj",
    creator: "yash raj",
    title: "Merged pdf"
  });
  await merger.save('public/merged.pdf');
};
module.exports = { mergepdfs };