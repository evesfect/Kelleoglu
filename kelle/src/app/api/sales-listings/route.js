// /app/api/sales-listings/route.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET(request) {
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20));
  
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
    console.error('Full error details:', error);
    return Response.json(
      { error: 'Database connection failed', details: error.message }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { title, model_year, description, price, mileage, fuel_type, image_url } = await request.json();
    
    // Insert new sales listing
    const query = `
      INSERT INTO public.sales_listings (title, model_year, description, price, mileage, fuel_type, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, title, model_year, description, price, mileage, fuel_type, image_url, created_at, updated_at
    `;
    
    const result = await pool.query(query, [title, model_year, description, price, mileage, fuel_type, image_url]);
    
    // Return the created listing
    return Response.json(result.rows[0], { status: 201 });
    
  } catch (error) {
    console.error('Database error:', error);
    return Response.json(
      { error: 'Failed to create sales listing' }, 
      { status: 500 }
    );
  }
}