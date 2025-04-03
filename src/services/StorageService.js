// Service for local storage data management
class StorageService {
  constructor() {
    this.isInitialized = false;
  }

  // Initialize storage with sample data
  async init() {
    if (this.isInitialized) return;

    try {
      // Create sample events if none exist
      await this._createSampleEvents();
      this.isInitialized = true;
      console.log("Storage initialized successfully");
    } catch (error) {
      console.error("Initialization error:", error);
      throw error;
    }
  }

  // User CRUD operations
  async createUser(userData) {
    await this.init();
    const users = this._getUsers();
    console.log("Current users:", users);
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    this._saveUsers(users);
    console.log("New user created:", newUser);
    console.log("Updated users:", this._getUsers());
    return newUser;
  }

  async getUserByEmail(email) {
    await this.init();
    const users = this._getUsers();
    console.log("Looking for user with email:", email);
    console.log("Available users:", users);
    const user = users.find((user) => user.email === email) || null;
    console.log("Found user:", user);
    return user;
  }

  async updateUser(userId, userData) {
    await this.init();
    const users = this._getUsers();
    console.log("Updating user with ID:", userId);
    console.log("Current users:", users);
    const index = users.findIndex((user) => user.id === userId);
    if (index === -1) {
      console.log("User not found");
      return null;
    }

    users[index] = {
      ...users[index],
      ...userData,
      updatedAt: new Date().toISOString(),
    };
    this._saveUsers(users);
    console.log("Updated user:", users[index]);
    return users[index];
  }

  // Event operations
  async getEvents() {
    await this.init();
    return this._getEvents();
  }

  async getEventById(eventId) {
    await this.init();
    const events = this._getEvents();
    return events.find((event) => event.id === eventId) || null;
  }

  // Registration operations
  async createRegistration(registrationData) {
    await this.init();
    const registrations = this._getRegistrations();
    // Generate random ticket number and QR code
    const ticketNumber = `IEEE-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`;
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=IEEE-TICKET-${Date.now()}`;

    const newRegistration = {
      ...registrationData,
      id: Date.now().toString(),
      ticketNumber,
      qrCode,
      registrationDate: new Date().toISOString(),
    };

    registrations.push(newRegistration);
    this._saveRegistrations(registrations);
    return newRegistration;
  }

  async getRegistrationsByUserId(userId) {
    await this.init();
    const registrations = this._getRegistrations();
    return registrations.filter((reg) => reg.userId === userId);
  }

  async getRegistrationById(registrationId) {
    await this.init();
    const registrations = this._getRegistrations();
    return registrations.find((reg) => reg.id === registrationId) || null;
  }

  // Private helper methods for localStorage access
  _getUsers() {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  }

  _saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  _getEvents() {
    const events = localStorage.getItem("events");
    return events ? JSON.parse(events) : [];
  }

  _saveEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
  }

  _getRegistrations() {
    const registrations = localStorage.getItem("registrations");
    return registrations ? JSON.parse(registrations) : [];
  }

  _saveRegistrations(registrations) {
    localStorage.setItem("registrations", JSON.stringify(registrations));
  }

  // Create sample event data for demo
  async _createSampleEvents() {
    const events = this._getEvents();
    if (events.length === 0) {
      const sampleEvents = [
        {
          id: "1",
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
          id: "2",
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
          id: "3",
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
      this._saveEvents(sampleEvents);
    }
  }

  // Test storage connection
  async connectToStorage() {
    await this.init();
    return true;
  }
}

// Create and export a singleton instance
const storageService = new StorageService();
export default storageService;
