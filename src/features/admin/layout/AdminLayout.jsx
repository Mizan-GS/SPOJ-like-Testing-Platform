import {NavLink, Outlet, useNavigate} from "react-router-dom";

const navItemBase =
  "block rounded-lg px-7 py-4 text-md font-medium transition-colors";

const navItemInactive =
  "text-gray-700 hover:bg-purple-100 hover:text-purple-700";

const navItemActive =
  "bg-purple-500 text-white";

function AdminLayout(){

     const navigate=useNavigate();
     const handleLogout=()=>{
          localStorage.removeItem("token")
          localStorage.removeItem("role")
          localStorage.removeItem("user")

          navigate("/login",{replace:true})
     }

     return(
          <div className="flex min-h-screen">
               {/* //* Sidebar */}
               <aside className="w-64 border-r border-gray-200 bg-white flex flex-col">
                    <div>
                         <div className="px-6 py-4 border-b border-gray-200">
                              <h2 className="text-xl font-semibold text-purple-600">
                              Admin Panel
                              </h2>
                         </div>
                         <nav className="flex-1 px-4 py-6 space-y-2">
                              <NavLink 
                              to='/admin'
                              end
                              className={({isActive})=>
                              `${navItemBase} ${
                                   isActive ? navItemActive : navItemInactive
                              }`
                              }> 
                                   Dashboard
                              </NavLink>
                              <NavLink
                              to='/admin/questions'
                              className={({isActive})=>
                              `${navItemBase} ${isActive?navItemActive:navItemInactive}`}>
                                   Questions
                              </NavLink>
                              <NavLink
                              to='/admin/tests'
                              className={({isActive})=>
                              `${navItemBase} ${isActive?navItemActive:navItemInactive}`}>
                                   Tests
                              </NavLink>
                              <NavLink
                              to='/admin/assessments'
                              className={({isActive})=>
                              `${navItemBase} ${isActive?navItemActive:navItemInactive}`}>
                                   Assessments
                              </NavLink>
                              <NavLink
                              to="/admin/analytics"
                              className={({ isActive }) =>
                              `${navItemBase} ${
                                   isActive ? navItemActive : navItemInactive
                              }`
                              }
                              >
                              Analytics
                              </NavLink>
                         </nav>
                    </div>

                    {/* //* logout */}
                     <div className="px-4 py-4 border-t border-gray-200">
                         <button
                         onClick={handleLogout}
                         className="w-full rounded-lg bg-red-500 py-4 cursor-pointer text-md font-medium text-white hover:bg-red-600"
                         >
                         Logout
                         </button>
                    </div>
               </aside>

               {/* //* Main content */}
               <main className="flex-1 p-6 bg-gray-100">
                    <Outlet/>
               </main>
          </div>
     )
}

export default AdminLayout;