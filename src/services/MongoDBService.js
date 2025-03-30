// This service handles MongoDB operations
// Using real MongoDB connection instead of localStorage

import mongoose from "mongoose";

// Define schemas
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  isIEEEMember: Boolean,
  ieeeNumber: String,
  organization: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

const registrationSchema = new mongoose.Schema({
  userId: String,
  eventId: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  organization: String,
  membershipType: String,
  interests: [String],
  registrationDate: { type: Date, default: Date.now },
  ticketNumber: String,
  qrCode: String,
});

const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  location: String,
  category: String,
  image: String,
  description: String,
});

// Create models
let User, Registration, Event;
let isConnected = false;

class MongoDBService {
  constructor() {
    this.connectionString =
      import.meta.env.VITE_MONGODB_URI ||
      "mongodb://localhost:27017/ieee_database";
    this.isInitialized = false;
  }

  // Initialize MongoDB connection
  async init() {
    if (this.isInitialized) return;

    try {
      if (!isConnected) {
        await mongoose.connect(this.connectionString);
        isConnected = true;
        console.log("Connected to MongoDB");

        // Initialize models
        User = mongoose.models.User || mongoose.model("User", userSchema);
        Registration =
          mongoose.models.Registration ||
          mongoose.model("Registration", registrationSchema);
        Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

        this.isInitialized = true;

        // Check if we have any events, if not create sample events
        const eventCount = await Event.countDocuments();
        if (eventCount === 0) {
          await this._createSampleEvents();
        }
      }
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }

  // Generate ID
  _generateId() {
    return new mongoose.Types.ObjectId().toString();
  }

  // Create sample events
  async _createSampleEvents() {
    const sampleEvents = [
      {
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
        title: "Future of Engineering Webinar",
        date: "July 10, 2023",
        location: "Virtual",
        category: "webinar",
        image:
          "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description:
          "Learn about emerging trends and future directions in engineering from industry experts.",
      },
    ];

    await Event.insertMany(sampleEvents);
    console.log("Sample events created");
  }

  // User operations
  async createUser(userData) {
    await this.init();

    const user = new User({
      ...userData,
      createdAt: new Date(),
    });

    await user.save();
    return user.toObject();
  }

  async getUserByEmail(email) {
    await this.init();

    const user = await User.findOne({ email });
    return user ? user.toObject() : null;
  }

  async updateUser(userId, userData) {
    await this.init();

    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...userData,
        updatedAt: new Date(),
      },
      { new: true }
    );

    return user ? user.toObject() : null;
  }

  // Registration operations
  async createRegistration(registrationData) {
    await this.init();

    const ticketNumber = `IEEE-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`;
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=IEEE-TICKET-${this._generateId()}`;

    const registration = new Registration({
      ...registrationData,
      ticketNumber,
      qrCode,
      registrationDate: new Date(),
    });

    await registration.save();
    return registration.toObject();
  }

  async getRegistrationsByUserId(userId) {
    await this.init();

    const registrations = await Registration.find({ userId });
    return registrations.map((reg) => reg.toObject());
  }

  async getRegistrationById(registrationId) {
    await this.init();

    const registration = await Registration.findById(registrationId);
    return registration ? registration.toObject() : null;
  }

  // Event operations
  async getEvents() {
    await this.init();

    const events = await Event.find();
    return events.map((event) => event.toObject());
  }

  async getEventById(eventId) {
    await this.init();

    const event = await Event.findById(eventId);
    return event ? event.toObject() : null;
  }

  // Method to initialize MongoDB connection
  async connectToMongoDB() {
    await this.init();
    return isConnected;
  }
}

// Create and export a singleton instance
const mongoDBService = new MongoDBService();
export default mongoDBService;
