import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'
import Layout from './Layout'
import About from './Components/About/About'
import Home from './Components/Home/Home'
import Contact from './Components/Contact/Contact'
import User from './Components/User/User'
import Github, {githubInfoLoader} from './Components/Github/Github'
import {RouterProvider, createBrowserRouter, createRoutesFromElements, Route} from 'react-router-dom'

//first way to create a router
//  const router = createBrowserRouter([
//   {
//      path: '/', 
//      element: <Layout/>,
//     children: [
//       {
//         path: "",
//         element: <Home/>
//       },
//       {
//         path: "about",
//         element: <About />,
//         children: [
//           {
//             path: "danish",
//             element: <Danish />
//           }
//         ]
//        },
//        {
//          path: "contact",
//          element: <Contact/>
//        },
//         {
//            path: ":userid",
//            element: <User />
//         },
//         {
//           loader: githubInfoLoader,
//           path: "github",
//           element: <Github />
//         }
//     ]
//    }
//  ])

// // //2nd way of creating router
 const router = createBrowserRouter(
 createRoutesFromElements(
<Route path='/' element={<Layout />}> //layout
  <Route path='' element={<Home />} /> //outlet1
  <Route path='about' element={<About />} /> //outlet2
  <Route path='contact' element={<Contact />} /> //outlet3
  <Route path=":userid" element={<User />} /> //outlet4
  <Route
   loader={githubInfoLoader}
   path="github" 
   element={<Github />}  //outlet5
   />
</Route>  
  )
 )

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={router} />
  </StrictMode>,
)
