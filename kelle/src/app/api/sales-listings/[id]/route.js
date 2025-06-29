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
    
    // Query the specific sales listing with images
    const query = `
      SELECT 
        sl.id,
        sl.title,
        sl.model_year,
        sl.description,
        sl.price,
        sl.mileage,
        sl.fuel_type,
        sl.created_at,
        sl.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', sli.id,
              'image_url', sli.image_url,
              'is_main', sli.is_main,
              'sort_order', sli.sort_order
            ) ORDER BY sli.sort_order, sli.created_at
          ) FILTER (WHERE sli.id IS NOT NULL), 
          '[]'::json
        ) as images
      FROM public.sales_listings sl
      LEFT JOIN public.sales_listing_images sli ON sl.id = sli.sales_listing_id
      WHERE sl.id = $1
      GROUP BY sl.id, sl.title, sl.model_year, sl.description, sl.price, sl.mileage, sl.fuel_type, sl.created_at, sl.updated_at
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
    const { title, model_year, description, price, mileage, fuel_type, images } = await request.json();
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update the sales listing
      const listingQuery = `
        UPDATE public.sales_listings 
        SET title = $1, model_year = $2, description = $3, price = $4, mileage = $5, fuel_type = $6, updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING id, title, model_year, description, price, mileage, fuel_type, created_at, updated_at
      `;
      
      const listingResult = await client.query(listingQuery, [title, model_year, description, price, mileage, fuel_type, id]);
      
      if (listingResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return Response.json(
          { error: 'Sales listing not found' }, 
          { status: 404 }
        );
      }
      
      // Update images if provided
      if (images) {
        // Delete existing images
        await client.query('DELETE FROM public.sales_listing_images WHERE sales_listing_id = $1', [id]);
        
        // Insert new images
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const imageQuery = `
            INSERT INTO public.sales_listing_images (sales_listing_id, image_url, is_main, sort_order)
            VALUES ($1, $2, $3, $4)
          `;
          await client.query(imageQuery, [id, image.image_url, image.is_main || i === 0, i]);
        }
      }
      
      await client.query('COMMIT');
      
      // Fetch the complete updated listing with images
      const completeListingQuery = `
        SELECT 
          sl.id,
          sl.title,
          sl.model_year,
          sl.description,
          sl.price,
          sl.mileage,
          sl.fuel_type,
          sl.created_at,
          sl.updated_at,
          COALESCE(
            json_agg(
              json_build_object(
                'id', sli.id,
                'image_url', sli.image_url,
                'is_main', sli.is_main,
                'sort_order', sli.sort_order
              ) ORDER BY sli.sort_order, sli.created_at
            ) FILTER (WHERE sli.id IS NOT NULL), 
            '[]'::json
          ) as images
        FROM public.sales_listings sl
        LEFT JOIN public.sales_listing_images sli ON sl.id = sli.sales_listing_id
        WHERE sl.id = $1
        GROUP BY sl.id, sl.title, sl.model_year, sl.description, sl.price, sl.mileage, sl.fuel_type, sl.created_at, sl.updated_at
      `;
      
      const completeResult = await client.query(completeListingQuery, [id]);
      
      return Response.json(completeResult.rows[0], { status: 200 });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
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
    
    // Delete the sales listing (images will be deleted automatically due to CASCADE)
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