// /app/api/cleaning-offerings/route.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET(request) {
  try {
    const query = `
      SELECT 
        id,
        name,
        description,
        created_at,
        updated_at
      FROM public.cleaning_offerings 
      ORDER BY created_at ASC
    `;
    
    const result = await pool.query(query);
    return Response.json(result.rows, { status: 200 });
    
  } catch (error) {
    console.error('Database error:', error);
    return Response.json(
      { error: 'Failed to fetch cleaning offerings' }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, description } = await request.json();
    
    const query = `
      INSERT INTO public.cleaning_offerings (name, description)
      VALUES ($1, $2)
      RETURNING id, name, description, created_at, updated_at
    `;
    
    const result = await pool.query(query, [name, description]);
    return Response.json(result.rows[0], { status: 201 });
    
  } catch (error) {
    console.error('Database error:', error);
    return Response.json(
      { error: 'Failed to create cleaning offering' }, 
      { status: 500 }
    );
  }
}