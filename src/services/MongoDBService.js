// Local Storage Service
import storageService from "./StorageService";

// Service for handling data operations via Storage Service
class DataService {
  constructor() {
    this.isInitialized = false;
  }

  // Initialize storage connection
  async init() {
    if (this.isInitialized) return;

    try {
      await storageService.init();
      this.isInitialized = true;
    } catch (error) {
      console.error("Initialization error:", error);
      throw error;
    }
  }

  // User operations
  async createUser(userData) {
    await this.init();
    return storageService.createUser(userData);
  }

  async getUserByEmail(email) {
    await this.init();
    return storageService.getUserByEmail(email);
  }

  async updateUser(userId, userData) {
    await this.init();
    return storageService.updateUser(userId, userData);
  }

  // Event operations
  async getEvents() {
    await this.init();
    return storageService.getEvents();
  }

  async getEventById(eventId) {
    await this.init();
    return storageService.getEventById(eventId);
  }

  // Registration operations
  async createRegistration(registrationData) {
    await this.init();
    return storageService.createRegistration(registrationData);
  }

  async getRegistrationsByUserId(userId) {
    await this.init();
    return storageService.getRegistrationsByUserId(userId);
  }

  async getRegistrationById(registrationId) {
    await this.init();
    return storageService.getRegistrationById(registrationId);
  }

  // Test connection to storage
  async connectToStorage() {
    await this.init();
    return true;
  }
}

// Create and export a singleton instance
const dataService = new DataService();
export default dataService;
