import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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