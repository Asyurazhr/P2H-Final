import { NextResponse } from "next/server"

// Mock data - same as above
const vehicles = [
  { id: 1, vehicle_number: "LV-001", vehicle_type: "LV", status: "available" },
  { id: 2, vehicle_number: "LV-002", vehicle_type: "LV", status: "available" },
  { id: 3, vehicle_number: "AMB-001", vehicle_type: "Ambulance", status: "available" },
  { id: 4, vehicle_number: "AMB-002", vehicle_type: "Ambulance", status: "maintenance" },
  { id: 5, vehicle_number: "TRK-001", vehicle_type: "Truk", status: "available" },
  { id: 6, vehicle_number: "TRK-002", vehicle_type: "Truk", status: "available" },
]

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    const vehicleId = Number.parseInt(params.id)

    const vehicleIndex = vehicles.findIndex((v) => v.id === vehicleId)
    if (vehicleIndex === -1) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    vehicles[vehicleIndex].status = status

    return NextResponse.json(vehicles[vehicleIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 })
  }
}
