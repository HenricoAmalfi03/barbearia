import { createClient } from '@supabase/supabase-js';

// Configure these environment variables in Vercel dashboard for production deployment
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://drbqmjmsscqovtsqmszf.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyYnFtam1zc2Nxb3Z0c3Ftc3pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjcyNDUsImV4cCI6MjA3ODEwMzI0NX0.RLfT9b-5y2Q_yQD1oeq0y73seNZxz1WRFqJe8zm1n_A';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('WARNING: Supabase credentials not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabaseServer = createClient(
  supabaseUrl,
  supabaseAnonKey
);
