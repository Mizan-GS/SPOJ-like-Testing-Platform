import React,{useState, useEffect} from 'react'
import api from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
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
   <nav className="bg-purple-500 text-white h-20 px-6 py-4 flex justify-around items-center shadow">
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Coding Plateform
      </div>

      <ul className="flex gap-6 items-center">
        <li className="hover:text-purple-200 cursor-pointer">Dashboard</li>
        <li className="hover:text-purple-200 cursor-pointer">My Results</li>

        <li
          className="relative"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <span className="hover:text-purple-200 cursor-pointer">
            Profile
          </span>

        
          {open && (
            <div className="absolute right-0 top-full mt-3 w-60 bg-white text-gray-800 rounded-xl shadow-lg border z-50">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold text-purple-700">
                  Puja Shaw
                </p>
                <p className="text-sm text-gray-500">
                  puja@email.com
                </p>
              </div>

              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-4 py-2 hover:bg-purple-50"
              >
                👤 View Profile
              </button>

              <button
                onClick={() => navigate("/profile/edit")}
                className="w-full text-left px-4 py-2 hover:bg-purple-50"
              >
                ✏️ Edit Profile
              </button>

              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar