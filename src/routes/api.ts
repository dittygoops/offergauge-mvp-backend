import express, { Request, Response } from 'express';
import { authenticateUser } from '../middleware/auth';

// Create an Express Router instance
const router = express.Router();

// Custom Request type to add the `user` property from the middleware
// This is necessary for TypeScript to understand req.user
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        // You can add other user properties here if needed
    };
}

/**
 * @route   POST /save
 * @desc    Saves a generic JSON object for an authenticated user.
 * @access  Private
 */
router.post(
    '/save',
    authenticateUser,
    async (req: AuthenticatedRequest, res: Response) => {
        try {
            // The user object is available on req.user thanks to the middleware.
            const userId = req.user?.id;
            const data = req.body;

            console.log(
                `Authenticated user ${userId} wants to save data:`,
                data
            );

            // This is where you would perform your database operation
            // For now, it's just a placeholder response
            res.status(200).json({
                message: 'Data saved for authenticated user.',
            });
        } catch (error) {
            console.error('Error in /save route:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
);

// /**
//  * @route   POST /save-deal
//  * @desc    Saves a deal to the 'deals' table for an authenticated user.
//  * @access  Private
//  */
// router.post('/save-deal', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
//   try {
//     // Get the authenticated user's ID from the request object
//     const userId = req.user?.id;

//     // Get the deal form data from the request body
//     const dealData = req.body;

//     // Combine the userId with the deal data to create the full record
//     const newDeal = {
//       user_id: userId, // This links the deal to the user
//       ...dealData,      // The rest of the fields from the form
//     };

//     // Use the `saveDeal` function from your supabase.ts file
//     const { data, error } = await saveDeal(newDeal);

//     if (error) {
//       console.error('Supabase insert error:', error.message);
//       return res.status(500).json({ error: 'Failed to save deal.' });
//     }

//     res.status(201).json({
//       message: 'Deal saved successfully!',
//       deal: data[0]
//     });

//   } catch (err) {
//     console.error('Server error:', err);
//     res.status(500).json({ error: 'Internal server error.' });
//   }
// });

export default router;
