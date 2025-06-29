// /app/api/cleaning-offerings/[id]/route.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, description } = await request.json();
    
    const query = `
      UPDATE public.cleaning_offerings 
      SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, name, description, created_at, updated_at
    `;
    
    const result = await pool.query(query, [name, description, id]);
    
    if (result.rows.length === 0) {
      return Response.json({ error: 'Cleaning offering not found' }, { status: 404 });
    }
    
    return Response.json(result.rows[0], { status: 200 });
    
  } catch (error) {
    console.error('Database error:', error);
    return Response.json(
      { error: 'Failed to update cleaning offering' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const query = 'DELETE FROM public.cleaning_offerings WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return Response.json({ error: 'Cleaning offering not found' }, { status: 404 });
    }
    
    return Response.json({ message: 'Cleaning offering deleted successfully' }, { status: 200 });
    
  } catch (error) {
    console.error('Database error:', error);
    return Response.json(
      { error: 'Failed to delete cleaning offering' }, 
      { status: 500 }
    );
  }
}