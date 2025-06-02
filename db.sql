"/c/Program Files/PostgreSQL/16/bin/psql.exe" -U postgres
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
  'Toyota Corolla',
  2018,
  'Well-maintained, single owner, accident-free.',
  15000.00,
  45000,
  'Gasoline'
);

SELECT * FROM public.sales_listings;

