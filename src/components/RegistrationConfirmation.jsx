import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import dataService from "../services/MongoDBService";

// Component that shows event registration confirmation and ticket
const RegistrationConfirmation = () => {
  const { registrationId } = useParams();
  const navigate = useNavigate();
  // State for storing data and UI status
  const [registrationData, setRegistrationData] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ticketRef = useRef(null);

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Initializing storage...");
        await dataService.init();

        // Get registration details by ID
        console.log("Fetching registration data for ID:", registrationId);
        const registration = await dataService.getRegistrationById(
          registrationId
        );
        console.log("Registration data:", registration);

        if (!registration) {
          setError("Registration not found");
          return;
        }

        setRegistrationData(registration);

        // Get associated event details
        console.log("Fetching event details for ID:", registration.eventId);
        const event = await dataService.getEventById(registration.eventId);
        console.log("Event data:", event);

        if (!event) {
          setError("Event not found");
          return;
        }

        setEventData(event);
      } catch (error) {
        console.error("Error fetching registration data:", error);
        setError("Failed to load registration data");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationData();
  }, [registrationId]);

  // Handle ticket download as PNG image
  const handleDownloadTicket = async () => {
    if (!ticketRef.current) {
      console.error("Ticket reference not found");
      return;
    }

    try {
      console.log("Starting ticket download process...");

      // Create high-quality canvas from ticket element
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: true,
        backgroundColor: "#ffffff",
        width: ticketRef.current.offsetWidth,
        height: ticketRef.current.offsetHeight,
        onclone: (clonedDoc) => {
          // Preserve dimensions in cloned element
          const clonedElement = clonedDoc.querySelector(
            "[data-ticket-content]"
          );
          if (clonedElement) {
            clonedElement.style.width = `${ticketRef.current.offsetWidth}px`;
            clonedElement.style.height = `${ticketRef.current.offsetHeight}px`;
          }
        },
      });

      console.log("Canvas created successfully");

      // Convert to PNG blob
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png", 1.0);
      });

      console.log("Blob created successfully");

      // Set up download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket-${registrationData.ticketNumber}.png`;

      // Trigger download and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log("Download completed successfully");
    } catch (error) {
      console.error("Error generating ticket:", error);
      setError("Failed to generate ticket. Please try again.");
    }
  };

  // Show loading spinner while fetching data
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

  // Show error message if fetch failed
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

  // Main confirmation content with ticket
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006699]"></div>
            <p className="mt-4 text-gray-700">
              Loading registration details...
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <Link
              to="/events"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              {/* Confirmation header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Registration Confirmed!
                </h1>
                <p className="text-gray-600">
                  Your registration for {eventData?.title} has been confirmed.
                </p>
              </div>

              {/* Ticket Section */}
              <div className="border-2 border-gray-200 rounded-lg p-6 mb-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Ticket
                  </h2>
                  <p className="text-gray-600">
                    Please save or download your ticket for entry
                  </p>
                </div>

                {/* Ticket element (converted to image for download) */}
                <div
                  ref={ticketRef}
                  data-ticket-content
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                  style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {eventData?.title}
                    </h3>
                    <div className="mb-4">
                      <p className="text-gray-600">
                        {new Date(eventData?.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">{eventData?.location}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-900 font-semibold">
                        Ticket Number: {registrationData?.ticketNumber}
                      </p>
                      <p className="text-gray-600">
                        {registrationData?.userName}
                      </p>
                    </div>
                    <div className="mt-4">
                      <img
                        src={registrationData?.qrCode}
                        alt="QR Code"
                        className="mx-auto w-32 h-32"
                        crossOrigin="anonymous"
                      />
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <div className="text-center mt-6">
                  <button
                    onClick={handleDownloadTicket}
                    className="px-6 py-3 bg-[#006699] text-white rounded-md hover:bg-[#00557A] transition duration-300 flex items-center justify-center mx-auto"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-center space-x-4">
                <Link
                  to="/events"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-300"
                >
                  Browse More Events
                </Link>
                <Link
                  to="/profile"
                  className="px-6 py-3 bg-[#006699] text-white rounded-md hover:bg-[#00557A] transition duration-300"
                >
                  View My Profile
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RegistrationConfirmation;
