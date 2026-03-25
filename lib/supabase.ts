import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

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
  target_month: string | null
  employee?: Employee
  inviter?: Employee
}
