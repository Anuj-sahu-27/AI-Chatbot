import { useState } from 'react'
import './App.css'
import GeminiApi from './API CALLING/GeminiApi'
import MarkdownRenderer from '../Testing';

import PdfTextExtractor from './PDFCHECK/PdfExtract';

function App() {
  const [count, setCount] = useState(0)

  

  return (
    <>
    {/* welcome to Anuj's AI  */}
    <div className='h-screen w-screen flex flex-col justify-center items-center text-center'>
    <GeminiApi/>
    </div>
    {/* <PdfTextExtractor/> */}
    
    </>
  )
}

export default App
