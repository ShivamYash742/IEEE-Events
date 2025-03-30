import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import mongoDBService from "../services/MongoDBService";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    isIEEEMember: false,
    ieeeNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  useEffect(() => {
    // Initialize MongoDB
    const initMongoDB = async () => {
      try {
        await mongoDBService.init();
      } catch (error) {
        console.error("Failed to initialize MongoDB:", error);
        setSignupError("Database connection error. Please try again later.");
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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear errors
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
    if (signupError) {
      setSignupError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.isIEEEMember && !formData.ieeeNumber) {
      newErrors.ieeeNumber = "IEEE membership number is required";
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
      // Check if email already exists
      const existingUser = await mongoDBService.getUserByEmail(formData.email);

      if (existingUser) {
        setSignupError(
          "This email is already registered. Please login instead."
        );
        setLoading(false);
        return;
      }

      // Extract data to save (remove confirmPassword)
      const { confirmPassword, ...userData } = formData;

      // Create user in MongoDB service
      const newUser = await mongoDBService.createUser(userData);

      if (newUser) {
        // Store user info in sessionStorage (without password)
        const { password, ...userWithoutPassword } = newUser;
        sessionStorage.setItem(
          "currentUser",
          JSON.stringify(userWithoutPassword)
        );

        navigate("/");
      } else {
        throw new Error("Failed to create user");
      }
    } catch (error) {
      setSignupError("Registration failed. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] pt-20 pb-16">
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
            Create an IEEE Account
          </h1>

          {signupError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{signupError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`border ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  } p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300`}
                />
                {errors.firstName && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.firstName}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`border ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  } p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300`}
                />
                {errors.lastName && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>

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
              <label htmlFor="phone" className="block text-gray-700 mb-1">
                Phone Number (optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300"
                placeholder="+1 (123) 456-7890"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-1">
                Password
              </label>
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <div className="mt-4">
              <div className="flex items-center">
                <input
                  id="isIEEEMember"
                  name="isIEEEMember"
                  type="checkbox"
                  checked={formData.isIEEEMember}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#006699] focus:ring-[#006699] border-gray-300 rounded"
                />
                <label
                  htmlFor="isIEEEMember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I am an IEEE Member
                </label>
              </div>

              {formData.isIEEEMember && (
                <div className="mt-3">
                  <label
                    htmlFor="ieeeNumber"
                    className="block text-gray-700 mb-1"
                  >
                    IEEE Membership Number
                  </label>
                  <input
                    type="text"
                    id="ieeeNumber"
                    name="ieeeNumber"
                    value={formData.ieeeNumber}
                    onChange={handleChange}
                    className={`border ${
                      errors.ieeeNumber ? "border-red-500" : "border-gray-300"
                    } p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300`}
                  />
                  {errors.ieeeNumber && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.ieeeNumber}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600">
              By creating an account, you agree to IEEE's{" "}
              <a
                href="https://www.ieee.org/about/help/security-privacy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#006699] hover:underline"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://www.ieee.org/about/help/terms-conditions.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#006699] hover:underline"
              >
                Terms of Service
              </a>
              .
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
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-[#006699] hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
