import { useContext, useState } from "react";
import Loginicon from "../../assest/signin.gif";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import summuryAPI from "../../Common/index";
import { toast } from "react-toastify";
import Context from "../../context/index";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { fetchUserDetails } = useContext(Context);

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // clear errors as user types
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ✅ Validation function
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; 

    try {
      const dataResponse = await fetch(summuryAPI.Signin.url, {
        method: summuryAPI.Signin.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const dataapi = await dataResponse.json();

      if (dataapi.success) {
        toast.success(dataapi.message);
        fetchUserDetails();
         localStorage.setItem("reloadOnce", "true");
        navigate("/",);
      } else {
        toast.error(dataapi.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-tr from-yellow-100 via-white to-yellow-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={Loginicon} alt="login icon" className="w-20 h-20" />
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Welcome Back
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="text-gray-700 font-medium block mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={handleOnChange}
              className={`w-full p-3 border rounded-lg bg-slate-100 focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-yellow-400"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 font-medium block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={data.password}
                onChange={handleOnChange}
                className={`w-full p-3 pr-10 border rounded-lg bg-slate-100 focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-yellow-400"
                }`}
              />
              <span
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={handlePasswordToggle}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
            <Link
              to={"/forgot-password"}
              className="block w-fit ml-auto mt-1 text-sm text-blue-600 hover:underline hover:text-blue-800"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300 shadow"
          >
            Login
          </button>
        </form>

        {/* Redirect to Signup */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?
          <Link
            to="/sign-up"
            className="text-blue-600 hover:underline hover:text-blue-800 ml-1"
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}