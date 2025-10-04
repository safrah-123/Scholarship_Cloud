import React from 'react'
import {createBrowserRouter,RouterProvider} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import router from './Routes/Router';
function App() {
  let routes=createBrowserRouter(router);
  return (
    <>
    <RouterProvider router={routes}/>
    <Toaster/>
    </>
  )
}

export default App