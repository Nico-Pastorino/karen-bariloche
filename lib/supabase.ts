import { createClient } from "@supabase/supabase-js"

// Verificar que las variables de entorno estén disponibles
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.warn("NEXT_PUBLIC_SUPABASE_URL no está configurada. La aplicación funcionará en modo offline.")
}

if (!supabaseAnonKey) {
  console.warn("NEXT_PUBLIC_SUPABASE_ANON_KEY no está configurada. La aplicación funcionará en modo offline.")
}

// Crear el cliente de Supabase solo si las variables están disponibles
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Función helper para verificar si Supabase está disponible
export const isSupabaseAvailable = () => {
  return supabase !== null
}

// Tipos para nuestras tablas
export type ProductRow = {
  id: number
  name: string
  description: string
  price: number
  price_ars: number | null
  category: string
  stock: number
  is_new: boolean
  is_on_sale: boolean
  original_price: number | null
  original_price_ars: number | null
  discount_percentage: number | null
  image: string | null
  created_at: string
  updated_at: string
}

export type ConfigRow = {
  id: number
  store_name: string
  store_description: string
  whatsapp_number: string
  dollar_rate_official: number
  dollar_rate_blue: number
  dollar_rate_margin: number
  show_featured_products: boolean
  show_financing_options: boolean
  show_sale_section: boolean
  financing_options: any
  last_dollar_update: string | null
  created_at: string
  updated_at: string
}