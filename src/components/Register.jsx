import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import dataService from "../services/MongoDBService";

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
        // Initialize storage
        await dataService.init();

        const currentUser = sessionStorage.getItem("currentUser");
        if (currentUser) {
          const userData = JSON.parse(currentUser);

          // Verify user exists in storage
          const dbUser = await dataService.getUserByEmail(userData.email);

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
            // User not found in storage, clear session
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
        const eventsData = await dataService.getEvents();
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
      // Create the registration in storage
      const registrationData = {
        userId: user.id,
        eventId: formData.event,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization,
        membershipType: formData.membershipType,
        interests: formData.interests,
      };

      const registration = await dataService.createRegistration(
        registrationData
      );

      // Navigate to the confirmation page
      navigate(`/registration-confirmation/${registration.id}`);
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        form: "Registration failed. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Please Log In to Register
            </h2>
            <div className="text-center">
              <Link
                to="/login"
                className="inline-block bg-[#006699] text-white px-6 py-3 rounded-md font-medium hover:bg-[#00557A] transition-colors duration-300"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] pt-20 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Register for an Event
            </h1>

            {errors.form && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-gray-700 mb-1"
                  >
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
                    } p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300`}
                  />
                  {errors.firstName && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.firstName}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-gray-700 mb-1"
                  >
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
                    } p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300`}
                  />
                  {errors.lastName && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.lastName}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-1">
                    Email
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
                    className={`border ${
                      errors.event ? "border-red-500" : "border-gray-300"
                    } p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] transition-all duration-300`}
                  >
                    <option value="">Select an event</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                  {errors.event && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.event}
                    </span>
                  )}
                </div>
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

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className={`h-4 w-4 ${
                    errors.agreeToTerms ? "border-red-500" : "border-gray-300"
                  } rounded text-[#006699] focus:ring-[#006699]`}
                />
                <label
                  htmlFor="agreeToTerms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <a href="#" className="text-[#006699] hover:text-[#00557A]">
                    terms and conditions
                  </a>
                </label>
              </div>
              {errors.agreeToTerms && (
                <span className="text-red-500 text-sm block">
                  {errors.agreeToTerms}
                </span>
              )}

              <div className="flex justify-end space-x-4">
                <Link
                  to="/events"
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#006699] text-white rounded-md hover:bg-[#00557A] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
