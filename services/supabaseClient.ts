
import { createClient } from '@supabase/supabase-js'

// Ambil variabel lingkungan. Ganti dengan string kosong jika tidak ditemukan.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Buat pesan error jika variabel tidak diset.
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase URL and anon key are not set. " +
    "Please create a .env.local file in the root of your project and add your Supabase credentials:\n\n" +
    "REACT_APP_SUPABASE_URL=your_supabase_url\n" +
    "REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key\n"
  );
}

// Inisialisasi dan ekspor klien Supabase.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
