import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import mongoDBService from "../services/MongoDBService";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Initializing storage...");
        // Initialize storage
        await mongoDBService.init();

        // Get the user from sessionStorage
        const authUserStr = sessionStorage.getItem("currentUser");
        console.log("Auth user string from session:", authUserStr);

        if (!authUserStr) {
          console.log("No user in session, redirecting to login");
          navigate("/login");
          return;
        }

        let authUser;
        try {
          authUser = JSON.parse(authUserStr);
        } catch (e) {
          console.error("Error parsing user data:", e);
          sessionStorage.removeItem("currentUser");
          navigate("/login");
          return;
        }

        console.log("Auth user from session:", authUser);

        if (!authUser || !authUser.email) {
          console.log("Invalid user data in session");
          sessionStorage.removeItem("currentUser");
          navigate("/login");
          return;
        }

        // Get full user details from the service
        console.log("Fetching user details for email:", authUser.email);
        const userData = await mongoDBService.getUserByEmail(authUser.email);
        console.log("User data from storage:", userData);

        if (!userData) {
          console.log("User not found in storage, clearing session");
          sessionStorage.removeItem("currentUser");
          navigate("/login");
          return;
        }

        setUser(userData);

        // Get user registrations using the correct ID field
        console.log("Fetching registrations for user:", userData.id);
        const userRegistrations = await mongoDBService.getRegistrationsByUserId(
          userData.id
        );
        console.log("User registrations:", userRegistrations);

        // For each registration, get the event details
        const registrationsWithEvents = await Promise.all(
          userRegistrations.map(async (reg) => {
            if (!reg.eventId) {
              console.warn("Registration missing eventId:", reg);
              return null;
            }
            console.log("Fetching event details for registration:", reg.id);
            const event = await mongoDBService.getEventById(reg.eventId);
            console.log("Event details:", event);
            return { ...reg, event };
          })
        );

        // Filter out any null registrations
        setRegistrations(registrationsWithEvents.filter((reg) => reg !== null));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handleEditProfile = () => {
    // We could implement profile editing functionality here
    alert("Profile editing will be implemented in a future update");
  };

  const handleViewRegistration = (registrationId) => {
    navigate(`/registration-confirmation/${registrationId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">User Profile</h1>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "profile"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "registrations"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("registrations")}
          >
            My Registrations
          </button>
        </div>

        {activeTab === "profile" && user && (
          <div className="p-6">
            <div className="flex items-center">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                {user.firstName && user.lastName
                  ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                  : "U"}
              </div>
              <div className="ml-6">
                <h2 className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-500">{user.email}</p>
                {user.phone && <p className="text-gray-500">{user.phone}</p>}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">
                  Personal Information
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="font-medium">First Name</div>
                    <div className="col-span-2">
                      {user.firstName || "Not specified"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-2 border-t border-gray-200">
                    <div className="font-medium">Last Name</div>
                    <div className="col-span-2">
                      {user.lastName || "Not specified"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-2 border-t border-gray-200">
                    <div className="font-medium">Email</div>
                    <div className="col-span-2">{user.email}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-2 border-t border-gray-200">
                    <div className="font-medium">Phone</div>
                    <div className="col-span-2">
                      {user.phone || "Not specified"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">IEEE Information</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="font-medium">Member Status</div>
                    <div className="col-span-2">
                      {user.isIEEEMember ? "IEEE Member" : "Non-Member"}
                    </div>
                  </div>
                  {user.isIEEEMember && (
                    <div className="grid grid-cols-3 gap-4 py-2 border-t border-gray-200">
                      <div className="font-medium">Member ID</div>
                      <div className="col-span-2">
                        {user.ieeeNumber || "Not specified"}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-4 py-2 border-t border-gray-200">
                    <div className="font-medium">Joined</div>
                    <div className="col-span-2">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleEditProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}

        {activeTab === "registrations" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">My Registrations</h2>

            {registrations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>You haven't registered for any events yet.</p>
                <button
                  onClick={() => navigate("/events")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Browse Events
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ticket Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {registrations.map((reg) => (
                      <tr key={reg.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {reg.event?.title || "Unknown Event"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {reg.event?.date || "Unknown Date"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {reg.ticketNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewRegistration(reg.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Ticket
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-50 px-6 py-4 flex justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-blue-600 transition duration-300"
          >
            Back to Home
          </button>
          <div>
            <button
              onClick={() => navigate("/events")}
              className="text-gray-600 hover:text-blue-600 transition duration-300 mr-4"
            >
              Browse Events
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-gray-600 hover:text-blue-600 transition duration-300"
            >
              Register for Event
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UserProfile;
