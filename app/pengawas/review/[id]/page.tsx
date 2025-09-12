"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"

interface P2HForm {
  id: number
  driver_name: string
  driver_nik: string
  vehicle_number: string
  vehicle_type: string
  inspection_date: string
  shift: string
  hm_km_awal: number
  status: string
  pengawas_name: string
}

interface InspectionResult {
  id: number
  inspection_item: {
    category: string
    description: string
  }
  condition: string
  notes: string
}

export default function ReviewDetailPage({ params }: { params: { id: string } }) {
  const [form, setForm] = useState<P2HForm | null>(null)
  const [inspections, setInspections] = useState<InspectionResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFormDetail()
  }, [])

  const fetchFormDetail = async () => {
    try {
      const response = await fetch(`/api/pengawas/p2h-detail/${params.id}`)
      if (response.ok) {
        const detail = await response.json()
        setForm(detail)
        setInspections(detail.inspections)
      } else {
        // Fallback to mock data if API fails
        const mockForm = {
          id: Number.parseInt(params.id),
          driver_name: "Driver 1",
          driver_nik: "DRV001",
          vehicle_number: "LV-001",
          vehicle_type: "LV",
          inspection_date: "2024-01-15",
          shift: "siang",
          hm_km_awal: 12500,
          pengawas_name: "Pengawas 1",
          status: "pending",
        }

        const mockInspections = [
          // Use the complete inspection data from the API endpoint
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
            id: 12,
            inspection_item: {
              category: "Pemeriksaan Keling Unit / Diluar Kabin",
              description: "Pemeriksaan kondisi rem",
            },
            condition: "rusak",
            notes: "Rem depan perlu diganti, sudah aus",
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
        ]

        setForm(mockForm)
        setInspections(mockInspections)
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching form detail:", error)
      setLoading(false)
    }
  }

  const updateFormStatus = async (status: string) => {
    try {
      const response = await fetch(`/api/pengawas/p2h-forms/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        alert(`Form berhasil ${status === "approved" ? "disetujui" : "ditolak"}!`)
        window.history.back()
      } else {
        alert("Error updating form status")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error updating form status")
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!form) {
    return <div className="min-h-screen flex items-center justify-center">Form not found</div>
  }

  const categories = [...new Set(inspections.map((item) => item.inspection_item.category))]
  const issueItems = inspections.filter((item) => item.condition === "rusak")

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/pengawas/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Form P2H</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nama Driver</label>
                    <p className="text-base font-semibold">{form.driver_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">NIK Driver</label>
                    <p className="text-base">{form.driver_nik}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type Alat</label>
                    <p className="text-base">{form.vehicle_type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">No Alat</label>
                    <p className="text-base font-semibold">{form.vehicle_number}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Hari/Tanggal</label>
                    <p className="text-base">
                      {new Date(form.inspection_date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Shift</label>
                    <p className="text-base capitalize">{form.shift}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">HM/KM Awal</label>
                    <p className="text-base font-semibold">{form.hm_km_awal.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nama Pengawas</label>
                    <p className="text-base">{form.pengawas_name}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status Form</label>
                    <div className="mt-1">
                      {form.status === "pending" && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Menunggu Persetujuan
                        </Badge>
                      )}
                      {form.status === "approved" && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Disetujui
                        </Badge>
                      )}
                      {form.status === "rejected" && (
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Ditolak
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <label className="text-sm font-medium text-gray-600">Waktu Submit</label>
                    <p className="text-sm text-gray-500">
                      {new Date().toLocaleDateString("id-ID")} {new Date().toLocaleTimeString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {issueItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Item Bermasalah</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {issueItems.map((item) => (
                    <div key={item.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <h4 className="font-semibold text-red-800">{item.inspection_item.description}</h4>
                      <p className="text-sm text-gray-600 mb-2">Kategori: {item.inspection_item.category}</p>
                      <Badge variant="destructive">Rusak/Tidak Normal</Badge>
                      {item.notes && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Catatan:</p>
                          <p className="text-sm text-gray-700">{item.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Detail Pemeriksaan</CardTitle>
            </CardHeader>
            <CardContent>
              {categories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {categoryIndex + 1}. {category}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Deskripsi</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Kondisi</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Catatan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inspections
                          .filter((item) => item.inspection_item.category === category)
                          .map((item) => (
                            <tr key={item.id}>
                              <td className="border border-gray-300 px-4 py-2">{item.inspection_item.description}</td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                <Badge
                                  className={
                                    item.condition === "baik"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }
                                >
                                  {item.condition === "baik" ? "Baik/Normal" : "Rusak/Tidak Normal"}
                                </Badge>
                              </td>
                              <td className="border border-gray-300 px-4 py-2">{item.notes || "-"}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {form.status === "pending" && (
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => updateFormStatus("approved")}
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Setujui Form
              </Button>
              <Button onClick={() => updateFormStatus("rejected")} variant="destructive" size="lg">
                <XCircle className="h-5 w-5 mr-2" />
                Tolak Form
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
