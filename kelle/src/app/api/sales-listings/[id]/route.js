// /app/api/sales-listings/[id]/route.js
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

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Query the specific sales listing
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
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return Response.json(
        { error: 'Sales listing not found' }, 
        { status: 404 }
      );
    }
    
    // Return the single listing
    return Response.json(result.rows[0], { status: 200 });
    
  } catch (error) {
    console.error('Database error:', error);
    return Response.json(
      { error: 'Failed to fetch sales listing' }, 
      { status: 500 }
    );
  }
}