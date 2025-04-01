# IEEE Task 1

## MongoDB Setup Instructions

1. Install MongoDB Community Edition:

   - Download from: https://www.mongodb.com/try/download/community
   - Choose the Windows x64 MSI installer
   - Run the installer and follow the installation steps

2. Start MongoDB:

   - Open MongoDB Compass (installed with MongoDB)
   - Connect using: `mongodb://localhost:27017`
   - The database `ieee_database` will be created automatically when the application runs

3. Run the Application:

   ```bash
   # Install dependencies
   npm install

   # Start the development server
   npm run dev
   ```

4. Database Structure:

   - Database Name: `ieee_database`
   - Collections:
     - `users`: User information
     - `registrations`: Event registrations
     - `events`: Event details

5. View Data:
   - Open MongoDB Compass
   - Connect to: `mongodb://localhost:27017`
   - Select the `ieee_database` database
   - Browse collections to view data

## Development

The application uses:

- React + Vite
- MongoDB with Mongoose
- TailwindCSS for styling
- Framer Motion for animations

## Environment Variables

Create a `.env` file in the root directory with:

```
VITE_MONGODB_URI=mongodb://localhost:27017/ieee_database
VITE_NODE_ENV=development
VITE_PORT=5000
```
