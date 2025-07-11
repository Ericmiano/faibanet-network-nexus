// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xlrnusgpkkohgbjmxfxc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhscm51c2dwa2tvaGdiam14ZnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NjYwMjksImV4cCI6MjA2NzU0MjAyOX0.d7KuhOvmvjMftYkPtafMMEycahm3nXZvPJGN0m4bkpU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});