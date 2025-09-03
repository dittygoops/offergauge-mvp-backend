import { createClient } from '@supabase/supabase-js';
import { Deal } from '../types/Deal';

// Load Supabase URL and keys from environment variables
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Initialize and export a single Supabase client instance
// This client can then be imported and used throughout your application.
export const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

// Method signature for saving a deal to the database
export async function saveDeal(dealData: Omit<Deal, 'id'>) {
    // This will contain the logic to insert a new deal
    const { data, error } = await supabaseClient
        .from('deals')
        .insert([dealData])
        .select();
    return { data: data as Deal[] | null, error };
}

export async function getDealsByUserId(userId: string) {
    const { data, error } = await supabaseClient
        .from('deals')
        .select('id, business_name') // Select only the 'id' and 'business_name' columns
        .eq('user_id', userId);

    // The return type is now an array of objects with only id and business_name
    // We can type cast it to a more specific type if needed, but 'data' is sufficient
    return { data, error };
}

// Method signature for getting a single deal by its ID
export async function getDealByDealId(dealId: string) {
    // This will contain the logic to query a single deal
    const { data, error } = await supabaseClient
        .from('deals')
        .select('*')
        .eq('id', dealId)
        .single();
    return { data: data as Deal | null, error };
}
