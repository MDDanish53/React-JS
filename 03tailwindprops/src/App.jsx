import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from './Components/Card.jsx'

function App() {
  const [count, setCount] = useState(0)

  let myObj = {
    name: "MohammadDanish",
    age: 21,
  }

  let myArr = [1, 2, 3, 4, 5];

  return (
    <> 
    <h1 className="bg-green-400 text-black p-4 rounded-xl mb-4">Mohammad Danish</h1>
    <Card userName="Danish" btnText="click me" content="He is a software developer and he is looking for internships to exactly figure out hw things works in industries and how could he contribute."/>
    <Card userName="Mahevish" content="She is doing MBA from a college and her aim to crack a MNC and serve accordingly."/>
    </>
  )
}

export default App
