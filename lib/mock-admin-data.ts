// lib/mock-admin-data.ts

interface User {
  id: number
  name: string
  nik: string
  role: string
  username?: string
  password?: string
}

interface VehicleType {
  id: number
  name: string
}

interface Vehicle {
  id: number
  vehicle_number: string
  vehicle_type_id: number
  vehicle_type?: string // Added for convenience in frontend
  status?: string // Added for admin dashboard
  has_p2h_today?: boolean // Added for admin dashboard
  last_p2h_date?: string | null // Added for admin dashboard
}

interface InspectionItem {
  id: number
  category: string
  description: string
  item_order: number
  danger_code?: string
}

interface P2HForm {
  id: number
  driver_id: number
  driver_name: string
  driver_nik: string
  inspection_date: string
  shift: string
  vehicle_type_id: number
  vehicle_id: number
  vehicle_number: string
  vehicle_type: string
  hm_km_awal: number
  pengawas_id: number
  pengawas_name: string
  status: string
  created_at: string
  has_issues?: boolean
}

interface P2HInspectionResult {
  id: number
  inspection_item: {
    category: string
    description: string
  }
  condition: string
  notes: string
}

// Mock Data Stores
export const mockUsers: User[] = [
  { id: 1, name: "Admin User", nik: "ADM001", role: "admin", username: "admin", password: "admin123" },
  { id: 2, name: "Pengawas 1", nik: "PGW001", role: "pengawas", username: "pengawas1", password: "pgw123" },
  { id: 3, name: "Pengawas 2", nik: "PGW002", role: "pengawas", username: "pengawas2", password: "pgw123" },
  { id: 4, name: "Driver 1", nik: "DRV001", role: "driver" },
  { id: 5, name: "Driver 2", nik: "DRV002", role: "driver" },
  { id: 6, name: "Driver 3", nik: "DRV003", role: "driver" },
  { id: 7, name: "Gunawan Saputra", nik: "DRV007", role: "driver" },
  { id: 8, name: "Hendra Setiawan", nik: "DRV008", role: "driver" },
]

export const mockVehicleTypes: VehicleType[] = [
  { id: 1, name: "LV" },
  { id: 2, name: "Ambulance" },
  { id: 3, name: "Truk" },
]

export const mockVehicles: Vehicle[] = [
  {
    id: 1,
    vehicle_number: "LV-001",
    vehicle_type_id: 1,
    vehicle_type: "LV",
    status: "available",
    has_p2h_today: true,
    last_p2h_date: "2024-01-15",
  },
  {
    id: 2,
    vehicle_number: "LV-002",
    vehicle_type_id: 1,
    vehicle_type: "LV",
    status: "available",
    has_p2h_today: false,
    last_p2h_date: null,
  },
  {
    id: 3,
    vehicle_number: "AMB-001",
    vehicle_type_id: 2,
    vehicle_type: "Ambulance",
    status: "available",
    has_p2h_today: true,
    last_p2h_date: "2024-01-15",
  },
  {
    id: 4,
    vehicle_number: "AMB-002",
    vehicle_type_id: 2,
    vehicle_type: "Ambulance",
    status: "maintenance",
    has_p2h_today: false,
    last_p2h_date: "2024-01-14",
  },
  {
    id: 5,
    vehicle_number: "TRK-001",
    vehicle_type_id: 3,
    vehicle_type: "Truk",
    status: "available",
    has_p2h_today: false,
    last_p2h_date: null,
  },
  {
    id: 6,
    vehicle_number: "TRK-002",
    vehicle_type_id: 3,
    vehicle_type: "Truk",
    status: "available",
    has_p2h_today: true,
    last_p2h_date: "2024-01-15",
  },
]

export const mockInspectionItems: InspectionItem[] = [
  // Category 1: Pemeriksaan Keling Unit / Diluar Kabin
  {
    id: 1,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan keadaan ban & bolt roda",
    item_order: 1,
    danger_code: "AA",
  },
  {
    id: 2,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kelengkapan bolt part",
    item_order: 2,
    danger_code: "A",
  },
  {
    id: 3,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan keadaan kelistrikan alat & kendaraan",
    item_order: 3,
    danger_code: "A",
  },
  {
    id: 4,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kelengkapan pelindung alat kendaraan",
    item_order: 4,
    danger_code: "B",
  },
  {
    id: 5,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kondisi lampu & reflektor",
    item_order: 5,
    danger_code: "A",
  },
  {
    id: 6,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kondisi seat belt",
    item_order: 6,
    danger_code: "AA",
  },
  {
    id: 7,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kondisi steering",
    item_order: 7,
    danger_code: "AA",
  },
  {
    id: 8,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kondisi engine",
    item_order: 8,
    danger_code: "AA",
  },
  {
    id: 9,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kebocoran radiator",
    item_order: 9,
    danger_code: "A",
  },
  {
    id: 10,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kebocoran air atau engine",
    item_order: 10,
    danger_code: "A",
  },
  {
    id: 11,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kelengkapan v-belt",
    item_order: 11,
    danger_code: "A",
  },
  {
    id: 12,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kondisi rem",
    item_order: 12,
    danger_code: "AA",
  },
  {
    id: 13,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kecepatan v-belt",
    item_order: 13,
    danger_code: "A",
  },
  {
    id: 14,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kelengkapan AC",
    item_order: 14,
    danger_code: "B",
  },
  {
    id: 15,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kondisi brake system",
    item_order: 15,
    danger_code: "AA",
  },
  {
    id: 16,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kebocoran air",
    item_order: 16,
    danger_code: "A",
  },
  {
    id: 17,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kebocoran bahan bakar",
    item_order: 17,
    danger_code: "AA",
  },
  {
    id: 18,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kondisi oli mesin",
    item_order: 18,
    danger_code: "A",
  },
  {
    id: 19,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kondisi udara dalam kabin",
    item_order: 19,
    danger_code: "B",
  },
  {
    id: 20,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan status indicator kontrol sistem",
    item_order: 20,
    danger_code: "A",
  },
  {
    id: 21,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kondisi alat pengukur bahan bakar",
    item_order: 21,
    danger_code: "A",
  },
  {
    id: 22,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kelengkapan indikator suhu mesin",
    item_order: 22,
    danger_code: "A",
  },
  {
    id: 23,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kondisi lampu peringatan",
    item_order: 23,
    danger_code: "A",
  },
  {
    id: 24,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kelengkapan alat pemadam kebakaran",
    item_order: 24,
    danger_code: "AA",
  },
  {
    id: 25,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kondisi lampu utama kendaraan",
    item_order: 25,
    danger_code: "A",
  },
  {
    id: 26,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kondisi wiper",
    item_order: 26,
    danger_code: "B",
  },
  {
    id: 27,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kondisi pelindung spare part",
    item_order: 27,
    danger_code: "B",
  },
  {
    id: 28,
    category: "Pemeriksaan Keling Unit / Diluar Kabin",
    description: "Pemeriksaan kelengkapan alat komunikasi",
    item_order: 28,
    danger_code: "A",
  },
  // Category 2: Pemeriksaan di dalam Kabin & engine hidup
  {
    id: 29,
    category: "Pemeriksaan di dalam Kabin & engine hidup",
    description: "Pemeriksaan kelengkapan P3K",
    item_order: 1,
    danger_code: "A",
  },
  {
    id: 30,
    category: "Pemeriksaan di dalam Kabin & engine hidup",
    description: "Test fungsi rem",
    item_order: 2,
    danger_code: "AA",
  },
  {
    id: 31,
    category: "Pemeriksaan di dalam Kabin & engine hidup",
    description: "Test fungsi air conditioner",
    item_order: 3,
    danger_code: "B",
  },
  {
    id: 32,
    category: "Pemeriksaan di dalam Kabin & engine hidup",
    description: "Test fungsi indicator oli engine",
    item_order: 4,
    danger_code: "A",
  },
  {
    id: 33,
    category: "Pemeriksaan di dalam Kabin & engine hidup",
    description: "Test fungsi indikator water temperature",
    item_order: 5,
    danger_code: "A",
  },
  {
    id: 34,
    category: "Pemeriksaan di dalam Kabin & engine hidup",
    description: "Test fungsi indikator bahan bakar",
    item_order: 6,
    danger_code: "A",
  },
  {
    id: 35,
    category: "Pemeriksaan di dalam Kabin & engine hidup",
    description: "Test fungsi indicator alarm",
    item_order: 7,
    danger_code: "A",
  },
  {
    id: 36,
    category: "Pemeriksaan di dalam Kabin & engine hidup",
    description: "Test fungsi indicator lampu indikator",
    item_order: 8,
    danger_code: "A",
  },
  {
    id: 37,
    category: "Pemeriksaan di dalam Kabin & engine hidup",
    description: "Test fungsi buzzer alarm",
    item_order: 9,
    danger_code: "A",
  },
  {
    id: 38,
    category: "Pemeriksaan di dalam Kabin & engine hidup",
    description: "Pemeriksaan kondisi fire suppression",
    item_order: 10,
    danger_code: "AA",
  },
  {
    id: 39,
    category: "Pemeriksaan di dalam Kabin & engine hidup",
    description: "Pemeriksaan kondisi wiper",
    item_order: 11,
    danger_code: "B",
  },
  {
    id: 40,
    category: "Pemeriksaan di dalam Kabin & engine hidup",
    description: "Pemeriksaan indikator kecepatan",
    item_order: 12,
    danger_code: "A",
  },
  {
    id: 41,
    category: "Pemeriksaan di dalam Kabin & engine hidup",
    description: "Pemeriksaan indikator transmisi",
    item_order: 13,
    danger_code: "A",
  },
  {
    id: 42,
    category: "Pemeriksaan di dalam Kabin & engine hidup",
    description: "Pemeriksaan indikator lampu dashboard",
    item_order: 14,
    danger_code: "B",
  },
  {
    id: 43,
    category: "Pemeriksaan di dalam Kabin & engine hidup",
    description: "Pemeriksaan indikator AC",
    item_order: 15,
    danger_code: "B",
  },
  {
    id: 44,
    category: "Pemeriksaan di dalam Kabin & engine hidup",
    description: "Pemeriksaan status emergency switch",
    item_order: 16,
    danger_code: "AA",
  },
  {
    id: 45,
    category: "Pemeriksaan di dalam Kabin & engine hidup",
    description: "Pemeriksaan kondisi switch starter",
    item_order: 17,
    danger_code: "A",
  },
]

export const mockP2HForms: P2HForm[] = [
  {
    id: 1,
    driver_id: 4,
    driver_name: "Driver 1",
    driver_nik: "DRV001",
    inspection_date: "2024-01-15",
    shift: "siang",
    vehicle_type_id: 1,
    vehicle_id: 1,
    vehicle_number: "LV-001",
    vehicle_type: "LV",
    hm_km_awal: 12500,
    pengawas_id: 2,
    pengawas_name: "Pengawas 1",
    status: "approved",
    created_at: "2024-01-15T08:30:00Z",
    has_issues: true,
  },
  {
    id: 2,
    driver_id: 4,
    driver_name: "Driver 1",
    driver_nik: "DRV001",
    inspection_date: "2024-01-16",
    shift: "malam",
    vehicle_type_id: 2,
    vehicle_id: 3,
    vehicle_number: "AMB-001",
    vehicle_type: "Ambulance",
    hm_km_awal: 5000,
    pengawas_id: 3,
    pengawas_name: "Pengawas 2",
    status: "pending",
    created_at: "2024-01-16T20:00:00Z",
    has_issues: false,
  },
  {
    id: 3,
    driver_id: 5,
    driver_name: "Driver 2",
    driver_nik: "DRV002",
    inspection_date: "2024-01-15",
    shift: "siang",
    vehicle_type_id: 3,
    vehicle_id: 5,
    vehicle_number: "TRK-001",
    vehicle_type: "Truk",
    hm_km_awal: 20000,
    pengawas_id: 2,
    pengawas_name: "Pengawas 1",
    status: "rejected",
    created_at: "2024-01-15T10:00:00Z",
    has_issues: true,
  },
  {
    id: 4,
    driver_id: 4,
    driver_name: "Driver 1",
    driver_nik: "DRV001",
    inspection_date: "2024-01-17",
    shift: "siang",
    vehicle_type_id: 1,
    vehicle_id: 2,
    vehicle_number: "LV-002",
    vehicle_type: "LV",
    hm_km_awal: 10000,
    pengawas_id: 2,
    pengawas_name: "Pengawas 1",
    status: "pending",
    created_at: "2024-01-17T09:00:00Z",
    has_issues: false,
  },
  {
    id: 5,
    driver_id: 7,
    driver_name: "Gunawan Saputra",
    driver_nik: "DRV007",
    inspection_date: "2024-01-17",
    shift: "malam",
    vehicle_type_id: 2,
    vehicle_id: 4,
    vehicle_number: "AMB-002",
    vehicle_type: "Ambulance",
    hm_km_awal: 7500,
    pengawas_id: 3,
    pengawas_name: "Pengawas 2",
    status: "approved",
    created_at: "2024-01-17T21:00:00Z",
    has_issues: true,
  },
]

export const mockP2HInspectionDetails: P2HInspectionResult[] = [
  {
    id: 1,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan keadaan ban & bolt roda",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 2,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kelengkapan bolt part",
    },
    condition: "rusak",
    notes: "Bolt kendor, perlu dikencangkan",
  },
  {
    id: 3,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan keadaan kelistrikan alat & kendaraan",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 4,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kelengkapan pelindung alat kendaraan",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 5,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kondisi lampu & reflektor",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 6,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kondisi seat belt",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 7,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kondisi steering",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 8,
    p2h_form_id: 1,
    inspection_item: { category: "Pemeriksaan Keling Unit / Diluar Kabin", description: "Pemeriksaan kondisi engine" },
    condition: "baik",
    notes: "",
  },
  {
    id: 9,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kebocoran radiator",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 10,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kebocoran air atau engine",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 11,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kelengkapan v-belt",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 12,
    p2h_form_id: 1,
    inspection_item: { category: "Pemeriksaan Keling Unit / Diluar Kabin", description: "Pemeriksaan kondisi rem" },
    condition: "rusak",
    notes: "Rem depan perlu diganti, sudah aus",
  },
  {
    id: 13,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kecepatan v-belt",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 14,
    p2h_form_id: 1,
    inspection_item: { category: "Pemeriksaan Keling Unit / Diluar Kabin", description: "Pemeriksaan kelengkapan AC" },
    condition: "baik",
    notes: "",
  },
  {
    id: 15,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kondisi brake system",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 16,
    p2h_form_id: 1,
    inspection_item: { category: "Pemeriksaan Keling Unit / Diluar Kabin", description: "Pemeriksaan kebocoran air" },
    condition: "baik",
    notes: "",
  },
  {
    id: 17,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kebocoran bahan bakar",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 18,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kondisi oli mesin",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 19,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kondisi udara dalam kabin",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 20,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan status indicator kontrol sistem",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 21,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kondisi alat pengukur bahan bakar",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 22,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kelengkapan indikator suhu mesin",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 23,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kondisi lampu peringatan",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 24,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kelengkapan alat pemadam kebakaran",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 25,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kondisi lampu utama kendaraan",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 26,
    p2h_form_id: 1,
    inspection_item: { category: "Pemeriksaan Keling Unit / Diluar Kabin", description: "Pemeriksaan kondisi wiper" },
    condition: "baik",
    notes: "",
  },
  {
    id: 27,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kondisi pelindung spare part",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 28,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan Keling Unit / Diluar Kabin",
      description: "Pemeriksaan kelengkapan alat komunikasi",
    },
    condition: "baik",
    notes: "",
  },
  // Category 2: Pemeriksaan di dalam Kabin & engine hidup
  {
    id: 29,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan di dalam Kabin & engine hidup",
      description: "Pemeriksaan kelengkapan P3K",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 30,
    p2h_form_id: 1,
    inspection_item: { category: "Pemeriksaan di dalam Kabin & engine hidup", description: "Test fungsi rem" },
    condition: "baik",
    notes: "",
  },
  {
    id: 31,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan di dalam Kabin & engine hidup",
      description: "Test fungsi air conditioner",
    },
    condition: "rusak",
    notes: "AC tidak dingin, perlu service",
  },
  {
    id: 32,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan di dalam Kabin & engine hidup",
      description: "Test fungsi indicator oli engine",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 33,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan di dalam Kabin & engine hidup",
      description: "Test fungsi indikator water temperature",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 34,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan di dalam Kabin & engine hidup",
      description: "Test fungsi indikator bahan bakar",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 35,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan di dalam Kabin & engine hidup",
      description: "Test fungsi indicator alarm",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 36,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan di dalam Kabin & engine hidup",
      description: "Test fungsi indicator lampu indikator",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 37,
    p2h_form_id: 1,
    inspection_item: { category: "Pemeriksaan di dalam Kabin & engine hidup", description: "Test fungsi buzzer alarm" },
    condition: "baik",
    notes: "",
  },
  {
    id: 38,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan di dalam Kabin & engine hidup",
      description: "Pemeriksaan kondisi fire suppression",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 39,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan di dalam Kabin & engine hidup",
      description: "Pemeriksaan kondisi wiper",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 40,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan di dalam Kabin & engine hidup",
      description: "Pemeriksaan indikator kecepatan",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 41,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan di dalam Kabin & engine hidup",
      description: "Pemeriksaan indikator transmisi",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 42,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan di dalam Kabin & engine hidup",
      description: "Pemeriksaan indikator lampu dashboard",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 43,
    p2h_form_id: 1,
    inspection_item: { category: "Pemeriksaan di dalam Kabin & engine hidup", description: "Pemeriksaan indikator AC" },
    condition: "baik",
    notes: "",
  },
  {
    id: 44,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan di dalam Kabin & engine hidup",
      description: "Pemeriksaan status emergency switch",
    },
    condition: "baik",
    notes: "",
  },
  {
    id: 45,
    p2h_form_id: 1,
    inspection_item: {
      category: "Pemeriksaan di dalam Kabin & engine hidup",
      description: "Pemeriksaan kondisi switch starter",
    },
    condition: "baik",
    notes: "",
  },
]

// Helper to get next ID for new items
let nextUserId = Math.max(...mockUsers.map((u) => u.id)) + 1
let nextVehicleTypeId = Math.max(...mockVehicleTypes.map((vt) => vt.id)) + 1
let nextVehicleId = Math.max(...mockVehicles.map((v) => v.id)) + 1
let nextInspectionItemId = Math.max(...mockInspectionItems.map((i) => i.id)) + 1
let nextP2HFormId = Math.max(...mockP2HForms.map((f) => f.id)) + 1
let nextP2HInspectionDetailId = Math.max(...mockP2HInspectionDetails.map((i) => i.id)) + 1

export const getNextUserId = () => nextUserId++
export const getNextVehicleTypeId = () => nextVehicleTypeId++
export const getNextVehicleId = () => nextVehicleId++
export const getNextInspectionItemId = () => nextInspectionItemId++
export const getNextP2HFormId = () => nextP2HFormId++
export const getNextP2HInspectionDetailId = () => nextP2HInspectionDetailId++
