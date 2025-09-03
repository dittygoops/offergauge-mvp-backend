import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import { authenticateUser } from './middleware/auth';

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// A simple GET route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express API!');
});

// This is a protected route.
app.post('/save', authenticateUser, (req: Request, res: Response) => {
    // At this point, the user is authenticated.
    // The user object is available on req.user thanks to the middleware.
    const userId = (req as any).user.id;
    const data = req.body;

    console.log(`Authenticated user ${userId} wants to save data:`, data);

    res.status(200).json({ message: 'Data saved for authenticated user.' });
});

// This is a public route and doesn't require authentication.
app.get('/public', (req: Request, res: Response) => {
    res.send('This is a public endpoint.');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
