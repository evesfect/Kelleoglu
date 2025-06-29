// /app/api/sales-listings/[id]/route.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
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

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { title, model_year, description, price, mileage, fuel_type, image_url } = await request.json();
    
    // Update the sales listing
    const query = `
      UPDATE public.sales_listings 
      SET title = $1, model_year = $2, description = $3, price = $4, mileage = $5, fuel_type = $6, image_url = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING id, title, model_year, description, price, mileage, fuel_type, image_url, created_at, updated_at
    `;
    
    const result = await pool.query(query, [title, model_year, description, price, mileage, fuel_type, image_url, id]);
    
    if (result.rows.length === 0) {
      return Response.json(
        { error: 'Sales listing not found' }, 
        { status: 404 }
      );
    }
    
    // Return the updated listing
    return Response.json(result.rows[0], { status: 200 });
    
  } catch (error) {
    console.error('Database error:', error);
    return Response.json(
      { error: 'Failed to update sales listing' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Delete the sales listing
    const query = `
      DELETE FROM public.sales_listings 
      WHERE id = $1
      RETURNING id
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return Response.json(
        { error: 'Sales listing not found' }, 
        { status: 404 }
      );
    }
    
    return Response.json({ message: 'Sales listing deleted successfully' }, { status: 200 });
    
  } catch (error) {
    console.error('Database error:', error);
    return Response.json(
      { error: 'Failed to delete sales listing' }, 
      { status: 500 }
    );
  }
}