# Santa Cruz Archive

A photographic archive application for Santa Cruz building, featuring a React frontend and Express backend with Cloudflare Images integration for photo storage.

## Project Structure

- `/src`: React frontend application
- `/server`: Express backend API
- `/public`: Static assets 

## Features

- Browse photos by floor and room
- Submit photos for review
- Admin interface for approving or rejecting submissions
- Cloudflare Images integration for efficient, scalable image storage

## Tech Stack

- **Frontend**: React, TypeScript, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB (configured, but currently commented out)
- **Image Storage**: Cloudflare Images

## Setup and Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Torteous44/SantaCruz.git
   cd SantaCruz
   ```

2. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `/server` directory (see `.env.example`)
   - Add your Cloudflare credentials for Images API

4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm start`: Run the React frontend only
- `npm run server`: Run the Express backend only
- `npm run dev`: Run both frontend and backend concurrently
- `npm run build`: Build the React frontend for production

## API Endpoints

### Photos

- `POST /api/photos/upload`: Upload a new photo (pending approval)
- `GET /api/photos?status=approved`: Get all approved photos
- `GET /api/photos?floorId=:floorId`: Get photos for a specific floor

### Admin

- `GET /api/admin/photos/pending`: Get all pending photos
- `GET /api/admin/photos/stats`: Get statistics about photos
- `PUT /api/photos/:id/approve`: Approve a pending photo
- `PUT /api/photos/:id/reject`: Reject a pending photo

## Deployment

### Production Build

1. Create a production build of the React frontend:
   ```bash
   npm run build
   ```

2. Set up your environment variables for production:
   - Create a `.env` file in the server directory with production values
   - Ensure `NODE_ENV=production` is set

3. MongoDB Configuration:
   - For production, use a hosted MongoDB database (e.g., MongoDB Atlas)
   - Update the `MONGODB_URI` in your server's `.env` file

4. Cloudflare Configuration:
   - Set up your production Cloudflare account and API keys
   - Update the Cloudflare credentials in your server's `.env` file

### Deployment Options

#### Option 1: Traditional Hosting
1. Deploy the built React app to a static file host (Netlify, Vercel, etc.)
2. Deploy the Express backend to a Node.js hosting service (Heroku, DigitalOcean, etc.)
3. Configure CORS in the backend to allow requests from your frontend domain

#### Option 2: Single Server Deployment
1. Set up a server with Node.js installed
2. Copy both the build folder and server directory to your server
3. Configure your web server (Nginx/Apache) to serve the static files from the build folder
4. Set up a process manager like PM2 to run the Node.js backend

```
# Example PM2 startup command
pm2 start server/server.js --name "santa-cruz-api"
```

5. Set up SSL certificates using Let's Encrypt for HTTPS

### Post-Deployment Checklist

- [ ] Verify all environment variables are correctly set
- [ ] Ensure MongoDB connection is working
- [ ] Test Cloudflare image upload functionality
- [ ] Verify admin panel access and security
- [ ] Check that all frontend features are working correctly
- [ ] Set up monitoring and logging for the application

## Cloudflare Images Integration

The application uses Cloudflare Images for storing and serving photos:

1. Photos are uploaded to the server temporarily
2. The backend uploads the image to Cloudflare Images
3. The Cloudflare URL is stored in the database
4. Approved photos are served directly from Cloudflare's CDN

## Security Note

Remember to regenerate the Cloudflare API keys before deploying to production, as the current keys in the repository have been exposed.

# Santa Cruz Archive - Frontend

This is the frontend for the Santa Cruz Archive application. It's a React application that displays historical photographs of Santa Cruz.

## Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Configure the environment:
   - Copy `.env.example` to `.env.development.local` for local development
   - Set `REACT_APP_API_URL` to your backend API URL
4. Start the development server: `npm start`

## Environment Configuration

The application uses environment variables for configuration:

- `REACT_APP_API_URL`: URL of the backend API (e.g., `http://localhost:5001/api` or `https://api.example.com/api`)
- `REACT_APP_USE_MOCK_DATA`: Set to `true` to use mock data when no backend is available

## Building for Production

1. Update `.env.production` with your production backend URL
2. Run `npm run build`
3. Deploy the contents of the `build` directory to your web hosting service

## External Backend

This frontend expects an external backend service with the following endpoints:

- `GET /api/photos?status=approved`: Get approved photos
- `GET /api/healthcheck`: Check API health status

For more information on setting up the backend, refer to the backend repository documentation.

## Project Structure

- `src/`: Source code
  - `components/`: React components
  - `types/`: TypeScript type definitions
  - `utils/`: Utility functions
  - `styles/`: CSS styles
  - `App.tsx`: Main application component
- `public/`: Static assets
