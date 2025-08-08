import { createClient } from '@supabase/supabase-js';

if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('Missing env.VITE_SUPABASE_URL');
}
if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export type Database = {
  public: {
    Tables: {
      palettes: {
        Row: {
          id: string;
          name: string;
          colors: string[];
          created_at: string;
          updated_at: string;
          user_id: string | null;
          is_public: boolean;
          tags: string[] | null;
        };
        Insert: {
          id?: string;
          name: string;
          colors: string[];
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
          is_public?: boolean;
          tags?: string[] | null;
        };
        Update: {
          id?: string;
          name?: string;
          colors?: string[];
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
          is_public?: boolean;
          tags?: string[] | null;
        };
      };
    };
  };
};