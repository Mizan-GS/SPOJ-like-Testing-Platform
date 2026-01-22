import React from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "../pages/auth/Signup";
import Login from "../pages/auth/Login";
import Home from "../components/common/Home";
import RequireAuth from "../components/common/RequireAuth";
import FotgotPassword from "../pages/auth/FotgotPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ResetPassword from "../pages/auth/ResetPassword";
import Profile from "../components/Profile/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <Home />
      </RequireAuth>
    ),
  },
  {
    path: "/profile",
    element: (
      <RequireAuth>
        <Profile />
      </RequireAuth>
    ),
  },
  {
    path: "/auth/verify-email/:token",
    element: <VerifyEmail path="login" title="Verifying email..." />,
  },
  {
    path: "/auth/verify-reset-password/:token",
    element: (
      <VerifyEmail path="forgot-password" title="Verifying reset password..." />
    ),
  },

  {
    path: "/forgot-password",
    element: <FotgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);
const Router = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
    </>
  );
};

export default Router;
