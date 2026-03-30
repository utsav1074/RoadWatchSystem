import { Outlet } from "react-router-dom";
import Sidebar from "../pages/Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      <main className="flex-1 ml-60">
        <Outlet />
      </main>
    </div>
  );
}
