// /app/api/admin/bookings/route.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET(request) {
  try {
    // Query all bookings
    const query = `
      SELECT 
        id,
        type,
        details,
        contact_name,
        contact_phonenumber,
        appointment_time,
        created_at
      FROM public.bookings 
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);
    
    // Return the bookings data as JSON
    return Response.json(result.rows, { status: 200 });
    
  } catch (error) {
    console.error('Database error:', error);
    return Response.json(
      { error: 'Failed to fetch bookings' }, 
      { status: 500 }
    );
  }
}