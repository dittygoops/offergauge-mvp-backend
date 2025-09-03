// src/index.ts
import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// A simple GET route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express API!');
});

// A simple POST route to handle form data
app.post('/save', (req: Request, res: Response) => {
    const data = req.body;
    console.log('Received data:', data);
    res.status(200).json({
        message: 'Data received successfully!',
        receivedData: data,
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
