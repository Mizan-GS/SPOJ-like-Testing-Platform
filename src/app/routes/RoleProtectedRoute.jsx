import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext";



function RoleProtectedRoute({allowedRoles,children}) {

     // const token = localStorage.getItem("token")
     // const role = localStorage.getItem('role')

     const {isAuthenticated,role,isInitializing}= useAuth()

     if (isInitializing) {
     return null;
     }

     //!not logged in
     if (!isAuthenticated) {
          return <Navigate to='/' replace/>
     } 

     //!logged in but role not allowed
     if (!allowedRoles.includes(role)) {
          return <Navigate to = '/unauthorized' replace/>
     }

     //!authorized
     return children;

}

export default RoleProtectedRoute
