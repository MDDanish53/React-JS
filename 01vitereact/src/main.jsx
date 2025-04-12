import React from "react"
import ReactDOM from "react-dom/client"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

function Merakaam() {
  return(
    <div>
      <h1>Danish Bhai aa gaye hai</h1>
    </div>
  )
}

// const ReactElement = {
//   type: 'a',
//   props: {
//       href: 'https://google.com',
//       target: "_blank"
//   },
//   children: 'Click me to visit google'
// }

const AnotherElement = (
  <a href="https://google.com" target="_blank">Visit Google</a>
)

const dusraNaam = " Mohammad Danish"


//babel transpiler injects React.createElement()
const reactElement = React.createElement(
  'a', //tag name 
  {href: "https://google.com", target: "_blank"} , //compulsory
  'click me to visit google' , //text to be injected(children)
  dusraNaam //evaluated expression(injecting variable)
)

ReactDOM.createRoot(document.getElementById('root')).render(
  reactElement
)
