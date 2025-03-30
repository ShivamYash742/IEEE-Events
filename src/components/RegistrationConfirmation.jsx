import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import mongoDBService from "../services/MongoDBService";

const RegistrationConfirmation = () => {
  const { registrationId } = useParams();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ticketRef = useRef(null);

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        // Initialize MongoDB
        await mongoDBService.init();

        // Get registration details
        const registrationData = await mongoDBService.getRegistrationById(
          registrationId
        );
        if (!registrationData) {
          setError("Registration not found");
          setLoading(false);
          return;
        }

        setRegistration(registrationData);

        // Get event details if eventId exists
        if (registrationData.eventId) {
          const eventData = await mongoDBService.getEventById(
            registrationData.eventId
          );
          setEvent(eventData);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching registration data:", err);
        setError("Failed to load registration details");
        setLoading(false);
      }
    };

    // If we don't have a registration ID, create a mock one for demo purposes
    if (!registrationId) {
      const createMockRegistration = async () => {
        try {
          // Initialize MongoDB
          await mongoDBService.init();

          // Create a mock registration
          const mockRegistration = await mongoDBService.createRegistration({
            userId: "demo-user",
            eventId: "1", // Using the first event from our mock data
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            membershipType: "regular",
          });

          setRegistration(mockRegistration);

          // Get event details
          const eventData = await mongoDBService.getEventById("1");
          setEvent(eventData);

          setLoading(false);
        } catch (err) {
          console.error("Error creating mock registration:", err);
          setError("Failed to create mock registration");
          setLoading(false);
        }
      };

      createMockRegistration();
    } else {
      fetchRegistrationData();
    }
  }, [registrationId]);

  const handleDownloadTicket = () => {
    if (ticketRef.current) {
      html2canvas(ticketRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = `IEEE-Ticket-${registration.ticketNumber}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] pt-20 pb-16 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006699]"></div>
          <p className="mt-4 text-gray-700">Loading registration details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h1 className="text-2xl font-bold text-gray-800 mt-4">Error</h1>
              <p className="text-gray-600 mt-2">{error}</p>
              <button
                onClick={() => navigate("/register")}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#006699] hover:bg-[#00557A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006699]"
              >
                Go to Registration
              </button>
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
          <div className="bg-white p-8 rounded-lg shadow-md mb-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Registration Successful!
              </h1>
              <p className="text-gray-600 mt-2">
                Your registration has been confirmed. Here is your ticket:
              </p>
            </div>

            {/* Event ticket with QR code */}
            <div
              ref={ticketRef}
              className="bg-gradient-to-r from-[#006699] to-[#00557A] text-white p-6 rounded-lg shadow-lg mb-6"
            >
              <div className="flex flex-col md:flex-row items-center">
                <div className="bg-white p-3 rounded-lg mr-0 md:mr-6 mb-4 md:mb-0 w-full md:w-auto">
                  <img
                    src={registration.qrCode}
                    alt="QR Code"
                    className="w-40 h-40 mx-auto"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold">
                        {event ? event.title : "IEEE Membership"}
                      </h2>
                      <p className="text-blue-100">
                        {event
                          ? event.date
                          : "Registration Date: " +
                            new Date(
                              registration.registrationDate
                            ).toLocaleDateString()}
                      </p>
                    </div>
                    <img
                      src="https://brand-experience.ieee.org/wp-content/uploads/2019/01/mb-ieee-white.png"
                      alt="IEEE Logo"
                      className="h-8"
                    />
                  </div>

                  <div className="border-t border-blue-400 pt-4 mb-4">
                    <p>
                      <span className="text-blue-200">Name:</span>{" "}
                      {registration.firstName} {registration.lastName}
                    </p>
                    <p>
                      <span className="text-blue-200">Member Type:</span>{" "}
                      {registration.membershipType.charAt(0).toUpperCase() +
                        registration.membershipType.slice(1)}
                    </p>
                    <p>
                      <span className="text-blue-200">Ticket #:</span>{" "}
                      {registration.ticketNumber}
                    </p>
                    {event && (
                      <p>
                        <span className="text-blue-200">Location:</span>{" "}
                        {event.location}
                      </p>
                    )}
                  </div>

                  <div className="text-xs text-blue-200">
                    <p>
                      Please present this ticket at the event entrance for
                      check-in
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
              <button
                onClick={handleDownloadTicket}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#006699] hover:bg-[#00557A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006699]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Ticket
              </button>

              <Link
                to={event ? `/events/${event._id}` : "/events"}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006699]"
              >
                {event ? "View Event Details" : "Browse Events"}
              </Link>

              <Link
                to="/"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006699]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-[#006699] p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  A copy of this ticket has been sent to your email. You can
                  also download it for offline access.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Thank you for registering with IEEE. If you have any questions,
              please contact us at{" "}
              <a
                href="mailto:support@ieee.org"
                className="text-[#006699] hover:underline"
              >
                support@ieee.org
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegistrationConfirmation;
