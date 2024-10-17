import * as pdfjsLib from 'pdfjs-dist/build/pdf';

// Ensure the worker version matches the API version (2.10.377 in this example)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;
