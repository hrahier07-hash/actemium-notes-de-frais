import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Employee = {
  id: string
  nom: string
  prenom: string
  actif: boolean
  created_at: string
}

export type Meal = {
  id: string
  employee_id: string
  date: string
  type: 'paye' | 'invite'
  invited_by: string | null
  commentaire: string | null
  commentaire_color: string
  count_color: string
  created_at: string
}
