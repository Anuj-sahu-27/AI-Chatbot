import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import MarkdownRenderer from '../../Testing';
import { HiPaperClip } from "react-icons/hi";
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import '../pdfWorker'; // Import the custom worker


import '../App.css'; // Assuming you add CSS here


const GeminiApi = () => {
  const [requestQuery, setRequestQuery] = useState('');
  const[ChatHistory,SetChatHistory]=useState([]);
  const [isLoading,setIsLoading]=useState(true)
  const [result, setResult] = useState();
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const targetdiv=useRef(null);

  // this is for text extractor i know this is not a good practice but chalta hai


  const [pdfText, setPdfText] = useState('');
  const [isLoad, setIsLoad] = useState(false);
  let inpref=useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setIsLoad(true);
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
        setIsLoad(false);
      };

      fileReader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };
console.log("pdf text is ",pdfText)

const HandlePdfSelect= ()=>{
  inpref.current.click();
}

  // ******************************************************************************************************
  
  const ApiCall = async () => {
    try {
        setIsLoading(true)

           // Concatenate previous chat history without including pdfText
           const fullQuery = ChatHistory.map(chat => chat.request).join('\n') + '\n' + requestQuery;
           
      const Responce = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        { "contents": [{ "parts": [{ "text": fullQuery }] }] }
      );
      
      
      // ...........................this is testing streaming data..........................

     
      // ..........................................................................................
      console.log(Responce.data.candidates[0].content.parts[0].text);
      setResult(Responce.data.candidates[0].content.parts[0].text);
      SetChatHistory((prev) => [
        ...prev,
        { request: requestQuery, response: Responce.data.candidates[0].content.parts[0].text }
      ]);
      setIsLoading(false)
      setRequestQuery('');
      setPdfText('');
    } catch (err) {
      console.log("some error while fetching Api Data ", err);
    }
  };

  //this is for query and concat
  const QueryHandler=(e)=>{
    const inputQuery = e.target.value; // Text typed by the user

  // If `pdfText` exists, concatenate it with the input query
  if (pdfText) {
    setRequestQuery(inputQuery + ' ' + pdfText);
  } else {
    setRequestQuery(inputQuery);
    
  }
  }

  const SubmitHandler = async (e) => {
    e.preventDefault();
    ApiCall();
   
   
  };

 
  useEffect(() => {
    
    if (ChatHistory.length > 0) {
      targetdiv.current.scrollIntoView({ behavior: "smooth" });
    }
   
  }, [ChatHistory]);
console.log("chat history is ",ChatHistory)
  const Skeleton=()=>{

    return(

        <div>

<div className="max-w-4xl mx-auto px-4 py-8">
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </div>

    <div className="animate-pulse space-y-4 mt-12">
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded"></div>
    </div>
  </div>
        </div>
    )
  }

  return (

    <div className="h-screen w-full flex flex-col">
    <div className="bg-white flex-1 overflow-y-scroll">
      <div className="px-4 py-2">
        <div className="flex items-center mb-2">
          <img className="w-8 h-8 rounded-full mr-2" src="https://picsum.photos/50/50" alt="User Avatar" />
          <div className="font-medium">Anuj's AI</div>
        </div>
        {
          isLoading ? <Skeleton/> : 
          <div>


       {
          ChatHistory.map((chats)=>(
<div>
<div className="flex items-center justify-end my-6">
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
           {chats.request}
          </div>
          <img className="w-8 h-8 rounded-full" src="https://picsum.photos/50/50" alt="User Avatar" />
        </div>
            <div className=" rounded-lg p-2  mb-2 ">
            <div className="markdown-body" style={{ textAlign: 'justify' ,paddingLeft: '10px',marginRight:'10px' }}>
               <MarkdownRenderer markdownText={`${chats.response}`} />
              </div>
           
        </div>
       
        <div  ref={targetdiv}></div>
        </div>
        
          ))
        }
        
       </div>
      
        }
       
       
      </div>
    </div>
    
    <div className="bg-gray-100 px-4 py-2">
      

    <form onSubmit={SubmitHandler} className='flex gap-0 w-full'>
             <button type='button'  onClick={HandlePdfSelect} className='p-4 border-y bg-white border-gray-300  rounded-none  transition-all duration-300'><HiPaperClip/></button>
             <input type="file" ref={inpref} accept="application/pdf" onChange={handleFileUpload} style={{display:'none'}}/>
             <input 
              type="text" 
              value={requestQuery} 
              // (e) => setRequestQuery(e.target.value)
              // this is for testing purpose do not try this at home
              onChange={QueryHandler} 
              placeholder='Start Your Chat' 
              className='w-full border rounded-full py-2 px-4 mr-2'
            />
            <button 
              type='submit' 
              className='bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full'>
              Send
            </button>
          </form>
        </div>
</div>




     
   
   
  );
};

export default GeminiApi;
