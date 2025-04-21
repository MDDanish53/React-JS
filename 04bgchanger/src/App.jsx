import { useState } from "react"

function App() {
  const [color, setColor] = useState("white");

  return (
   <div className="w-full h-screen duration-200" style={{backgroundColor: color}}>
    <div className="fixed flex flex-wrap justify-center bottom-12 inset-x-0 px-2">
      <div className="flex flex-wrap justify-center gap-3 shadow-lg bg-white px-3 py-2 rounded-2xl">
        <button className="outline-none px-4 py-1 rounded-full text-white shadow-lg" style={{backgroundColor: "red"}} onClick={() => setColor("red")}>Red</button>
        <button className="outline-none px-4 py-1 rounded-full text-white shadow-lg" style={{backgroundColor: "green"}} onClick={() => setColor("green")}>Green</button>
        <button className="outline-none px-4 py-1 rounded-full text-white shadow-lg" style={{backgroundColor: "blue"}} onClick={() => setColor("blue")}>Blue</button>
        <button className="outline-none px-4 py-1 rounded-full text-white shadow-lg" style={{backgroundColor: "olive"}} onClick={() => setColor("olive")}>Olive</button>
        <button className="outline-none px-4 py-1 rounded-full text-white shadow-lg" style={{backgroundColor: "gray"}} onClick={() => setColor("gray")}>Gray</button>
        <button className="outline-none px-4 py-1 rounded-full text-white shadow-lg" style={{backgroundColor: "yellow", color: "black"}} onClick={() => setColor("yellow")}>Yellow</button>
        <button className="outline-none px-4 py-1 rounded-full text-white shadow-lg" style={{backgroundColor: "pink", color: "black"}} onClick={() => setColor("pink")}>Pink</button>
        <button className="outline-none px-4 py-1 rounded-full text-white shadow-lg" style={{backgroundColor: "purple"}} onClick={() => setColor("purple")}>Purple</button>
        <button className="outline-none px-4 py-1 rounded-full text-white shadow-lg" style={{backgroundColor: "Lavender", color: "black"}} onClick={() => setColor("Lavender")}>Lavender</button>
        <button className="outline-none px-4 py-1 rounded-full text-white shadow-lg" style={{backgroundColor: "white", color: "black"}} onClick={() => setColor("white")}>White</button>
        <button className="outline-none px-4 py-1 rounded-full text-white shadow-lg" style={{backgroundColor: "black", color: "white"}} onClick={() => setColor("black")}>Black</button>
      </div>
    </div>
   </div>
  )
}

export default App;
