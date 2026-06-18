import express from 'express'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js' 


const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
const app = express()

async function requireClinician(req, res, next) {
    try {
        const token = (req.headers.authorization || '').replace('Bearer ','')
	if (!token) return res.status(401).json({ error: 'no token provided'})

	const { data, error } = await supabase.auth.getUser(token)
	if(error || !data) return res.status(401).json({ error: 'invalid token'})

	const result = await pool.query(
	    'select * from phi.clinician where auth_user_id = $1',
	    [data.user.id]
	)
	if (result.rows.length === 0) return res.status(403).json({ error: 'not a clinician'})

	req.clinician = result.rows[0]
	next()
    } catch (err) {
	console.error(err)
	res.status(500).json({ error: 'auth check failed' })
    }
}


app.get('/patients', requireClinician, async (req, res) => {
    try {
        const { rows } = await pool.query('select * from phi.patient')
	res.json(rows)
    } catch (err) {
	console.error(err)
	res.status(500).json({ error: 'database error'})
    }
})

app.listen(3000, () => console.log('server running at http://localhost:3000'))
