-- Case Tadka Supabase SQL Setup Script

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    franchise TEXT NOT NULL DEFAULT 'Anime',
    theme TEXT NOT NULL DEFAULT 'anime',
    category TEXT NOT NULL DEFAULT 'case',
    tag TEXT NOT NULL DEFAULT 'Popular',
    price NUMERIC NOT NULL,
    original_price NUMERIC DEFAULT 999,
    rating NUMERIC DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 1,
    image TEXT NOT NULL,
    tilted_image TEXT,
    badge TEXT,
    formats TEXT NOT NULL DEFAULT 'Ultra Impact MagSafe,Tough Armor Dual-Layer,9H Tempered Glass Back',
    description TEXT DEFAULT '',
    supported_brands TEXT DEFAULT 'Apple iPhone,Samsung Galaxy,OnePlus,Google Pixel',
    drop_protection TEXT DEFAULT '12ft Drop Tested',
    is_custom BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    total NUMERIC NOT NULL,
    subtotal NUMERIC DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'CONFIRMED',
    payment_method TEXT NOT NULL DEFAULT 'UPI (Google Pay)',
    tracking_number TEXT,
    estimated_delivery TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT,
    product_name TEXT NOT NULL,
    format TEXT NOT NULL DEFAULT 'Ultra Impact MagSafe',
    phone_model TEXT,
    image TEXT,
    price NUMERIC NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1
);

-- 4. Create Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount NUMERIC NOT NULL,
    type TEXT NOT NULL DEFAULT 'percentage',
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Seed default coupons
INSERT INTO public.coupons (code, discount, type)
VALUES 
    ('TADKA10', 10, 'percentage'),
    ('TADKA20', 20, 'percentage'),
    ('DROP20', 20, 'percentage'),
    ('SHINRA50', 50, 'fixed')
ON CONFLICT (code) DO NOTHING;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies (Drop first to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert/update to products" ON public.products;
CREATE POLICY "Allow public insert/update to products" ON public.products FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read access to orders" ON public.orders;
CREATE POLICY "Allow public read access to orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert to orders" ON public.orders;
CREATE POLICY "Allow public insert to orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to orders" ON public.orders;
CREATE POLICY "Allow public update to orders" ON public.orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete to orders" ON public.orders;
CREATE POLICY "Allow public delete to orders" ON public.orders FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read access to order items" ON public.order_items;
CREATE POLICY "Allow public read access to order items" ON public.order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert to order items" ON public.order_items;
CREATE POLICY "Allow public insert to order items" ON public.order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access to coupons" ON public.coupons;
CREATE POLICY "Allow public read access to coupons" ON public.coupons FOR SELECT USING (true);
