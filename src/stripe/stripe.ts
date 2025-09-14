import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize the Stripe client with the secret key and API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-08-27.basil', // Use the latest API version
    typescript: true,
});

/**
 * Creates a Stripe Checkout Session for a one-year subscription.
 * @param userId - The user's ID from your Supabase database.
 * @returns The URL of the Stripe Checkout page.
 */
export async function createSubscriptionSession(
    userId: string
): Promise<string> {
    // This is the Price ID for your $25 yearly subscription, created in the Stripe Dashboard.
    const priceId = process.env.STRIPE_LICENSE_PRICE_ID as string;

    if (!priceId) {
        throw new Error('Stripe Price ID is not set in environment variables.');
    }

    const session = await stripe.checkout.sessions.create({
        // This is the key part for a subscription
        mode: 'subscription',

        // Pass the Price ID of the subscription
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],

        // This links the Stripe session to your Supabase user ID for later fulfillment
        metadata: {
            supabaseUserId: userId,
        },

        // URLs to redirect the user after payment
        success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    return session.url as string;
}
