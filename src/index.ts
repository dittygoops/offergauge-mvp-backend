import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Enable CORS for all origins, allowing your frontend to connect
// You might want to restrict this to your frontend's domain in production
const allowedOrigins = [
    'http://localhost:5173', // Your local React development server
    'https://offergauge-mvp-backend-git-stripe-dittygoops-projects.vercel.app' // Your Vercel domain
    // Add other production domains here as needed
  ];
  
  const options: cors.CorsOptions = {
    origin: allowedOrigins
  };
  
  app.use(cors(options));

// Use the imported router for all /api endpoints
app.use('/api', apiRoutes);

// A simple root route to confirm the server is running
app.get('/', (req, res) => {
    res.send(
        'Welcome to the Express API. Go to /api/<route> for the API endpoints.'
    );
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log('You can now make requests to the API endpoints.');
});
