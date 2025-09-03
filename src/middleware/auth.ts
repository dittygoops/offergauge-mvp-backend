// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with the service role key for backend operations
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Custom Request type to add the `user` property
interface AuthenticatedRequest extends Request {
    user?: any;
}

export const authenticateUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res
            .status(401)
            .json({ error: 'Authorization header is missing.' });
    }

    const token = authHeader.split(' ')[1]; // Assuming the format is "Bearer <token>"

    if (!token) {
        return res
            .status(401)
            .json({ error: 'Token is missing from the Authorization header.' });
    }

    try {
        // Use Supabase's `getUser` to validate the JWT
        const {
            data: { user },
        } = await supabase.auth.getUser(token);

        if (!user) {
            return res.status(401).json({ error: 'Invalid or expired token.' });
        }

        req.user = user; // Attach the user object to the request
        next(); // Pass control to the next handler
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ error: 'Authentication failed.' });
    }
};
