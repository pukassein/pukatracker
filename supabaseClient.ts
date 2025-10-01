import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = 'https://ksubsviatxrqfjdgreca.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzdWJzdmlhdHhycWZqZGdyZWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNzU5NTEsImV4cCI6MjA3NDg1MTk1MX0.KhHGzeaHWJy31fiKtv2D2cOQYdxdyqQg_0lV1Udnj8U';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
