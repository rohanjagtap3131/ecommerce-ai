import { useState } from "react";
import Loginicon from "../../assest/signin.gif"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import summuryAPI from "../../Common/index";
import { toast } from 'react-toastify';

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPass, setConfirmPass] = useState(false);
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const naviget = useNavigate();

    const handelPassword = () => setShowPassword((prev) => !prev);
    const handelConfirmPassword = () => setConfirmPass((prev) => !prev);

    const handelOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        // Name validation
        if (data.name.trim().length < 3) {
            toast.error("Name must be at least 3 characters long");
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            toast.error("Enter a valid email address");
            return false;
        }

        // Password validation
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/;
        if (!passwordRegex.test(data.password)) {
            toast.error("Password must be at least 6 characters & include a number and special character");
            return false;
        }

        // Confirm Password check
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }

        return true;
    };

    const handelSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return; // Stop if validation fails

        try {
            const dataResponse = await fetch(summuryAPI.Signup.url, {
                method: summuryAPI.Signup.method,
                headers: { "content-type": "application/json" },
                body: JSON.stringify(data),
            });

            const dataapi = await dataResponse.json();
            if (dataapi.success) {
                toast.success(dataapi.message);
                naviget("/login");
            } else if (dataapi.error) {
                toast.error(dataapi.message);
            }
        } catch (error) {
            toast.error("Something went wrong, please try again");
        }
    };

    return (
        <section id="signup" className="min-h-screen bg-gradient-to-tr from-yellow-100 via-white to-yellow-50 flex items-center justify-center px-4">
            <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <img src={Loginicon} alt="login icons" className="w-20 h-20" />
                </div>

                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Create Your Account</h2>

                <form className="flex flex-col gap-4" onSubmit={handelSubmit}>
                    {/* Name */}
                    <div>
                        <label className="text-gray-700 font-medium block mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={data.name}
                            onChange={handelOnChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-slate-100"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-gray-700 font-medium block mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={data.email}
                            onChange={handelOnChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-slate-100"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-gray-700 font-medium block mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter password"
                                value={data.password}
                                onChange={handelOnChange}
                                required
                                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-slate-100"
                            />
                            <span
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
                                onClick={handelPassword}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-gray-700 font-medium block mb-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={confirmPass ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm password"
                                value={data.confirmPassword}
                                onChange={handelOnChange}
                                required
                                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-slate-100"
                            />
                            <span
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
                                onClick={handelConfirmPassword}
                            >
                                {confirmPass ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="mt-4 w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300 shadow"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Login Redirect */}
                <p className="mt-6 text-sm text-center text-gray-600">
                    Already have an account?
                    <Link to="/login" className="text-blue-600 hover:underline hover:text-blue-800 ml-1">
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
}
