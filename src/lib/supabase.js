import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lwkphwwfarkgkcggydwg.supabase.co'
const supabaseKey = 'sb_publishable_AY8BvJNedslzaeu3ZhI4VQ_vRLF4xkF'

export const supabase = createClient(supabaseUrl, supabaseKey)
