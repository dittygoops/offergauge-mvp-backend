import express, { Request, Response } from 'express';
import { authenticateUser } from '../middleware/auth';
import { Deal } from '../types/Deal';
import {
    saveDeal,
    getDealsByUserId,
    getDealByDealId,
    saveSurvey,
} from '../db/supabase';
import { Survey } from '../types/Survey';
import { createSubscriptionSession } from '../stripe/stripe';

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
    async (
        req: AuthenticatedRequest,
        res: Response
    ): Promise<void | Response> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res
                    .status(401)
                    .json({ error: 'User not authenticated.' });
            }

            // Map the validated form data to the Deal type for the database
            const dealData: Omit<Deal, 'id'> = {
                user_id: userId,
                business_name: req.body.businessName,
                asking_price: req.body.askingPrice,
                annual_revenue: req.body.annualRevenue,
                annual_net_income: req.body.annualNetIncome,
                ffe_included: req.body.ffeIncluded,
                inventory_included: req.body.inventoryIncluded,
                real_estate_included: req.body.realEstateIncluded,
                ffe_value: req.body.ffeValue,
                inventory_value: req.body.inventoryValue,
                purchasing_real_estate: req.body.purchasingRealEstate,
                real_estate_value: req.body.realEstateValue,
                annual_rent: req.body.annualRent,
                buyer_min_salary: req.body.buyerMinSalary,
                working_capital_requirement: req.body.workingCapitalRequirement,
                capex_maintanence: req.body.capexMaintenance,
                capex_new_investments: req.body.capexNewInvestments,
                due_to_seller_business: req.body.dueToSellerBusiness,
                due_to_seller_real_estate: req.body.dueToSellerRealEstate,
                total_due_to_seller: req.body.totalDueToSeller,
                total_cash_at_closing_to_seller:
                    req.body.totalCashAtClosingToSeller,
                seller_financing_paid_to_seller:
                    req.body.sellerFinancingPaidToSeller,
                working_capital_required: req.body.workingCapitalRequired,
                loan_closing_costs: req.body.loanClosingCosts,
                total_use_of_funds: req.body.totalUseOfFunds,
                buyer_cash: req.body.buyerCash,
                buyer_cash_percent: req.body.buyerCashPercent,
                seller_financing: req.body.sellerFinancing,
                seller_financing_percent: req.body.sellerFinancingPercent,
                term_loan: req.body.termLoan,
                loan_closing_costs_percent: req.body.loanClosingCostsPercent,
                loan_payments: req.body.loanPayments,
                equipment_assets: req.body.equipmentAssets,
                inventory: req.body.inventory,
                working_capital: req.body.workingCapital,
                loan_amount: req.body.loanAmount,
                loan_closing_cost: req.body.loanClosingCost,
                ebitda: req.body.ebitda,
                loan_term: req.body.loanTerm,
                interest_rate: req.body.interestRate,
            };

            const { data, error } = await saveDeal(dealData);

            if (error) {
                console.error('Supabase insert error:', error.message);
                return res.status(500).json({ error: 'Failed to save deal.' });
            }

            res.status(201).json({
                message: 'Deal saved successfully!',
                deal: data,
            });
        } catch (err) {
            console.error('Server error:', err);
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
);

/**
 * @route   GET /get-deals
 * @desc    Retrieves a list of deals (business name and ID) for an authenticated user.
 * @access  Private
 */
router.get(
    '/get-deals',
    authenticateUser,
    async (
        req: AuthenticatedRequest,
        res: Response
    ): Promise<void | Response> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res
                    .status(401)
                    .json({ error: 'User not authenticated.' });
            }

            const { data, error } = await getDealsByUserId(userId);

            if (error) {
                console.error('Supabase query error:', error.message);
                return res
                    .status(500)
                    .json({ error: 'Failed to retrieve deals.' });
            }

            res.status(200).json({ deals: data });
        } catch (err) {
            console.error('Server error:', err);
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
);

/**
 * @route   GET /get-deal/:dealId
 * @desc    Retrieves a single deal by its ID for an authenticated user.
 * @access  Private
 */
router.get(
    '/get-deal/:dealId',
    authenticateUser,
    async (
        req: AuthenticatedRequest,
        res: Response
    ): Promise<void | Response> => {
        try {
            const userId = req.user?.id;
            const { dealId } = req.params;

            if (!userId) {
                return res
                    .status(401)
                    .json({ error: 'User not authenticated.' });
            }

            if (!dealId) {
                return res.status(400).json({ error: 'Deal ID is required.' });
            }

            const { data, error } = await getDealByDealId(dealId);

            if (error) {
                console.error('Supabase query error:', error.message);
                return res
                    .status(500)
                    .json({ error: 'Failed to retrieve deal.' });
            }

            if (!data) {
                return res.status(404).json({ error: 'Deal not found.' });
            }

            // Optional: Add a check to ensure the user owns the deal
            if (data.user_id !== userId) {
                return res.status(403).json({ error: 'Unauthorized access.' });
            }

            res.status(200).json({ deal: data });
        } catch (err) {
            console.error('Server error:', err);
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
);

/**
 * @route   POST /save-survey
 * @desc    Saves a survey for an authenticated user.
 * @access  Private
 */
router.post(
    '/save-survey',
    authenticateUser,
    async (
        req: AuthenticatedRequest,
        res: Response
    ): Promise<void | Response> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res
                    .status(401)
                    .json({ error: 'User not authenticated.' });
            }

            // Map the validated form data to the Survey type for the database
            const surveyData: Omit<Survey, 'id'> = {
                user_id: userId,
                where: req.body.where,
                role: req.body.role,
                reason: req.body.reason,
            };

            const { data, error } = await saveSurvey(surveyData);

            if (error) {
                console.error('Supabase insert error:', error.message);
                return res
                    .status(500)
                    .json({ error: 'Failed to save survey.' });
            }

            res.status(201).json({
                message: 'Survey saved successfully!',
                survey: data,
            });
        } catch (err) {
            console.error('Server error:', err);
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
);

/**
 * @route POST /create-checkout-session
 * @desc    Creates a checkout session for an authenticated user.
 * @access  Private
 */
router.post(
    '/create-checkout-session',
    authenticateUser,
    async (
        req: AuthenticatedRequest,
        res: Response
    ): Promise<void | Response> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res
                    .status(401)
                    .json({ error: 'User not authenticated.' });
            }

            // Call the function to create the Stripe Checkout Session
            const sessionUrl = await createSubscriptionSession(userId);

            // Send the URL back to the frontend for redirection
            return res.status(200).json({ url: sessionUrl });
        } catch (error) {
            console.error('Error creating Stripe session:', error);
            // In a production app, you might send a more user-friendly error message
            return res
                .status(500)
                .json({ error: 'Failed to create Stripe Checkout Session.' });
        }
    }
);

export default router;
