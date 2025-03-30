import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const Events = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  // Mock data for events
  const events = [
    {
      id: 1,
      title: "Annual Technology Conference",
      date: "May 15, 2023",
      location: "New York, NY",
      category: "conference",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      description:
        "Join us for a day of inspirational talks, workshops, and networking opportunities with industry leaders.",
    },
    {
      id: 2,
      title: "AI and Ethics Workshop",
      date: "June 22, 2023",
      location: "San Francisco, CA",
      category: "workshop",
      image:
        "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      description:
        "Explore the ethical implications of artificial intelligence in this interactive workshop led by experts.",
    },
    {
      id: 3,
      title: "Future of Engineering Webinar",
      date: "July 10, 2023",
      location: "Virtual",
      category: "webinar",
      image:
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      description:
        "Learn about emerging trends and future directions in engineering from industry experts.",
    },
    {
      id: 4,
      title: "Women in Technology Summit",
      date: "August 5, 2023",
      location: "Chicago, IL",
      category: "conference",
      image:
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
      description:
        "A conference focused on celebrating and supporting womens contributions to technology and engineering.",
    },
    {
      id: 5,
      title: "Robotics Workshop for Students",
      date: "September 12, 2023",
      location: "Boston, MA",
      category: "workshop",
      image:
        "https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      description:
        "Hands-on workshop introducing students to robotics concepts and programming.",
    },
    {
      id: 6,
      title: "Sustainable Energy Symposium",
      date: "October 8, 2023",
      location: "Seattle, WA",
      category: "conference",
      image:
        "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
      description:
        "A symposium focused on advances in sustainable energy technology and policy.",
    },
  ];

  const filteredEvents =
    filter === "all"
      ? events
      : events.filter((event) => event.category === filter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] pt-20 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#006699] mb-4">
            IEEE Events
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Discover upcoming IEEE events, conferences, workshops, and webinars.
            Connect with professionals and expand your knowledge.
          </p>
        </motion.div>

        <div className="flex mb-8">
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

        {/* Filter Controls */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === "all"
                  ? "bg-[#006699] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              } transition-colors duration-200`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilter("conference")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === "conference"
                  ? "bg-[#006699] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              } transition-colors duration-200`}
            >
              Conferences
            </button>
            <button
              onClick={() => setFilter("workshop")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === "workshop"
                  ? "bg-[#006699] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              } transition-colors duration-200`}
            >
              Workshops
            </button>
            <button
              onClick={() => setFilter("webinar")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === "webinar"
                  ? "bg-[#006699] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              } transition-colors duration-200`}
            >
              Webinars
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 right-0 bg-[#006699] text-white text-xs uppercase font-bold px-3 py-1 rounded-bl-lg">
                  {event.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-[#006699] font-semibold mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {event.date}
                </div>
                <h3 className="text-xl font-bold text-[#006699] mb-2">
                  {event.title}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {event.location}
                </div>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {event.description}
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    to={`/events/${event.id}`}
                    className="inline-block bg-[#006699] text-white px-4 py-2 rounded-md font-medium hover:bg-[#00557A] transition-colors duration-300"
                  >
                    Details
                  </Link>
                  <Link
                    to={`/register?event=${event.id}`}
                    className="inline-block text-[#006699] border border-[#006699] px-4 py-2 rounded-md font-medium hover:bg-[#006699] hover:text-white transition-colors duration-300"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400"
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
            <h3 className="mt-4 text-xl font-medium text-gray-700">
              No events found
            </h3>
            <p className="mt-2 text-gray-500">
              Try changing your filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
