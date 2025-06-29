// /app/api/bookings/check/route.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
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