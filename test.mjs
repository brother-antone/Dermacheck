/* import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_SERVICE_KEY
)

const { data, error } = await supabase.from('test_notes').select('*')
console.log(error ?? data)
*/ 

import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL})

const { rows } = await pool.query('select * from phi.patient')
console.log(rows)

await pool.end()
