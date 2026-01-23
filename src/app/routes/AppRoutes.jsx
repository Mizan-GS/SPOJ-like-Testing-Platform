import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "../../features/admin/layout/AdminLayout";
import AdminDashboard from "../../features/admin/dashboard/AdminDashboard";
import QuestionsList from "../../features/admin/questions/QuestionsList";
import TestList from "../../features/admin/tests/TestList";
import Analytics from "../../features/admin/Assessments/Assessments";
import RoleProtectedRoute from "./RoleProtectedRoute";
import Unauthorized from "../../pages/Unauthorized";
import NotFound from "../../pages/NotFound";
import Login from "../../pages/Login";
import ForgotPassword from "../../pages/ForgotPassword";
import { AuthProvider } from "../../context/AuthContext";
import Assessments from "../../features/admin/Assessments/Assessments";



const router = createBrowserRouter([
{
     element: <AuthProvider/>,
     children: [
               {
                    path:"/",
                    element:<Login/>
               },
               {
                    path:"/forgot-password",
                    element:<ForgotPassword/>
               },
               {
                    path:'/admin',
                    element:(
                         <RoleProtectedRoute allowedRoles={['admin']}>
                              <AdminLayout/>
                         </RoleProtectedRoute>
                    ),
                    children:[
                         {
                              index:true,
                              element:<AdminDashboard/>
                         },
                         {
                              path:"questions",
                              element:<QuestionsList/>
                         },
                         {
                              path:"tests",
                              element:<TestList/>
                         },
                         {
                              path:"assessments",
                              element:<Assessments/>
                         },
                    ],
               },
               {
                    path:"/unauthorized",
                    element:<Unauthorized/>
               },
               {
                    path:"*",
                    element:<NotFound/>
               },
          ],
     },
]);

function AppRoutes(){
     return <RouterProvider router={router}/>
}

export default AppRoutes;