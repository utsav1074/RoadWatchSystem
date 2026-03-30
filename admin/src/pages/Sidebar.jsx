import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, FileText, LogOut, Shield } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const navItem =
    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-medium";

  const navLinkClass = ({ isActive }) =>
    `${navItem} ${
      isActive
        ? "bg-white text-[#2460B9] shadow-sm"
        : "text-[#1E293B] hover:bg-white hover:text-[#0F172A]"
    }`;

  return (
    <aside className="w-60 bg-[#F6F9FE] fixed h-screen flex flex-col justify-between border-r border-[#C5D1E0]">
      {/* TOP */}
      <div>
        <div className="py-8 pr-2 flex items-center justify-center gap-1">
          <Shield size={22} className="text-[#0F172A]" />
          <h1 className="text-lg font-semibold tracking-wide text-[#0F172A]">
            ROADWATCH
          </h1>
        </div>

        <div className="h-px bg-[#C5D1E0] mx-4" />

        <nav className="mt-8 px-4 space-y-2">
          <NavLink to="/dashboard" className={navLinkClass}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/users" className={navLinkClass}>
            <Users size={18} />
            Users
          </NavLink>

          <NavLink to="/reports" className={navLinkClass}>
            <FileText size={18} />
            Reports
          </NavLink>
        </nav>
      </div>

      {/* BOTTOM */}
      <div>
        <div className="h-px bg-[#C5D1E0] mx-4 mb-6" />

        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-[#1E293B] ml-4 mb-8 hover:text-[#EF4444]"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
