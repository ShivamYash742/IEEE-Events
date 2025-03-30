// src/components/Home.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import mongoDBService from "../services/MongoDBService";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if MongoDB connection is established
    const initializeDB = async () => {
      setLoading(true);
      try {
        // Initialize MongoDB connection
        await mongoDBService.init();

        // Check if user is logged in (from session storage for front-end)
        const currentUser = sessionStorage.getItem("currentUser");
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          // Verify user exists in MongoDB
          const dbUser = await mongoDBService.getUserByEmail(userData.email);
          if (dbUser) {
            setIsLoggedIn(true);
            setUser(dbUser);
            // Update session with latest user data
            sessionStorage.setItem("currentUser", JSON.stringify(dbUser));
          } else {
            // User doesn't exist in DB, clear session
            sessionStorage.removeItem("currentUser");
          }
        }
      } catch (error) {
        console.error("Failed to initialize DB:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeDB();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    setUser(null);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
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
    <div className="min-h-screen flex flex-col bg-white">
      {/* Modern Navbar */}
      <header className="bg-[#006699] shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="https://brand-experience.ieee.org/wp-content/uploads/2019/01/mb-ieee-white.png"
              alt="IEEE Logo"
              className="h-10"
            />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#home"
              className="text-white hover:text-[#F2F2F2] transition-colors duration-300 font-medium"
            >
              Home
            </a>
            <a
              href="#about"
              className="text-white hover:text-[#F2F2F2] transition-colors duration-300 font-medium"
            >
              About
            </a>
            <a
              href="#events"
              className="text-white hover:text-[#F2F2F2] transition-colors duration-300 font-medium"
            >
              Events
            </a>
            <Link
              to="/events"
              className="text-white hover:text-[#F2F2F2] transition-colors duration-300 font-medium"
            >
              All Events
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="text-white hover:text-[#F2F2F2] transition-colors duration-300 font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-[#F2F2F2] transition-colors duration-300 font-medium"
                >
                  Logout
                </button>
                <Link
                  to="/register"
                  className="bg-white text-[#006699] px-4 py-2 rounded-md font-semibold hover:bg-[#F2F2F2] transition-all duration-300"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-[#F2F2F2] transition-colors duration-300 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-[#006699] px-4 py-2 rounded-md font-semibold hover:bg-[#F2F2F2] transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden ${
            isMenuOpen ? "block" : "hidden"
          } bg-[#006699] pb-4 pt-2`}
        >
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <a
              href="#home"
              className="text-white hover:text-[#F2F2F2] transition-colors duration-300 py-2 font-medium"
            >
              Home
            </a>
            <a
              href="#about"
              className="text-white hover:text-[#F2F2F2] transition-colors duration-300 py-2 font-medium"
            >
              About
            </a>
            <a
              href="#events"
              className="text-white hover:text-[#F2F2F2] transition-colors duration-300 py-2 font-medium"
            >
              Events
            </a>
            <Link
              to="/events"
              className="text-white hover:text-[#F2F2F2] transition-colors duration-300 py-2 font-medium"
            >
              All Events
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="text-white hover:text-[#F2F2F2] transition-colors duration-300 py-2 font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-[#F2F2F2] transition-colors duration-300 py-2 font-medium text-left"
                >
                  Logout
                </button>
                <Link
                  to="/register"
                  className="bg-white text-[#006699] px-4 py-2 rounded-md font-semibold hover:bg-[#F2F2F2] transition-all duration-300 inline-block w-max"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-[#F2F2F2] transition-colors duration-300 py-2 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-[#006699] px-4 py-2 rounded-md font-semibold hover:bg-[#F2F2F2] transition-all duration-300 inline-block w-max"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="pt-28 pb-16 md:pt-40 md:pb-20 bg-gradient-to-br from-[#006699] to-[#004466]"
      >
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <motion.div
            className="md:w-1/2 text-white mb-10 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Advancing Technology for Humanity
            </h1>
            <p className="text-lg mb-8 opacity-90">
              Join the world's largest technical professional organization
              dedicated to advancing technology.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#events"
                className="bg-white text-[#006699] px-6 py-3 rounded-md font-semibold hover:bg-[#F2F2F2] transition-all duration-300 shadow-lg"
              >
                Explore Events
              </a>
              {isLoggedIn ? (
                <Link
                  to="/profile"
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-[#006699] transition-all duration-300 shadow-lg"
                >
                  My Profile
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-[#006699] transition-all duration-300 shadow-lg"
                >
                  Become a Member
                </Link>
              )}
            </div>
          </motion.div>
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src="https://brand-experience.ieee.org/wp-content/uploads/2023/04/Tag_Advancing_Technology_reverse_4c-1024x554.png"
              alt="IEEE Advancing Technology"
              className="w-full rounded-lg shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      <main className="flex-grow">
        {/* Quick Access Shortcuts */}
        {isLoggedIn && (
          <motion.section
            className="py-8 bg-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-[#006699] mb-6">
                Quick Access
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  to="/profile"
                  className="bg-[#F2F2F2] hover:bg-[#E6E6E6] p-6 rounded-lg shadow-md text-center transition-all duration-300 flex flex-col items-center"
                >
                  <svg
                    className="w-10 h-10 mb-2 text-[#006699]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="font-medium">My Profile</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-[#F2F2F2] hover:bg-[#E6E6E6] p-6 rounded-lg shadow-md text-center transition-all duration-300 flex flex-col items-center"
                >
                  <svg
                    className="w-10 h-10 mb-2 text-[#006699]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <span className="font-medium">Register for Event</span>
                </Link>
                <Link
                  to="/events"
                  className="bg-[#F2F2F2] hover:bg-[#E6E6E6] p-6 rounded-lg shadow-md text-center transition-all duration-300 flex flex-col items-center"
                >
                  <svg
                    className="w-10 h-10 mb-2 text-[#006699]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-medium">Browse Events</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-[#F2F2F2] hover:bg-[#E6E6E6] p-6 rounded-lg shadow-md text-center transition-all duration-300 flex flex-col items-center"
                >
                  <svg
                    className="w-10 h-10 mb-2 text-[#006699]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* About Section */}
        <motion.section
          id="about"
          className="py-16 bg-[#F2F2F2]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#006699] mb-4">
                About IEEE
              </h2>
              <div className="w-24 h-1 bg-[#006699] mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                variants={fadeIn}
              >
                <div className="text-[#006699] mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#006699] mb-2">
                  Publications
                </h3>
                <p className="text-gray-700">
                  IEEE publishes nearly a third of the world's technical
                  literature in electrical engineering, computer science, and
                  electronics.
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                variants={fadeIn}
              >
                <div className="text-[#006699] mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#006699] mb-2">
                  Membership
                </h3>
                <p className="text-gray-700">
                  IEEE membership connects you with a global community of over
                  400,000 technology and engineering professionals.
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                variants={fadeIn}
              >
                <div className="text-[#006699] mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#006699] mb-2">
                  Standards
                </h3>
                <p className="text-gray-700">
                  IEEE is a leading developer of international standards that
                  underpin modern telecommunications and technology.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Events Section */}
        <motion.section
          id="events"
          className="py-16 bg-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#006699] mb-4">
                Upcoming Events
              </h2>
              <div className="w-24 h-1 bg-[#006699] mx-auto mb-6"></div>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Join us at our upcoming events to network with professionals,
                learn about the latest technological advancements, and advance
                your career.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                className="bg-[#F2F2F2] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                variants={fadeIn}
              >
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Conference"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm text-[#006699] font-semibold mb-2">
                    May 15, 2023
                  </div>
                  <h3 className="text-xl font-bold text-[#006699] mb-2">
                    Annual Technology Conference
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Join us for a day of inspirational talks, workshops, and
                    networking opportunities.
                  </p>
                  <Link
                    to="/events/1"
                    className="inline-block bg-[#006699] text-white px-4 py-2 rounded-md font-medium hover:bg-[#00557A] transition-colors duration-300"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>

              <motion.div
                className="bg-[#F2F2F2] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                variants={fadeIn}
              >
                <img
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Workshop"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm text-[#006699] font-semibold mb-2">
                    June 22, 2023
                  </div>
                  <h3 className="text-xl font-bold text-[#006699] mb-2">
                    AI and Ethics Workshop
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Explore the ethical implications of artificial intelligence
                    in this interactive workshop.
                  </p>
                  <Link
                    to="/events/2"
                    className="inline-block bg-[#006699] text-white px-4 py-2 rounded-md font-medium hover:bg-[#00557A] transition-colors duration-300"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>

              <motion.div
                className="bg-[#F2F2F2] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                variants={fadeIn}
              >
                <img
                  src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Webinar"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm text-[#006699] font-semibold mb-2">
                    July 10, 2023
                  </div>
                  <h3 className="text-xl font-bold text-[#006699] mb-2">
                    Future of Engineering Webinar
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Learn about emerging trends and future directions in
                    engineering from industry experts.
                  </p>
                  <Link
                    to="/events/3"
                    className="inline-block bg-[#006699] text-white px-4 py-2 rounded-md font-medium hover:bg-[#00557A] transition-colors duration-300"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="text-center mt-10">
              <Link
                to="/events"
                className="inline-block border-2 border-[#006699] text-[#006699] px-6 py-3 rounded-md font-semibold hover:bg-[#006699] hover:text-white transition-all duration-300"
              >
                View All Events
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-[#006699] text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img
                src="https://brand-experience.ieee.org/wp-content/uploads/2019/01/mb-ieee-white.png"
                alt="IEEE Logo"
                className="h-12 mb-4"
              />
              <p className="text-sm opacity-80">
                IEEE is the world's largest technical professional organization
                dedicated to advancing technology for the benefit of humanity.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#home"
                    className="opacity-80 hover:opacity-100 transition-opacity duration-300"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="opacity-80 hover:opacity-100 transition-opacity duration-300"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#events"
                    className="opacity-80 hover:opacity-100 transition-opacity duration-300"
                  >
                    Events
                  </a>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="opacity-80 hover:opacity-100 transition-opacity duration-300"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="opacity-80 hover:opacity-100 transition-opacity duration-300"
                  >
                    Publications
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="opacity-80 hover:opacity-100 transition-opacity duration-300"
                  >
                    Standards
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="opacity-80 hover:opacity-100 transition-opacity duration-300"
                  >
                    Education
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="opacity-80 hover:opacity-100 transition-opacity duration-300"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4 mb-4">
                <a
                  href="#"
                  className="text-white hover:text-[#F2F2F2] transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-[#F2F2F2] transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-[#F2F2F2] transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                </a>
              </div>
              <p className="text-sm opacity-80">
                Subscribe to our newsletter for updates
              </p>
              <div className="mt-2 flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 text-sm text-gray-700 bg-white rounded-l-md focus:outline-none"
                />
                <button className="bg-white text-[#006699] px-3 py-2 text-sm font-medium rounded-r-md hover:bg-[#F2F2F2] transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-400 mt-8 pt-6 text-sm opacity-80 text-center">
            <p>&copy; {new Date().getFullYear()} IEEE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
