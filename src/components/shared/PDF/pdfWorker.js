import { pdfjs } from 'react-pdf';

// pdfjs-dist 5.x ships the worker only as an ES module (pdf.worker.min.mjs).
// Vite resolves this URL against the bundled package and emits the worker as a
// local hashed asset, so no CDN/version drift is involved.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();
