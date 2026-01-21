import React from 'react'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Signup from '../pages/auth/Signup'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Signup />
    }
])
const Router = () => {
 return (
    <>
      <RouterProvider router={router} />
      {/* <ToastContainer position="top-right" autoClose={2000} theme="colored" /> */}
    </>
  );
}

export default Router