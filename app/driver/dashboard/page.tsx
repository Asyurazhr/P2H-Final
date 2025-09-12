"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ClipboardCheck, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SearchInput } from "@/components/SearchInput"

interface P2HForm {
  id: number
  driver_name: string
  driver_nik: string
  vehicle_number: string
  vehicle_type: string
  inspection_date: string
  shift: string
  hm_km_awal: number
  pengawas_name: string
  status: string
  created_at: string
}

export default function DriverDashboardPage() {
  const router = useRouter()
  const [p2hForms, setP2hForms] = useState<P2HForm[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("is_driver_logged_in")
    if (!isLoggedIn) {
      router.push("/driver/login")
      return
    }
    fetchDriverForms()
  }, [router])

  const fetchDriverForms = async () => {
    try {
      const stored = localStorage.getItem("driver_profile") || "{}"
      const profile = JSON.parse(stored || "{}") as { nik?: string; name?: string }
      const nik = profile?.nik || ""
      const url = nik ? `/api/driver/p2h-forms?driver_nik=${encodeURIComponent(nik)}` : `/api/driver/p2h-forms`
      const response = await fetch(url)
      if (response.ok) {
        const forms = await response.json()
        setP2hForms(forms)
      } else {
        setP2hForms([])
      }
    } catch (error) {
      console.error("Error fetching driver P2H forms:", error)
      setP2hForms([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("is_driver_logged_in")
    localStorage.removeItem("driver_profile")
    router.push("/")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Menunggu Verifikasi
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Disetujui
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Ditolak
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const groupedForms = useMemo(() => {
    const groups: { [key: string]: P2HForm[] } = {}
    p2hForms.forEach((form) => {
      if (!groups[form.vehicle_type]) {
        groups[form.vehicle_type] = []
      }
      groups[form.vehicle_type].push(form)
    })
    return groups
  }, [p2hForms])

  const sortedVehicleTypes = useMemo(() => {
    return Object.keys(groupedForms).sort()
  }, [groupedForms])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
          <h1 className="text-2xl font-bold">Dashboard Driver</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Selamat Datang, Driver!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Anda login sebagai akun driver.</p>
            <div className="mt-4">
              <Link href="/p2h/form">
                <Button size="lg">
                  <ClipboardCheck className="h-5 w-5 mr-2" />
                  Isi Form P2H Baru
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {sortedVehicleTypes.length === 0 ? (
            <Card>
              <CardContent>
                <p className="text-gray-500 text-center py-8">Belum ada form P2H yang disubmit.</p>
              </CardContent>
            </Card>
          ) : (
            sortedVehicleTypes.map((vehicleType) => (
              <Card key={vehicleType}>
                <CardHeader>
                  <CardTitle className="text-xl">Riwayat Form P2H - Tipe {vehicleType}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {groupedForms[vehicleType]
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((form) => (
                        <div key={form.id} className="border rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {form.vehicle_type} - {form.vehicle_number}
                              </h3>
                              <p className="text-sm text-gray-600">Driver: {form.driver_name}</p>
                              <p className="text-sm text-gray-600">
                                Tanggal Inspeksi: {new Date(form.inspection_date).toLocaleDateString("id-ID")}
                              </p>
                              <p className="text-sm text-gray-600">Shift: {form.shift}</p>
                              <p className="text-sm text-gray-600">Pengawas: {form.pengawas_name}</p>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              {getStatusBadge(form.status)}
                              <p className="text-xs text-gray-500 text-right">
                                Submitted: {new Date(form.created_at).toLocaleDateString("id-ID")} {new Date(form.created_at).toLocaleTimeString("id-ID")}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Link href={`/p2h/submission-success?formId=${form.id}`}>
                              <Button variant="outline" size="sm">
                                Lihat Detail
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
