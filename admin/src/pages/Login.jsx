import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import InputField from "../components/InputField";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
      setIsError(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setIsError(true);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F9FE] py-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#3D6098] w-16 h-16 rounded-3xl flex items-center justify-center border border-[#E2E8F0] shadow-sm">
            <Shield size={26} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold mt-4 text-[#3D6098] tracking-tight">
            ROADWATCH
          </h1>
        </div>

        <div className="bg-white rounded-3xl p-10 border border-[#E2E8F0] shadow-xl">
          <h2 className="text-2xl font-semibold text-center mb-2 text-[#1F2A44]">
            Welcome Back
          </h2>

          <p className="text-[#64748B] text-center mb-8 text-sm">
            Sign in to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />

            {message && (
              <p
                className={`text-sm font-medium ${
                  isError ? "text-red-500" : "text-green-600"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3D6098] text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-[#2F4E7C] disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-8 text-sm">
            <span className="text-[#64748B]">Don’t have an account?</span>
            <button
              onClick={() => navigate("/register")}
              className="text-[#3D6098] font-semibold ml-1"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
