import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const revalidate = 3600
export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()

  const { data: veterinarians, error } = await supabase
    .from('veterinarians')
    .select(`
      *,
      vet_clinics (
        id,
        name,
        city,
        emergency_services
      )
    `)
    .eq('is_available', true)
    .order('name')

  if (error) {
    console.error('Error fetching veterinarians:', error)
    return NextResponse.json({ error: 'Unable to load veterinarians right now.' }, { status: 500 })
  }

  return NextResponse.json(veterinarians ?? [], {
    headers: {
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=300',
    },
  })
}
