// /app/api/admin/bookings/route.js
import { Pool } from 'pg';

// Database connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
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