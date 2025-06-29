// /app/api/bookings/route.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function POST(request) {
  try {
    const { type, details, contact_name, contact_phonenumber, appointment_time } = await request.json();
    
    // Insert the booking into the database
    const query = `
      INSERT INTO public.bookings (type, details, contact_name, contact_phonenumber, appointment_time)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, type, details, contact_name, contact_phonenumber, appointment_time, created_at
    `;
    
    const result = await pool.query(query, [type, details, contact_name, contact_phonenumber, appointment_time]);
    
    // Return the created booking
    return Response.json(result.rows[0], { status: 201 });
    
  } catch (error) {
    console.error('Database error:', error);
    return Response.json(
      { error: 'Failed to create booking' }, 
      { status: 500 }
    );
  }
}