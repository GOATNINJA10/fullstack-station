# Fullstack Station Project

This is a fullstack project for managing charging stations. The backend is deployed on Railway, and the frontend is deployed on Netlify.

## Project Overview

- Backend: Express.js server with REST API endpoints for authentication and charging station management.
- Frontend: React application using Vite, connecting to the backend API.
- Authentication: JWT-based authentication with protected routes.
- Deployment: Backend deployed on Railway, frontend deployed on Netlify.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase (for local development)
- Railway account (for backend deployment)
- Netlify account (for frontend deployment)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3001
VITE_SUPABASE_URL=your_supabase_connection_string
VITE_SUPABASE_ANON_KEY=supabase_secret_key
JWT_SECRET=your_jwt_secret
VITE_API_URL=your_railway_url
```

## Backend Setup and Deployment

### Local Development

1. Start Backendend server:

```bash
node index.js
```

The backend server will run on `http://localhost:3001`.

### Deployment on Railway

1. Push your backend code to a Git repository.
2. Create a new Web Service on Railway.
3. Connect your repository and set the build and start commands.
4. Set environment variables on Railway dashboard (PORT, SUPABASE_URI, JWT_SECRET).
5. Deploy the service.
6. Note the Railway URL (e.g., `https://fullstack-station.railway.app`).

## Frontend Setup and Deployment

### Local Development

1. Install dependencies in root:

```bash
npm install
```

2. Start the frontend development server:

```bash
npm run dev
```

3. Start both frontend and backend concurrently:

```bash
npm run dev:all
```

The frontend will run on `http://localhost:3000` (or another port).

### Deployment on Netlify

1. Push your frontend code to a Git repository.
2. Create a new site on Netlify and connect your repository.
3. Set the build command to:

```bash
npm run build 
```

4. Set the publish directory to:

```
dist
```

5. Set environment variable `VITE_API_URL` to your Railway backend URL with `/api` suffix, e.g.:

```
https://fullstack-station.railway.app/api
```

6. Deploy the site.

## Testing

- Test all frontend features: login, registration, station CRUD operations.
- Verify authentication tokens are handled correctly.
- Check network requests in browser dev tools for errors.
- Test backend API endpoints using tools like Postman or Curl.

## Additional Notes

- Ensure CORS is enabled on the backend to allow requests from the frontend domain.
- Update environment variables accordingly for different environments (development, production).
