import { useState, useEffect } from "react";
import { Search, UserPlus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchUsers, deleteUser } from "../services/adminUserService";

export default function Users() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    loadUsers();
  }, [search]);

  const loadUsers = async () => {
    try {
      const { res, data } = await fetchUsers(search);

      if (!res.ok) return;

      const formatted = data.map((u) => ({
        id: u.user_id,
        name: u.full_name,
        username: u.username,
        email: u.email,
        phone: u.contact,
        plate: u.vehicle_numbers || "N/A",
      }));

      setUsers(formatted);
    } catch (err) {
      if (err.message === "NO_TOKEN") {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      const { res } = await deleteUser(id);

      if (!res.ok) return;

      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      if (err.message === "NO_TOKEN") {
        navigate("/");
      }
    }
  };

  // ================= FILTER (NO EMAIL) =================
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.username?.toLowerCase().includes(search.toLowerCase()) ||
      user.plate?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F6F9FE] py-14">
      <div className="max-w-7xl mx-auto px-16">
        {/* HEADER */}
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

        {/* SEARCH */}
        <div className="relative mb-10">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569]"
          />
          <input
            type="text"
            placeholder="Search by name, username or plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white pl-12 pr-4 py-3 rounded-lg border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#2460B9] text-[14px] shadow-sm text-[#0F172A]"
          />
        </div>

        {/* COUNT */}
        <p className="text-sm text-[#334155] mb-6 font-medium">
          {loading ? "Loading..." : `${filteredUsers.length} users found`}
        </p>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl border border-[#CBD5E1] p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-start">
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

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/users/edit/${user.id}`)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#E8F0FE] hover:bg-[#D6E4FF] transition"
                  >
                    <Pencil size={15} className="text-[#2460B9]" />
                  </button>

                  <button
                    onClick={() => handleDelete(user.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#FEE2E2] hover:bg-[#FECACA] transition"
                  >
                    <Trash2 size={15} className="text-[#EF4444]" />
                  </button>
                </div>
              </div>

              <div className="h-px bg-[#E2E8F0] my-5" />

              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#475569] font-medium">
                  Linked Vehicles
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
