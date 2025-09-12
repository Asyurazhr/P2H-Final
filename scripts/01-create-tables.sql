-- Create database tables for P2H application

-- Users table (for drivers, admin, pengawas)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nik VARCHAR(50),
    role VARCHAR(20) NOT NULL CHECK (role IN ('driver', 'admin', 'pengawas')),
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle types
CREATE TABLE IF NOT EXISTS vehicle_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_number VARCHAR(50) NOT NULL,
    vehicle_type_id INTEGER REFERENCES vehicle_types(id),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'maintenance', 'unavailable')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inspection items
CREATE TABLE IF NOT EXISTS inspection_items (
    id SERIAL PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    item_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- P2H forms
CREATE TABLE IF NOT EXISTS p2h_forms (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES users(id),
    driver_nik VARCHAR(50),
    inspection_date DATE NOT NULL,
    shift VARCHAR(10) CHECK (shift IN ('siang', 'malam')),
    vehicle_id INTEGER REFERENCES vehicles(id),
    hm_km_awal INTEGER,
    pengawas_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- P2H inspection results
CREATE TABLE IF NOT EXISTS p2h_inspections (
    id SERIAL PRIMARY KEY,
    p2h_form_id INTEGER REFERENCES p2h_forms(id),
    inspection_item_id INTEGER REFERENCES inspection_items(id),
    condition VARCHAR(20) CHECK (condition IN ('baik', 'rusak')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
