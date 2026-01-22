import { Navigate } from "react-router-dom"



function RoleProtectedRoute({allowedRoles,children}) {

     const token = localStorage.getItem("token")
     const role = localStorage.getItem('role')

     //!not logged in
     if (!token) {
          return <Navigate to='/login' replace/>
     } 

     //!logged in but role not allowed
     if (!allowedRoles.includes(role)) {
          return <Navigate to = '/unauthorized' replace/>
     }

     //!authorized
     return children;

}

export default RoleProtectedRoute
