import { NextResponse } from "next/server"
import {
  mockP2HForms,
  mockP2HInspectionDetails,
  mockUsers,
  mockVehicles,
  mockVehicleTypes,
  mockInspectionItems,
} from "@/lib/mock-admin-data"

// Mock P2H detail data with complete form information
const mockP2HDetails = [
  {
    id: 1,
    driver_name: "Driver 1",
    driver_nik: "DRV001",
    vehicle_number: "LV-001",
    vehicle_type: "LV",
    inspection_date: "2024-01-15",
    shift: "siang",
    hm_km_awal: 12500,
    pengawas_name: "Pengawas 1",
    status: "pending",
    created_at: "2024-01-15T08:30:00Z",
    inspections: [
      // Complete list of all 45 inspection items
      {
        id: 1,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan keadaan ban & bolt roda",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 2,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kelengkapan bolt part",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 3,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan keadaan kelistrikan alat & kendaraan",
        },
        condition: "rusak",
        notes: "Lampu sein kiri tidak berfungsi",
      },
      {
        id: 4,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kelengkapan pelindung alat kendaraan",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 5,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kondisi lampu & reflektor",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 6,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kondisi seat belt",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 7,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kondisi steering",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 8,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kondisi engine",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 9,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kebocoran radiator",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 10,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kebocoran air atau engine",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 11,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kelengkapan v-belt",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 12,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kondisi rem",
        },
        condition: "rusak",
        notes: "Rem depan perlu diganti, sudah aus",
      },
      {
        id: 13,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kecepatan v-belt",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 14,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kelengkapan AC",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 15,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kondisi brake system",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 16,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kebocoran air",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 17,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kebocoran bahan bakar",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 18,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kondisi oli mesin",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 19,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kondisi udara dalam kabin",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 20,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan status indicator kontrol sistem",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 21,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kondisi alat pengukur bahan bakar",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 22,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kelengkapan indikator suhu mesin",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 23,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kondisi lampu peringatan",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 24,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kelengkapan alat pemadam kebakaran",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 25,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kondisi lampu utama kendaraan",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 26,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kondisi wiper",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 27,
        inspection_item: {
          category: "Pemeriksaan Keling Unit / Diluar Kabin",
          description: "Pemeriksaan kondisi pelindung spare part",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 28,
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
        inspection_item: {
          category: "Pemeriksaan di dalam Kabin & engine hidup",
          description: "Pemeriksaan kelengkapan P3K",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 30,
        inspection_item: {
          category: "Pemeriksaan di dalam Kabin & engine hidup",
          description: "Test fungsi rem",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 31,
        inspection_item: {
          category: "Pemeriksaan di dalam Kabin & engine hidup",
          description: "Test fungsi air conditioner",
        },
        condition: "rusak",
        notes: "AC tidak dingin, perlu service",
      },
      {
        id: 32,
        inspection_item: {
          category: "Pemeriksaan di dalam Kabin & engine hidup",
          description: "Test fungsi indicator oli engine",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 33,
        inspection_item: {
          category: "Pemeriksaan di dalam Kabin & engine hidup",
          description: "Test fungsi indikator water temperature",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 34,
        inspection_item: {
          category: "Pemeriksaan di dalam Kabin & engine hidup",
          description: "Test fungsi indikator bahan bakar",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 35,
        inspection_item: {
          category: "Pemeriksaan di dalam Kabin & engine hidup",
          description: "Test fungsi indicator alarm",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 36,
        inspection_item: {
          category: "Pemeriksaan di dalam Kabin & engine hidup",
          description: "Test fungsi indicator lampu indikator",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 37,
        inspection_item: {
          category: "Pemeriksaan di dalam Kabin & engine hidup",
          description: "Test fungsi buzzer alarm",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 38,
        inspection_item: {
          category: "Pemeriksaan di dalam Kabin & engine hidup",
          description: "Pemeriksaan kondisi fire suppression",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 39,
        inspection_item: {
          category: "Pemeriksaan di dalam Kabin & engine hidup",
          description: "Pemeriksaan kondisi wiper",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 40,
        inspection_item: {
          category: "Pemeriksaan di dalam Kabin & engine hidup",
          description: "Pemeriksaan indikator kecepatan",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 41,
        inspection_item: {
          category: "Pemeriksaan di dalam Kabin & engine hidup",
          description: "Pemeriksaan indikator transmisi",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 42,
        inspection_item: {
          category: "Pemeriksaan di dalam Kabin & engine hidup",
          description: "Pemeriksaan indikator lampu dashboard",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 43,
        inspection_item: {
          category: "Pemeriksaan di dalam Kabin & engine hidup",
          description: "Pemeriksaan indikator AC",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 44,
        inspection_item: {
          category: "Pemeriksaan di dalam Kabin & engine hidup",
          description: "Pemeriksaan status emergency switch",
        },
        condition: "baik",
        notes: "",
      },
      {
        id: 45,
        inspection_item: {
          category: "Pemeriksaan di dalam Kabin & engine hidup",
          description: "Pemeriksaan kondisi switch starter",
        },
        condition: "baik",
        notes: "",
      },
    ],
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const formId = Number.parseInt(params.id)
    const form = mockP2HForms.find((f) => f.id === formId)

    if (!form) {
      return NextResponse.json({ error: "P2H form not found" }, { status: 404 })
    }

    const driver = mockUsers.find((u) => u.id === form.driver_id)
    const pengawas = mockUsers.find((u) => u.id === form.pengawas_id)
    const vehicle = mockVehicles.find((v) => v.id === form.vehicle_id)
    const vehicleType = mockVehicleTypes.find((vt) => vt.id === form.vehicle_type_id)

    // Get all inspection results for this form
    const inspections = mockP2HInspectionDetails
      .filter((detail) => detail.p2h_form_id === formId)
      .map((detail) => {
        const item = mockInspectionItems.find((i) => i.id === detail.inspection_item.id) // Assuming inspection_item.id refers to mockInspectionItems.id
        return {
          id: detail.id, // Keep the inspection detail ID
          inspection_item: {
            category: item?.category || detail.inspection_item.category,
            description: item?.description || detail.inspection_item.description,
          },
          condition: detail.condition,
          notes: detail.notes,
        }
      })

    const detail = {
      id: form.id,
      driver_name: driver?.name || form.driver_name,
      driver_nik: driver?.nik || form.driver_nik,
      vehicle_number: vehicle?.vehicle_number || form.vehicle_number,
      vehicle_type: vehicleType?.name || form.vehicle_type,
      inspection_date: form.inspection_date,
      shift: form.shift,
      hm_km_awal: form.hm_km_awal,
      pengawas_name: pengawas?.name || form.pengawas_name,
      status: form.status,
      created_at: form.created_at,
      inspections: inspections,
    }

    return NextResponse.json(detail)
  } catch (error) {
    console.error("Failed to fetch P2H detail:", error)
    return NextResponse.json({ error: "Failed to fetch P2H detail" }, { status: 500 })
  }
}
