import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  HelpCircle,
  ClipboardCheck,
  Layers,
  Users,
  FileQuestion,
  FileText,
  Layers3,
  LogOut
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAdminOverviewAnalytics, getAllQuestions, getTestAnalytics, getUserAnalytics } from "../../../services/admin.api";
function SidebarLink({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-6 py-5 text-md font-medium transition
        ${
          isActive
            ? "bg-purple-500 text-white"
            : "text-gray-600 hover:bg-purple-100 hover:text-purple-700"
        }`
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );
}

function StatRow({ icon: Icon, label, value }) {
  return (
    <div className="mb-3 flex items-center justify-between text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-gray-400" />
        <span>{label}</span>
      </div>
      <span className="font-medium text-purple-600">
        {value ?? "—"}
      </span>
    </div>
  );
}


const navItemBase =
  "block rounded-lg px-7 py-4 text-md font-medium transition-colors";

const navItemInactive =
  "text-gray-700 hover:bg-purple-100 hover:text-purple-700";

const navItemActive =
  "bg-purple-500 text-white";

function AdminLayout() {
  const navigate = useNavigate();



  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };
  const [overview,setOverview]=useState([])
  // const [questions,setQuestions]=useState([])
  const [loading,setLoading]= useState();
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewRes] = await Promise.all([
          getAdminOverviewAnalytics()
        ]);

        console.log(overviewRes.data.data);
        // console.log(userRes.data.data);
        // console.log(testRes.data.data);


        setOverview(overviewRes.data.data);
        // setTestAnalytics(testRes.data.data || []);
        // setUserAnalytics(userRes.data.data || []);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to load dashboard analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white flex flex-col sticky top-0 h-screen">
        <div className="flex flex-col flex-1">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-purple-600">
              Admin Panel
            </h2>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            <SidebarLink
              to="/admin"
              icon={LayoutDashboard}
              label="Dashboard"
            />

            <SidebarLink
              to="/admin/questions"
              icon={HelpCircle}
              label="Questions"
            />

            <SidebarLink
              to="/admin/tests"
              icon={ClipboardCheck}
              label="Tests"
            />

            <SidebarLink
              to="/admin/assessments"
              icon={Layers}
              label="Assessments"
            />
          </nav>

          <div className="mt-8 px-4">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Quick Stats
            </h4>

            <div className="space-y-5 mb-3">
              <StatRow icon={Users} label="Users" value={overview.totalUsers} />
              <StatRow icon={FileQuestion} label="Questions" value={overview?.totalTests} />
              <StatRow icon={FileText} label="Tests" value={overview?.totalTests} />
              <StatRow icon={Layers3} label="Assessments" value={overview?.totalAssessments} />
            </div>
          </div>



          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 py-3 text-sm font-medium text-white hover:bg-red-600"
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
