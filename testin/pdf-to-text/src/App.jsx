import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import pdfToText from "react-pdftotext";

function extractText(event) {
  const file = event.target.files[0];
  pdfToText(file)
    .then((text) => console.log(text))
    .catch((error) => console.error("Failed to extract text from pdf, error: ", error));
}

function App() {
  
  return (
    <>
      <input type="file" accept="application/pdf" onChange={extractText}/>
    </>
  )
}

export default App
