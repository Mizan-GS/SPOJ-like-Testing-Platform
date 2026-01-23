import { createContext, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { isTokenExpired } from "../utils/jwt";
import { setLogoutHandler } from "../services/authEvents";
const AuthContext = createContext(null);

export const AuthProvider = ({children})=>{
     const navigate = useNavigate();

     const [token, setToken] = useState(null);
     const [role,setRole] = useState(null);
     const [isAuthenticated, setIsAuthenticated] = useState(false);
     const [isInitializing, setIsInitializing] = useState(true);


         //* clearAuth()

     const clearAuth=()=>{
          localStorage.removeItem("token")
          localStorage.removeItem("role")

          setToken(null);
          setRole(null)
          setIsAuthenticated(false)
     };

 


     
     useEffect(()=>{
          const storedToken = localStorage.getItem("token");
          const storedRole = localStorage.getItem("role");

          if (!storedToken || isTokenExpired(storedToken)) {
               clearAuth();
               setIsInitializing(false);
               return;
          }

          setToken(storedToken);
          setRole(storedRole);
          setIsAuthenticated(true)
          setIsInitializing(false)
     },[]);

     //* Login handler from loginpage

     const login = ({token,role})=>{
          const normalizedRole = role.toLowerCase();

          localStorage.setItem("token",token);
          localStorage.setItem("role",normalizedRole)
          setToken(token);
          setRole(normalizedRole);
          setIsAuthenticated(true);

          if (normalizedRole === 'admin') {
               navigate("/admin",{replace:true});
          } else {
               navigate("/dashboard", {replace:true})
          }
     };

     //* Logout handler

     const logout=()=>{
          clearAuth();
          navigate("/",{replace:true})
     }


         useEffect(() => {
     setLogoutHandler(() => {
     logout();
     });
     }, []);
 

     return(
          <AuthContext.Provider
           value={{
               token,
               role,
               isAuthenticated,
               isInitializing,
               login,
               logout,
               }}>
               <Outlet/>
          </AuthContext.Provider>
     )

     //* custom hook

     


}

export const useAuth=()=>{
          const ctx = useContext(AuthContext)
          if (!ctx) {
               throw new Error("useAuth must be used inside AuthProvider")
          }

          return ctx;
     }