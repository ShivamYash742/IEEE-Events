import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import dataService from "../services/MongoDBService";

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
        // Initialize storage
        await dataService.init();

        // Get registration details
        const registrationData = await dataService.getRegistrationById(
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
          const eventData = await dataService.getEventById(
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
          // Initialize storage
          await dataService.init();

          // Create a mock registration
          const mockRegistration = await dataService.createRegistration({
            userId: "demo-user",
            eventId: "1", // Using the first event from our mock data
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            membershipType: "regular",
          });

          setRegistration(mockRegistration);

          // Get event details
          const eventData = await dataService.getEventById("1");
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
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-red-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/events"
              className="inline-block bg-[#006699] text-white px-6 py-3 rounded-md font-medium hover:bg-[#00557A] transition-colors duration-300"
            >
              Browse Events
            </Link>
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
                to={event ? `/events/${event.id}` : "/events"}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006699]"
              >
                {event ? "View Event Details" : "Browse Events"}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegistrationConfirmation;
