-- ==========================================
-- El Mahalla Textile Cluster - Supabase Schema
-- ==========================================

-- 1. Profiles Table (Extends Clerk User)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT CHECK (role IN ('factory_owner', 'worker', 'service_provider', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Factories Table
CREATE TABLE public.factories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    logo_url TEXT,
    qr_code_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Products Table (Digital Catalog & DPP)
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    factory_id UUID REFERENCES public.factories(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    price_indicative NUMERIC,
    image_urls TEXT[],
    dpp_hash TEXT, -- Digital Product Passport Hash
    qr_code_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Production Lines (Rentable)
CREATE TABLE public.production_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    factory_id UUID REFERENCES public.factories(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    machine_type TEXT,
    capacity_per_day NUMERIC,
    is_rentable BOOLEAN DEFAULT FALSE,
    rental_price_per_day NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Warehouses (Rentable)
CREATE TABLE public.warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    factory_id UUID REFERENCES public.factories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity_sqm NUMERIC NOT NULL,
    is_rentable BOOLEAN DEFAULT FALSE,
    rental_price_per_sqm NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 6. Waste Inventory (For Marketplace)
CREATE TABLE public.waste_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    factory_id UUID REFERENCES public.factories(id) ON DELETE CASCADE,
    material_type TEXT NOT NULL, -- e.g., Cotton, Polyester
    quantity_kg NUMERIC NOT NULL,
    price_per_kg NUMERIC,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 7. Service Providers Directory
CREATE TABLE public.service_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    service_category TEXT NOT NULL, -- e.g., Logistics, Dyeing, Marketing
    region TEXT NOT NULL, -- e.g., Egypt, Europe
    description TEXT,
    contact_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 8. Job Postings
CREATE TABLE public.job_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    factory_id UUID REFERENCES public.factories(id) ON DELETE CASCADE,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    requirements TEXT,
    salary_range TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 9. Job Applications
CREATE TABLE public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE,
    applicant_name TEXT NOT NULL,
    applicant_phone TEXT NOT NULL,
    resume_url TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 10. B2B Matchmaking (Tenders and Joint Ventures)
CREATE TABLE public.b2b_matchmaking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    factory_id UUID REFERENCES public.factories(id) ON DELETE CASCADE,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    request_type TEXT NOT NULL, -- e.g., 'joint_manufacturing', 'feeding_industry', 'export_order'
    description_ar TEXT,
    description_en TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Setup Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.factories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_matchmaking ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for development - users can read all, but only write their own)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public factories are viewable by everyone" ON public.factories FOR SELECT USING (true);
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public production lines are viewable by everyone" ON public.production_lines FOR SELECT USING (true);
CREATE POLICY "Public warehouses are viewable by everyone" ON public.warehouses FOR SELECT USING (true);
CREATE POLICY "Public waste inventory are viewable by everyone" ON public.waste_inventory FOR SELECT USING (true);
CREATE POLICY "Public service providers are viewable by everyone" ON public.service_providers FOR SELECT USING (true);
CREATE POLICY "Public job postings are viewable by everyone" ON public.job_postings FOR SELECT USING (true);
CREATE POLICY "Public job applications are viewable by everyone" ON public.job_applications FOR SELECT USING (true);
CREATE POLICY "Public b2b matchmaking viewable by everyone" ON public.b2b_matchmaking FOR SELECT USING (true);

