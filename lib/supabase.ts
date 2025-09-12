import { createClient } from '@supabase/supabase-js';

// Ambil URL dan Anon Key dari environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Pastikan variabel environment sudah di-set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL atau Anon Key tidak ditemukan! Pastikan .env.local sudah benar.');
}

// Membuat instance Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cek koneksi dengan Supabase
const testConnection = async () => {
  const { data, error } = await supabase.from('users').select('*'); // Ganti dengan tabel yang sesuai
  if (error) {
    console.error('Error querying Supabase:', error);
  } else {
    console.log('Data from Supabase:', data);
  }
};

// Jalankan testConnection untuk memastikan Supabase dapat terhubung
testConnection();

// Database types (sesuaikan dengan struktur database Supabase Anda)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          password: string;
          role: 'driver' | 'pengawas' | 'admin';
          name: string | null;
          is_shared_account: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          password: string;
          role: 'driver' | 'pengawas' | 'admin';
          name?: string | null;
          is_shared_account?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password?: string;
          role?: 'driver' | 'pengawas' | 'admin';
          name?: string | null;
          is_shared_account?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      vehicles: {
        Row: {
          id: string;
          license_plate: string;
          type_id: string;
          driver_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          license_plate: string;
          type_id: string;
          driver_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          license_plate?: string;
          type_id?: string;
          driver_id?: string | null;
          created_at?: string;
        };
      };
      vehicle_types: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      inspection_items: {
        Row: {
          id: string;
          name: string;
          vehicle_type_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          vehicle_type_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          vehicle_type_id?: string;
          created_at?: string;
        };
      };
      p2h_forms: {
        Row: {
          id: string;
          driver_id: string;
          vehicle_id: string;
          pengawas_id: string | null;
          status: 'pending' | 'approved' | 'rejected';
          submitted_at: string;
          reviewed_at: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          driver_id: string;
          vehicle_id: string;
          pengawas_id?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          submitted_at?: string;
          reviewed_at?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          driver_id?: string;
          vehicle_id?: string;
          pengawas_id?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          submitted_at?: string;
          reviewed_at?: string | null;
          notes?: string | null;
        };
      };
      p2h_inspections: {
        Row: {
          id: string;
          form_id: string;
          inspection_item_id: string;
          status: 'ok' | 'not_ok';
          notes: string | null;
        };
        Insert: {
          id?: string;
          form_id: string;
          inspection_item_id: string;
          status: 'ok' | 'not_ok';
          notes?: string | null;
        };
        Update: {
          id?: string;
          form_id?: string;
          inspection_item_id?: string;
          status?: 'ok' | 'not_ok';
          notes?: string | null;
        };
      };
    };
  };
}
