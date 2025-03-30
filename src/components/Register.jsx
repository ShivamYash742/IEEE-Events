import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import mongoDBService from "../services/MongoDBService";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eventId = queryParams.get("event");

  // Check authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuthentication = async () => {
      try {
        // Initialize MongoDB
        await mongoDBService.init();

        const currentUser = sessionStorage.getItem("currentUser");
        if (currentUser) {
          const userData = JSON.parse(currentUser);

          // Verify user exists in database
          const dbUser = await mongoDBService.getUserByEmail(userData.email);

          if (dbUser) {
            setIsAuthenticated(true);
            setUser(dbUser);

            // Prefill form with user data
            setFormData((prev) => ({
              ...prev,
              firstName: dbUser.firstName || "",
              lastName: dbUser.lastName || "",
              email: dbUser.email || "",
              phone: dbUser.phone || "",
              organization: dbUser.organization || "",
            }));
          } else {
            // User not found in DB, clear session
            sessionStorage.removeItem("currentUser");
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // Form fields state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    membershipType: "regular",
    event: eventId || "",
    interests: [],
    agreeToTerms: false,
  });

  // Error states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Events data for the dropdown
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await mongoDBService.getEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "agreeToTerms") {
        setFormData({
          ...formData,
          [name]: checked,
        });
      } else {
        // Handle interests checkboxes
        const updatedInterests = [...formData.interests];
        if (checked) {
          updatedInterests.push(value);
        } else {
          const index = updatedInterests.indexOf(value);
          if (index > -1) {
            updatedInterests.splice(index, 1);
          }
        }
        setFormData({
          ...formData,
          interests: updatedInterests,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate form
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

    if (formData.phone && !/^\+?[0-9()-\s]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number format is invalid";
    }

    if (!formData.event) {
      newErrors.event = "Please select an event";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the registration in MongoDB
      const registrationData = {
        userId: user._id,
        eventId: formData.event,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization,
        membershipType: formData.membershipType,
        interests: formData.interests,
      };

      const registration = await mongoDBService.createRegistration(
        registrationData
      );

      // Navigate to the confirmation page
      navigate(`/registration-confirmation/${registration._id}`);
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        form: "Registration failed. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  // If not authenticated, redirect to login
  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] pt-20 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md"
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
              Authentication Required
            </h1>

            <p className="text-gray-600 text-center mb-6">
              Please log in or create an account to register for IEEE events.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-[#006699] text-white py-3 px-6 rounded-md font-medium hover:bg-[#00557A] transition-all duration-300 text-center"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-white border border-[#006699] text-[#006699] py-3 px-6 rounded-md font-medium hover:bg-gray-50 transition-all duration-300 text-center"
              >
                Create Account
              </Link>
            </div>

            <div className="mt-8 text-center">
              <Link to="/" className="text-[#006699] hover:underline">
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] pt-20 pb-16 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006699]"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] pt-20 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#006699]">
              IEEE Registration
            </h1>
            <p className="text-gray-600 mt-2">
              Join the IEEE community or register for an upcoming event
            </p>
          </div>

          <div className="flex mb-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center bg-[#006699] text-white px-4 py-2 rounded-md hover:bg-[#00557A] transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
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

          {errors.form && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
              role="alert"
            >
              <span className="block sm:inline">{errors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-gray-700 mb-1">
                  First Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`border ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  } p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300`}
                />
                {errors.firstName && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.firstName}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-gray-700 mb-1">
                  Last Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`border ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  } p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300`}
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
                Email Address<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300`}
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.email}
                </span>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300`}
              />
              {errors.phone && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.phone}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="organization"
                className="block text-gray-700 mb-1"
              >
                Organization/University
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300"
              />
            </div>

            <div>
              <label
                htmlFor="membershipType"
                className="block text-gray-700 mb-1"
              >
                Membership Type
              </label>
              <select
                id="membershipType"
                name="membershipType"
                value={formData.membershipType}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300"
              >
                <option value="regular">Regular Member</option>
                <option value="student">Student Member</option>
                <option value="associate">Associate Member</option>
                <option value="senior">Senior Member</option>
                <option value="fellow">Fellow</option>
              </select>
            </div>

            <div>
              <label htmlFor="event" className="block text-gray-700 mb-1">
                Register for Event
              </label>
              <select
                id="event"
                name="event"
                value={formData.event}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300"
              >
                <option value="">Select an event (optional)</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="block text-gray-700 mb-2">
                Areas of Interest
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  "Artificial Intelligence",
                  "Robotics",
                  "Power & Energy",
                  "Telecommunications",
                  "Computer Science",
                  "Biomedical Engineering",
                  "Cybersecurity",
                  "Sustainable Technology",
                ].map((interest) => (
                  <div key={interest} className="flex items-center">
                    <input
                      type="checkbox"
                      id={interest.replace(/\s+/g, "")}
                      name="interests"
                      value={interest}
                      checked={formData.interests.includes(interest)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor={interest.replace(/\s+/g, "")}
                      className="text-gray-700"
                    >
                      {interest}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="focus:ring-[#006699] h-4 w-4 text-[#006699] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="text-[#006699] hover:underline">
                    terms and conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#006699] hover:underline">
                    privacy policy
                  </a>
                </label>
                {errors.agreeToTerms && (
                  <div className="text-red-500 mt-1">{errors.agreeToTerms}</div>
                )}
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-[#006699] text-white py-3 px-8 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006699] transition-all duration-300 w-full md:w-auto ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed hover:bg-[#006699]"
                    : "hover:bg-[#00557A]"
                }`}
              >
                {isSubmitting ? (
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
                    Processing...
                  </span>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
