import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Signup from "../pages/auth/Signup";
import Login from "../pages/auth/Login";
import FotgotPassword from "../pages/auth/FotgotPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ResetPassword from "../pages/auth/ResetPassword";

import Home from "../components/common/Home";
import RequireAuth from "../components/common/RequireAuth";
import Profile from "../components/Profile/Profile";
import UserTestList from "../pages/users/UserTestList";
import NotFound from "../pages/NotFound";
import TestEditor from "../pages/users/TestEditor";
import CategoryQuestionList from "../components/common/CategoryQuestionList";
import McqTestEditor from "../components/common/McqTestEditor";

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
    children: [
      {
        path: "user/tests/:id",
        element: <UserTestList />,
      },
      {
        path: "user/test/start/:attemptId",
        element: <TestEditor />,
      },
      {
        path: "questions/:category",
        element: <CategoryQuestionList />,
      },
      {
        path: "mcq/:category",
        element: <McqTestEditor />,
      },
    ],
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

  {
    path: "*",
    element: <NotFound />,
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
