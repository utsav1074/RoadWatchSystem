import { useState } from "react";
import { Search, UserPlus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const users = [
    {
      id: 1,
      name: "Ahmed Khan",
      username: "ahmedk",
      email: "ahmed@gmail.com",
      phone: "+92 300 1234567",
      plate: "BA-2-PA-1234",
    },
    {
      id: 2,
      name: "Fatima Ali",
      username: "fatima.ali",
      email: "fatima@gmail.com",
      phone: "+92 301 2345678",
      plate: "BA-3-PA-5678",
    },
    {
      id: 3,
      name: "Hassan Raza",
      username: "hassan_r",
      email: "hassan@gmail.com",
      phone: "+92 302 8765432",
      plate: "BA-1-PA-9876",
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.plate.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F6F9FE] py-14">
      <div className="max-w-7xl mx-auto px-16">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F172A]">
              User Management
            </h1>
            <p className="text-sm text-[#475569] mt-1">
              Manage registered users and their vehicles
            </p>
          </div>

          <button
            onClick={() => navigate("/register")}
            className="flex items-center gap-2 bg-[#2460B9] hover:bg-[#1E4EA1] text-white text-[14px] font-medium px-5 py-2.5 rounded-lg transition shadow-sm"
          >
            <UserPlus size={16} />
            Add User
          </button>
        </div>

        {/* ================= SEARCH ================= */}
        <div className="relative mb-10">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569]"
          />
          <input
            type="text"
            placeholder="Search by name, username, email or plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white pl-12 pr-4 py-3 rounded-lg border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#2460B9] text-[14px] shadow-sm text-[#0F172A]"
          />
        </div>

        {/* ================= USERS COUNT ================= */}
        <p className="text-sm text-[#334155] mb-6 font-medium">
          {filteredUsers.length} users found
        </p>

        {/* ================= USER LIST (2 COLUMN GRID) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl border border-[#CBD5E1] p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                {/* LEFT INFO */}
                <div>
                  <h2 className="text-[16px] font-semibold text-[#0F172A]">
                    {user.name}
                  </h2>

                  <p className="text-[13px] text-[#2460B9] font-medium mt-1">
                    @{user.username}
                  </p>

                  <div className="mt-3 space-y-1 text-[13px] text-[#475569]">
                    <p>{user.email}</p>
                    <p>{user.phone}</p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/users/edit/${user.id}`)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#E8F0FE] hover:bg-[#D6E4FF] transition"
                  >
                    <Pencil size={15} className="text-[#2460B9]" />
                  </button>

                  <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#FEE2E2] hover:bg-[#FECACA] transition">
                    <Trash2 size={15} className="text-[#EF4444]" />
                  </button>
                </div>
              </div>

              <div className="h-px bg-[#E2E8F0] my-5" />

              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#475569] font-medium">
                  Registered Vehicle
                </span>
                <span className="font-semibold text-[#0F172A] tracking-wide">
                  {user.plate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
