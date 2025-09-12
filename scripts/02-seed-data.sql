-- Seed initial data

-- Insert vehicle types
INSERT INTO vehicle_types (name) VALUES 
('LV'),
('Ambulance'),
('Truk');

-- Insert vehicles
INSERT INTO vehicles (vehicle_number, vehicle_type_id) VALUES 
('LV-001', 1),
('LV-002', 1),
('AMB-001', 2),
('AMB-002', 2),
('TRK-001', 3),
('TRK-002', 3);

-- Insert users
INSERT INTO users (name, nik, role, username, password) VALUES 
('Admin User', 'ADM001', 'admin', 'admin', 'admin123'),
('Pengawas 1', 'PGW001', 'pengawas', 'pengawas1', 'pgw123'),
('Pengawas 2', 'PGW002', 'pengawas', 'pengawas2', 'pgw123'),
('Driver 1', 'DRV001', 'driver', NULL, NULL),
('Driver 2', 'DRV002', 'driver', NULL, NULL),
('Driver 3', 'DRV003', 'driver', NULL, NULL);

-- Insert inspection items - Category 1: Pemeriksaan Keling Unit / Diluar Kabin
INSERT INTO inspection_items (category, description, item_order) VALUES 
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan keadaan ban & bolt roda', 1),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kelengkapan bolt part', 2),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan keadaan kelistrikan alat & kendaraan', 3),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kelengkapan pelindung alat kendaraan', 4),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kondisi lampu & reflektor', 5),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kondisi seat belt', 6),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kondisi steering', 7),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kondisi engine', 8),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kebocoran radiator', 9),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kebocoran air atau engine', 10),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kelengkapan v-belt', 11),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kondisi rem', 12),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kecepatan v-belt', 13),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kelengkapan AC', 14),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kondisi brake system', 15),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kebocoran air', 16),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kebocoran bahan bakar', 17),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kondisi oli mesin', 18),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kondisi udara dalam kabin', 19),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan status indicator kontrol sistem', 20),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kondisi alat pengukur bahan bakar', 21),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kelengkapan indikator suhu mesin', 22),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kondisi lampu peringatan', 23),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kelengkapan alat pemadam kebakaran', 24),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kondisi lampu utama kendaraan', 25),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kondisi wiper', 26),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kondisi pelindung spare part', 27),
('Pemeriksaan Keling Unit / Diluar Kabin', 'Pemeriksaan kelengkapan alat komunikasi', 28);

-- Insert inspection items - Category 2: Pemeriksaan di dalam Kabin & engine hidup
INSERT INTO inspection_items (category, description, item_order) VALUES 
('Pemeriksaan di dalam Kabin & engine hidup', 'Pemeriksaan kelengkapan P3K', 1),
('Pemeriksaan di dalam Kabin & engine hidup', 'Test fungsi rem', 2),
('Pemeriksaan di dalam Kabin & engine hidup', 'Test fungsi air conditioner', 3),
('Pemeriksaan di dalam Kabin & engine hidup', 'Test fungsi indicator oli engine', 4),
('Pemeriksaan di dalam Kabin & engine hidup', 'Test fungsi indikator water temperature', 5),
('Pemeriksaan di dalam Kabin & engine hidup', 'Test fungsi indikator bahan bakar', 6),
('Pemeriksaan di dalam Kabin & engine hidup', 'Test fungsi indicator alarm', 7),
('Pemeriksaan di dalam Kabin & engine hidup', 'Test fungsi indicator lampu indikator', 8),
('Pemeriksaan di dalam Kabin & engine hidup', 'Test fungsi buzzer alarm', 9),
('Pemeriksaan di dalam Kabin & engine hidup', 'Pemeriksaan kondisi fire suppression', 10),
('Pemeriksaan di dalam Kabin & engine hidup', 'Pemeriksaan kondisi wiper', 11),
('Pemeriksaan di dalam Kabin & engine hidup', 'Pemeriksaan indikator kecepatan', 12),
('Pemeriksaan di dalam Kabin & engine hidup', 'Pemeriksaan indikator transmisi', 13),
('Pemeriksaan di dalam Kabin & engine hidup', 'Pemeriksaan indikator lampu dashboard', 14),
('Pemeriksaan di dalam Kabin & engine hidup', 'Pemeriksaan indikator AC', 15),
('Pemeriksaan di dalam Kabin & engine hidup', 'Pemeriksaan status emergency switch', 16),
('Pemeriksaan di dalam Kabin & engine hidup', 'Pemeriksaan kondisi switch starter', 17);
