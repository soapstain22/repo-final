import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://siwurrbfdgttqingwfal.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpd3VycmJmZGd0dHFpbmd3ZmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NDA3MzAsImV4cCI6MjA2MTQxNjczMH0.VngJzcNjwzrJrvZh88KBLSt7CFIrRjRyLe867R53Vmo";

export const supabase = createClient(supabaseUrl, supabaseKey);
