import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import mongoDBService from "../services/MongoDBService";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    // Initialize MongoDB
    const initMongoDB = async () => {
      try {
        await mongoDBService.init();
      } catch (error) {
        console.error("Failed to initialize MongoDB:", error);
        setLoginError("Database connection error. Please try again later.");
      }
    };

    initMongoDB();

    // Check if already logged in
    const currentUser = sessionStorage.getItem("currentUser");
    if (currentUser) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
    if (loginError) {
      setLoginError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      // Fetch user from MongoDB service
      const user = await mongoDBService.getUserByEmail(formData.email);

      // Check if user exists and password matches
      if (user && user.password === formData.password) {
        // Store user info in sessionStorage (without password)
        const { password, ...userWithoutPassword } = user;
        sessionStorage.setItem(
          "currentUser",
          JSON.stringify(userWithoutPassword)
        );

        navigate("/");
      } else {
        setLoginError("Invalid email or password");
      }
    } catch (error) {
      setLoginError("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] pt-20 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-6">
            <img
              src="https://brand-experience.ieee.org/wp-content/uploads/2019/01/mb-ieee-blue.png"
              alt="IEEE Logo"
              className="h-12"
            />
          </div>

          <h1 className="text-2xl font-bold text-[#006699] text-center mb-6">
            Sign in to IEEE
          </h1>

          {loginError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.email}
                </span>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#006699] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300`}
                placeholder="••••••••"
              />
              {errors.password && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-[#006699] focus:ring-[#006699] border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`bg-[#006699] text-white py-3 px-4 rounded-md font-medium hover:bg-[#00557A] transition-all duration-300 w-full ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#006699] hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-[#006699] hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
