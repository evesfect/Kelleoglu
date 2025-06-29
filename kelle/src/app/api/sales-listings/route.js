// /app/api/sales-listings/route.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET(request) {
  try {
    // Query the sales_listings table with images
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
      GROUP BY sl.id, sl.title, sl.model_year, sl.description, sl.price, sl.mileage, sl.fuel_type, sl.created_at, sl.updated_at
      ORDER BY sl.created_at DESC
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

export async function POST(request) {
  try {
    const { title, model_year, description, price, mileage, fuel_type, images } = await request.json();
    
    // Start a transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert new sales listing
      const listingQuery = `
        INSERT INTO public.sales_listings (title, model_year, description, price, mileage, fuel_type)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, title, model_year, description, price, mileage, fuel_type, created_at, updated_at
      `;
      
      const listingResult = await client.query(listingQuery, [title, model_year, description, price, mileage, fuel_type]);
      const newListing = listingResult.rows[0];
      
      // Insert images if provided
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const imageQuery = `
            INSERT INTO public.sales_listing_images (sales_listing_id, image_url, is_main, sort_order)
            VALUES ($1, $2, $3, $4)
          `;
          await client.query(imageQuery, [newListing.id, image.image_url, i === 0, i]);
        }
      }
      
      await client.query('COMMIT');
      
      // Fetch the complete listing with images
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
      
      const completeResult = await client.query(completeListingQuery, [newListing.id]);
      
      return Response.json(completeResult.rows[0], { status: 201 });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Database error:', error);
    return Response.json(
      { error: 'Failed to create sales listing' }, 
      { status: 500 }
    );
  }
}