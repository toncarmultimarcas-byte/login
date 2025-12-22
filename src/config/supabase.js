import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://osofymauklsxrsphojjm.supabase.co';
const supabaseAnonKey = 'sb_publishable_N-IapnaxpweqdBQFqNLMkg_ukxPspvo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
