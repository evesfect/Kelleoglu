// /app/api/sales-listings/route.js
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
    // Query the sales_listings table including image_url
    const query = `
      SELECT 
        id,
        title,
        model_year,
        description,
        price,
        mileage,
        fuel_type,
        image_url,
        created_at,
        updated_at
      FROM public.sales_listings 
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);
    
    // Return the data as JSON
    return Response.json(result.rows, { status: 200 });
    
  } catch (error) {
    console.error('Database error:', error);
    return Response.json(
      { error: 'Failed to fetch sales listings' }, 
      { status: 500 }
    );
  }
}