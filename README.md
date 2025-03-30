# IEEE Event Management Application

A React application for IEEE event registration and management.

## MongoDB Setup

This application uses MongoDB for data storage. The connection string is configured in the `.env` file:

```
VITE_MONGODB_URI=mongodb://localhost:27017/ieee_database
```

### Setting up MongoDB

1. **Install MongoDB**: Download and install MongoDB from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

2. **Start MongoDB**: Run MongoDB as a service or using the command line:

   ```
   mongod --dbpath /path/to/data/directory
   ```

3. **Configure Connection**: Update the `.env` file with your MongoDB connection string if needed:
   ```
   VITE_MONGODB_URI=mongodb://username:password@host:port/ieee_database
   ```

For production environments, use a hosted MongoDB instance such as MongoDB Atlas.

## Environment Variables

The application uses the following environment variables (with Vite prefix):

- `VITE_MONGODB_URI`: MongoDB connection string
- `VITE_NODE_ENV`: Environment (development, production)
- `VITE_PORT`: Server port number

Vite requires all environment variables to be prefixed with `VITE_` to be accessible in the client-side code.

## Using MongoDB in the Application

Currently, the application uses a mock MongoDB service with localStorage for demonstration. To implement the real MongoDB connection:

1. Install the required packages:

   ```
   npm install mongoose
   ```

2. Modify the `src/services/MongoDBService.js` file to use the actual MongoDB connection

## Development

1. Install dependencies:

   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```
