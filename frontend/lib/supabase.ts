 import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type OceanRegion = {
  id: string
  name: string
  slug: string
  health_score: number
  primary_threat: string
  threat_description: string
  temperature_anomaly: number
  latitude: number
  longitude: number
  source: string
}