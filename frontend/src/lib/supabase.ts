import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  )
}

/**
 * Public Supabase client — uses the ANON key.
 * Safe to use in the browser. Only has access to what RLS policies allow
 * (public read on categories, sub_categories, products, product_images).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Types mirroring the DB schema ────────────────────────────────────────────

export type DbCategory = {
  id: string
  label: string
  tagline: string | null
  icon: string | null
  accent: string | null
  sort_order: number
  sub_categories?: DbSubCategory[]
}

export type DbSubCategory = {
  id: string
  category_id: string
  label: string
  icon: string | null
  description: string | null
  sort_order: number
  products?: DbProduct[]
}

export type DbProduct = {
  id: number
  sub_category_id: string
  name: string
  variety: string | null
  short_desc: string | null
  full_desc: string | null
  germination: string | null
  season: string | null
  maturity: string | null
  seed_rate: string | null
  sowing_instructions: string | null
  npk_ratio: string | null
  dosage: string | null
  application_method: string | null
  packaging_sizes: string[]
  suitable_crops: string[]
  tags: string[]
  key_benefits: string[]
  is_active: boolean
  sort_order: number
  // Attached by API / query helpers:
  image_url?: string | null
  image_alt?: string | null
  images?: DbProductImage[]
}

export type DbProductImage = {
  id: string
  product_id: number
  url: string
  storage_path: string | null
  alt_text: string | null
  is_primary: boolean
  sort_order: number
}

// ── Query helpers (client-side) ───────────────────────────────────────────────

/**
 * Fetch the full nested catalogue directly from Supabase.
 * Can be used in Server Components (SSR) or client components.
 */
export async function fetchCatalogue(): Promise<DbCategory[]> {
  const { data: categories, error: catErr } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  if (catErr) throw catErr
  if (!categories?.length) return []

  const catIds = categories.map((c) => c.id)

  const { data: subs, error: subErr } = await supabase
    .from('sub_categories')
    .select('*')
    .in('category_id', catIds)
    .order('sort_order')

  if (subErr) throw subErr

  const subIds = (subs ?? []).map((s) => s.id)

  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('*')
    .in('sub_category_id', subIds)
    .eq('is_active', true)
    .order('sort_order')

  if (prodErr) throw prodErr

  const prodIds = (products ?? []).map((p) => p.id)

  // Primary images
  let imgMap: Record<number, DbProductImage> = {}
  if (prodIds.length) {
    const { data: images } = await supabase
      .from('product_images')
      .select('product_id, url, alt_text')
      .in('product_id', prodIds)
      .eq('is_primary', true)

    for (const img of images ?? []) {
      imgMap[img.product_id] = img
    }
  }

  // Attach images → products
  const enrichedProducts = (products ?? []).map((p) => ({
    ...p,
    image_url: imgMap[p.id]?.url ?? null,
    image_alt: imgMap[p.id]?.alt_text ?? null,
  }))

  // Nest products → sub-categories → categories
  const prodBySub: Record<string, DbProduct[]> = {}
  for (const p of enrichedProducts) {
    ;(prodBySub[p.sub_category_id] ??= []).push(p)
  }

  const subByCat: Record<string, DbSubCategory[]> = {}
  for (const s of subs ?? []) {
    const enriched = { ...s, products: prodBySub[s.id] ?? [] }
    ;(subByCat[s.category_id] ??= []).push(enriched)
  }

  return categories.map((c) => ({
    ...c,
    sub_categories: subByCat[c.id] ?? [],
  }))
}

/**
 * Fetch a single product with all images.
 */
export async function fetchProduct(id: number): Promise<DbProduct | null> {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  if (!product) return null

  const { data: images } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', id)
    .order('sort_order')

  return { ...product, images: images ?? [] }
}
