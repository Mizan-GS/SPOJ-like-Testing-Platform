import React,{useState, useEffect} from 'react'
import api from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const stored = localStorage.getItem("currentUser");
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch (_) {}
        }

        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const res = await api.get("/users/me");
        console.log("Fetched profile:", res.data);

        if (res?.data?.success) {
          setUser(res.data.data);
          localStorage.setItem("currentUser", JSON.stringify(res.data.data));
        }
      } catch (err) {
        console.warn("Failed to fetch profile:", err);
        const status = err.response?.status;
     
        if (status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          setUser(null);
          return;
        }

        if (status === 404) {
          console.warn('/users/me not found on backend; using stored user if available');
          return;
        }

        toast.error(err.response?.data?.message || "Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="w-full bg-white border-b py-3 px-6 flex items-center justify-between">
        <div className="text-xl font-semibold">Coding Platform</div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/profile')}
                title="View profile"
                className="w-10 h-10 rounded-full cursor-pointer overflow-hidden border-2 border-purple-300 p-0"
              >
                <img
                  src={user.profile?.avatar?.url || "https://www.gravatar.com/avatar?d=mp&s=40"}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </button>

              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-600 text-white cursor-pointer rounded-full text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/login')} className="px-3 py-2 text-sm">Login</button>
              <button onClick={() => navigate('/')} className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm">Signup</button>
            </div>
          )}
        </div>
      </nav>

      
    </div>
  );
}

export default Navbar