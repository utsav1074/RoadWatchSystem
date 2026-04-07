import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getUser, updateUser } from "../services/adminUserService";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    plate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ================= LOAD USER =================
  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);

      const { res, data } = await getUser(id);

      if (!res.ok) {
        alert(data?.message || "Failed to load user");
        return;
      }

      setForm({
        name: data?.full_name || "",
        username: data?.username || "",
        email: data?.email || "",
        phone: data?.contact || "",
        plate: data?.vehicle_numbers || "",
      });
    } catch (err) {
      if (err.message === "NO_TOKEN") {
        navigate("/");
        return;
      }

      alert("Something went wrong while loading user");
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    try {
      setSaving(true);

      const payload = {
        name: form.name,
        username: form.username,
        email: form.email,
        phone: form.phone,
      };

      const { res, data } = await updateUser(id, payload);

      if (!res.ok) {
        alert(data?.message || "Update failed");
        return;
      }

      // go back to users page
      navigate("/users");
    } catch (err) {
      if (err.message === "NO_TOKEN") {
        navigate("/");
        return;
      }

      alert("Something went wrong while updating");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F9FE] flex items-start justify-center pt-10 px-6">
      <div className="w-full max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-8 space-y-8"
        >
          <div>
            <h1 className="text-xl font-semibold text-[#0F172A]">Edit User</h1>
            <p className="text-sm text-[#64748B] mt-1">
              Update account and vehicle information
            </p>
          </div>

          <div className="h-px bg-[#E2E8F0]" />

          <div>
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck size={18} className="text-[#2460B9]" />
              <h2 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wide">
                Account Information
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-[#475569] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-sm"
                  disabled={loading || saving}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#475569] mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-sm"
                  disabled={loading || saving}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#475569] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-sm"
                  disabled={loading || saving}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#475569] mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-sm"
                  disabled={loading || saving}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#475569] mb-2">
                  Linked Vehicles
                </label>
                <input
                  type="text"
                  name="plate"
                  value={form.plate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-sm bg-[#F8FAFC]"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-[#E2E8F0]" />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-xl border border-[#CBD5E1]"
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2460B9] text-white disabled:opacity-70"
              disabled={loading || saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
