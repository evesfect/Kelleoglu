// /app/api/bookings/check/route.js
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
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!date) {
      return Response.json({ error: 'Date parameter is required' }, { status: 400 });
    }
    
    // Query bookings for the specific date
    const query = `
      SELECT EXTRACT(HOUR FROM appointment_time) as hour
      FROM public.bookings 
      WHERE DATE(appointment_time) = $1
      AND appointment_time IS NOT NULL
    `;
    
    const result = await pool.query(query, [date]);
    
    // Convert to array of occupied hours
    const occupiedHours = result.rows.map(row => parseInt(row.hour));
    
    return Response.json({ occupiedHours }, { status: 200 });
    
  } catch (error) {
    console.error('Database error:', error);
    return Response.json(
      { error: 'Failed to check bookings' }, 
      { status: 500 }
    );
  }
}