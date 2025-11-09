import { createClient } from '@supabase/supabase-js';

// Configure these environment variables in Vercel dashboard for production deployment
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://zdteeaiznhxmbmftiunw.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkdGVlYWl6bmh4bWJtZnRpdW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzY0MjIsImV4cCI6MjA3ODA1MjQyMn0.9GKjRn2sslWFsHARE_XuRnFfC9UApe-WpwrBQ9kTdd4';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('WARNING: Supabase credentials not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabaseServer = createClient(
  supabaseUrl,
  supabaseAnonKey
);
