"/c/Program Files/PostgreSQL/17/bin/psql.exe" -U postgres
\c mysite

CREATE TABLE public.sales_listings (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  model_year INT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2),
  mileage INT,
  fuel_type VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO public.sales_listings (
  title,
  model_year,
  description,
  price,
  mileage,
  fuel_type
) VALUES (
  'Toyota Hilux',
  204,
  'Good.',
  15000.00,
  45000,
  'Diesel'
);

INSERT INTO public.sales_listings (
  title,
  model_year,
  description,
  price,
  mileage,
  fuel_type
) VALUES (
  'Toyota Corolla',
  2018,
  'Good Condition.',
  15000.00,
  90000,
  'Gasoline'
);

UPDATE public.sales_listings 
SET image_url = 'https://i.ibb.co/KcHQcGnK/hilux.jpg'
WHERE title = 'Toyota Hilux';

CREATE TABLE public.bookings (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  details TEXT,
  contact_name TEXT,
  contact_phonenumber TEXT,
  appointment_time TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM public.sales_listings;

