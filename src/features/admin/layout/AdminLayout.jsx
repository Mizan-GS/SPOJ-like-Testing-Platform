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
import QuestionsList from "../questions/QuestionsList";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../../app/providers/ThemeProvider";

function ThemeToggle({ collapsed }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        flex w-full items-center gap-2
        rounded-lg border border-[var(--color-border)]
        px-3 py-2
        text-sm
        text-[var(--color-text)]
        hover:bg-[var(--color-primary)]
        transition
      "
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
    </button>
  );
}





function SidebarLink({ to, icon: Icon, label, collapsed}) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-6 py-5 text-md font-medium transition
      ${
          collapsed
            ? "justify-center px-3 py-3"
            : "gap-3 px-4 py-3"
        }
      
      ${
          isActive ? "bg-secondary text-primary"
            : "text-secondary bg-primary  hover:bg-secondary/30"
        }`
      }
    >
      
      {!collapsed && <><Icon size={20} /><span>{label}</span></>}
      {collapsed && <span><Icon size={20} /></span>}
    </NavLink>
  );
}

function StatRow({ icon: Icon, label, value, collapsed }) {
  return (
    <div className="flex items-center justify-between text-[var(--color-text)]/70">
      <div className="flex items-center gap-2">
        <Icon size={18} />
        {!collapsed && <span>{label}</span>}
      </div>
      {!collapsed && <span className="font-medium">{value ?? "—"}</span>}
    </div>
  );
}



// const navItemBase =
//   "block rounded-lg px-7 py-4 text-md font-medium transition-colors";

// const navItemInactive =
//   "text-gray-700 hover:bg-purple-100 hover:text-purple-700";

// const navItemActive =
//   "bg-purple-500 text-white";

function AdminLayout() {
  const navigate = useNavigate();
  const [collapsed,setCollapsed]=useState(false)


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };
  const [overview,setOverview]=useState([])
  // const [questions,setQuestions]=useState([])
  const [loading,setLoading]= useState();
  const [questions,setQuestions]=useState(0);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewRes,quesCount] = await Promise.all([
          getAdminOverviewAnalytics(),
          getAllQuestions()
        ]);

        console.log(overviewRes.data.data);
        // console.log(userRes.data.data);
        // console.log(testRes.data.data);

        console.log(quesCount.data.data);
        
        setQuestions(quesCount.data.data.count)
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
      <aside
        className={`flex min-h-screen flex-col bg-primary border-r-2 border-[var(--color-border)]  transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
        `}
      >

        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between px-4 py-4">
            {!collapsed && (
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                Admin Panel
              </h2>
            )}

            <button
              onClick={() => setCollapsed((c) => !c)}
              className="
                rounded-lg
                border border-[var(--color-border)]
                p-2
                text-[var(--color-text)]
                hover:bg-[var(--color-primary)]
                transition
              "
            >
              ☰
            </button>
          </div>


          <nav className="flex-1 px-4 py-6 space-y-1">
            <SidebarLink
              to="/admin"
              icon={LayoutDashboard}
              label="Dashboard"
              collapsed={collapsed}
            />

            <SidebarLink
              to="/admin/questions"
              icon={HelpCircle}
              label="Questions"
              collapsed={collapsed}
            />

            <SidebarLink
              to="/admin/tests"
              icon={ClipboardCheck}
              label="Tests"
              collapsed={collapsed}
            />

            <SidebarLink
              to="/admin/assessments"
              icon={Layers}
              label="Assessments"
              collapsed={collapsed}
            />
          </nav>

          <div className="px-4 pb-4">
            {!collapsed && (
              <h4 className="mb-3 text-xs font-semibold uppercase text-[var(--color-text)]/50">
                Quick Stats
              </h4>
            )}

            <div className="space-y-3 text-sm">
              <StatRow icon={Users} label="Users" value={overview.totalUsers} collapsed={collapsed} />
              <StatRow icon={FileQuestion} label="Questions" value={questions} collapsed={collapsed} />
              <StatRow icon={FileText} label="Tests" value={overview.totalTests} collapsed={collapsed} />
              <StatRow icon={FileText} label="Assessments" value={overview.totalAssessments} collapsed={collapsed} />
            </div>
          </div>



          <div className="px-4 py-3 border-t border-[var(--color-border)]">
            <ThemeToggle collapsed={collapsed} />
          </div>

          <div className="px-4 py-4 border-t border-[var(--color-border)]">
            <button
              onClick={handleLogout}
              className="
                flex w-full items-center justify-center gap-2
                rounded-lg
                bg-red-500
                py-3
                text-sm font-medium text-white
                hover:bg-red-600
              "
            >
              <LogOut size={16} />
              {!collapsed && "Logout"}
            </button>
          </div>

        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-bg text-text overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
