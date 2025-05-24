import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  let [counter, setCounter] = useState(1);

  //let counter = 100;

  let addValue = () => {
    if(counter+4 >= 20) {
      setCounter(counter);
    } else {
      //useState sends all updates in UI in batches using fibre algorithm
      setCounter(prevCounter => prevCounter + 1); //prevCounter has the previous counter value
      setCounter(prevCounter => prevCounter + 1);
      setCounter(prevCounter => prevCounter + 1);
      setCounter(prevCounter => prevCounter + 1);
    }
  }

  let subtractValue = () => {
    if(counter == 0) {
      setCounter(counter);
    } else {
    setCounter(counter - 1);
    }
  }

  return (
    //babel injects this jsx code 
    <>
      <h1>Mohammad Danish</h1>
      <h2>Counter value : {counter}</h2>
      <button onClick={addValue}>Add Value {counter}</button>
      <br />
      <button onClick={subtractValue}>Remove value {counter}</button>
      <p>footer: {counter}</p>
    </>
  )
}

export default App
