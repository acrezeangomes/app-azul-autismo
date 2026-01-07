import { createClient } from '@supabase/supabase-js'

// Obter variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Helper para verificar se o Supabase está configurado corretamente
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

// Criar cliente Supabase apenas se configurado
export const supabase = isSupabaseConfigured() && supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
        }
      }
      children: {
        Row: {
          id: string
          user_id: string
          name: string
          birth_date: string
          photo_url: string | null
          notes: string | null
          created_at: string
        }
      }
      medications: {
        Row: {
          id: string
          child_id: string
          name: string
          dosage: string
          frequency: string
          times: string[]
          notes: string | null
          active: boolean
          created_at: string
        }
      }
      documents: {
        Row: {
          id: string
          child_id: string
          type: 'receita' | 'exame' | 'resultado'
          title: string
          file_url: string
          date: string
          notes: string | null
          created_at: string
        }
      }
      appointments: {
        Row: {
          id: string
          child_id: string
          type: string
          title: string
          date: string
          time: string
          location: string | null
          notes: string | null
          reminder_sent: boolean
          created_at: string
        }
      }
    }
  }
}
