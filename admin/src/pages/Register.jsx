import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import InputField from "../components/InputField";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
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

      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setMessage(data.message || "Registration failed");
        return;
      }

      navigate("/");
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
        <div className="bg-white rounded-3xl p-10 border border-[#E2E8F0] shadow-xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#3D6098] font-medium mb-2"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </button>

          <h2 className="text-2xl font-semibold text-center mb-2 text-[#1F2A44]">
            Create Account
          </h2>

          <p className="text-[#64748B] text-center mb-8 text-sm">
            Register to manage RoadWatch
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />

            <InputField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose a username"
            />

            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            <InputField
              label="Phone Number"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
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
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="text-center mt-8 text-sm">
            <span className="text-[#64748B]">Already have an account?</span>
            <button
              onClick={() => navigate("/")}
              className="text-[#3D6098] font-semibold ml-1"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
