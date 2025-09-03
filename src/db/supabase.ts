import { createClient } from '@supabase/supabase-js';

// Load Supabase URL and keys from environment variables
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Initialize and export a single Supabase client instance
// This client can then be imported and used throughout your application.
export const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

// Method signature for saving a deal to the database
export async function saveDeal(dealData: any) {
    // This will contain the logic to insert a new deal
    const { data, error } = await supabaseClient
        .from('deals')
        .insert([dealData])
        .select();
    return { data, error };
}

// Method signature for getting all deals for a specific user
export async function getDealsByUserId(userId: string) {
    // This will contain the logic to query deals based on a user_id
    const { data, error } = await supabaseClient
        .from('deals')
        .select('*')
        .eq('user_id', userId);
    return { data, error };
}

// Method signature for getting a single deal by its ID
export async function getDealByDealId(dealId: string) {
    // This will contain the logic to query a single deal
    const { data, error } = await supabaseClient
        .from('deals')
        .select('*')
        .eq('deal_id', dealId)
        .single();
    return { data, error };
}
