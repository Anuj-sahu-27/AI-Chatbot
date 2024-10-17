import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import '../pdfWorker'; // Import the custom worker

const PdfTextExtractor = () => {
  const [pdfText, setPdfText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setIsLoading(true);
      const fileReader = new FileReader();
      
      fileReader.onload = async function () {
        const typedarray = new Uint8Array(this.result);
        const loadingTask = pdfjsLib.getDocument({ data: typedarray });
        const pdf = await loadingTask.promise;

        let extractedText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          extractedText += pageText + '\n';
        }

        setPdfText(extractedText);
        setIsLoading(false);
      };

      fileReader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  return (
    <div className="pdf-text-extractor">
      <h2>PDF Text Extractor</h2>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      
      {isLoading ? (
        <p>Extracting text from PDF...</p>
      ) : (
        <div className="extracted-text">
          {pdfText && (
            <div>
              <h3>Extracted Text:</h3>
              <div>{pdfText}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PdfTextExtractor;
