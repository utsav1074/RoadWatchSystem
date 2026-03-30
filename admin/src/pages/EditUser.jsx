import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function EditUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "Ahmed Khan",
    username: "ahmedk",
    email: "ahmed@gmail.com",
    phone: "+92 300 1234567",
    plate: "BA-2-PA-1234",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated:", form);
    navigate("/admin/users");
  };

  return (
    <div className="min-h-screen bg-[#F6F9FE] flex items-start justify-center pt-10 px-6">
      <div className="w-full max-w-2xl">
        {/* Back Button (same style as review page) */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* ===== CARD ===== */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-8 space-y-8"
        >
          {/* ===== CARD HEADER ===== */}
          <div>
            <h1 className="text-xl font-semibold text-[#0F172A]">Edit User</h1>
            <p className="text-sm text-[#64748B] mt-1">
              Update account and vehicle information
            </p>
          </div>

          <div className="h-px bg-[#E2E8F0]" />

          {/* ===== ACCOUNT SECTION ===== */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck size={18} className="text-[#2460B9]" />
              <h2 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wide">
                Account Information
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="col-span-2">
                <label className="block text-xs font-medium text-[#475569] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#2460B9] text-sm transition"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#2460B9] text-sm transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#2460B9] text-sm transition"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#2460B9] text-sm transition"
                />
              </div>

              {/* Vehicle Plate */}
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-2">
                  Vehicle Plate
                </label>
                <input
                  type="text"
                  name="plate"
                  value={form.plate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#2460B9] text-sm transition"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-[#E2E8F0]" />

          {/* ===== ACTIONS ===== */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-xl border border-[#CBD5E1] text-[#334155] hover:bg-[#F1F5F9] transition text-sm font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2460B9] hover:bg-[#1E4EA1] text-white transition text-sm font-medium shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
