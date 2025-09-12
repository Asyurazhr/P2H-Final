"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AutocompleteInput } from "@/components/AutocompleteInput";

type UUID = string;

interface Driver { id: UUID; name: string; nik: string }
interface VehicleType { id: UUID; name: string }
interface Vehicle { id: UUID; vehicle_number: string; vehicle_type_id: UUID }
interface Pengawas { id: UUID; name: string; nik?: string }

export default function P2HFormPage() {
  const router = useRouter();

  // master data
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  // form state — simpan ID sebagai STRING (UUID)
  const [formData, setFormData] = useState({
    driver_id: "",
    driver_name: "",
    driver_nik: "",
    inspection_date: new Date().toISOString().split("T")[0],
    shift: "",
    vehicle_type_id: "", // UUID
    vehicle_id: "",      // UUID
    hm_km_awal: "",
    pengawas_id: "",
    pengawas_name: "",
  });

  const [isDriverLoggedIn, setIsDriverLoggedIn] = useState(false);

  // boot: login flag + prefill driver + ambil type
  useEffect(() => {
    setIsDriverLoggedIn(localStorage.getItem("is_driver_logged_in") === "true");

    try {
      const stored = localStorage.getItem("driver_profile") || "{}";
      const profile = JSON.parse(stored) as { id?: string | number; name?: string; nik?: string };
      if (profile?.name && profile?.nik) {
        setFormData((prev) => ({
          ...prev,
          driver_id: String(profile.id ?? ""),
          driver_name: profile.name || "",
          driver_nik: profile.nik || "",
        }));
      }
    } catch {
      // ignore
    }

    fetch("/api/vehicle-types")
      .then((r) => r.json())
      .then((data) => setVehicleTypes(Array.isArray(data) ? data : []))
      .catch(() => setVehicleTypes([]));
  }, []);

  // setiap type berubah -> ambil vehicles by type_id
  useEffect(() => {
    const typeId = formData.vehicle_type_id;
    if (!typeId) {
      setVehicles([]);
      setLoadingVehicles(false);
      setFormData((prev) => ({ ...prev, vehicle_id: "" })); // reset No Alat
      return;
    }
    setLoadingVehicles(true);
    fetch(`/api/vehicles?type_id=${encodeURIComponent(typeId)}`)
      .then((r) => r.json())
      .then((data) => {
        setVehicles(Array.isArray(data) ? data : []);
        setFormData((prev) => ({ ...prev, vehicle_id: "" })); // reset No Alat setiap ganti Type
      })
      .catch(() => setVehicles([]))
      .finally(() => setLoadingVehicles(false));
  }, [formData.vehicle_type_id]);

  const handleDriverSelect = (driver: Driver) => {
    setFormData((prev) => ({
      ...prev,
      driver_id: driver.id,
      driver_name: driver.name,
      driver_nik: driver.nik,
    }));
  };

  const handlePengawasSelect = (pengawas: Pengawas) => {
    setFormData((prev) => ({
      ...prev,
      pengawas_id: pengawas.id,       // <- wajib terisi
      pengawas_name: pengawas.name,   // cuma buat tampilan
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validasi yang bikin 400 tadi
    const missing: string[] = [];
    if (!formData.driver_name) missing.push("Nama Driver");
    if (!formData.driver_nik) missing.push("NIK Driver");
    if (!formData.inspection_date) missing.push("Tanggal");
    if (!formData.shift) missing.push("Shift");
    if (!formData.vehicle_type_id) missing.push("Type Alat");
    if (!formData.vehicle_id) missing.push("No Alat");
    if (!formData.pengawas_id) missing.push("Nama Pengawas (pilih dari daftar)");
    const hm = Number(formData.hm_km_awal);
    if (!Number.isFinite(hm)) missing.push("HM/KM Awal");

    if (missing.length) {
      alert(`Lengkapi dulu: ${missing.join(", ")}`);
      return;
    }

    const payload = {
      driver_id: formData.driver_id || null,
      driver_name: formData.driver_name.trim(),
      driver_nik: formData.driver_nik.trim(),
      inspection_date: formData.inspection_date,
      shift: formData.shift,
      vehicle_id: formData.vehicle_id,           // UUID
      hm_km_awal: hm,                             // number
      pengawas_id: formData.pengawas_id,         // UUID
      pengawas_name: formData.pengawas_name,     // optional (server bisa abaikan)
      vehicle_type_id: formData.vehicle_type_id, // optional (kalau server butuh)
    };

    try {
      const res = await fetch("/api/p2h-forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(`Gagal simpan${j?.error ? `: ${j.error}` : ""}`);
        return;
      }

      const result = await res.json();
      router.push(`/p2h/inspection/${result.id}`);
    } catch (err) {
      console.error(err);
      alert("Error creating form");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href={isDriverLoggedIn ? "/driver/dashboard" : "/"}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Form P2H - Pernyataan Operator</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama Driver */}
              <div className="space-y-2">
                <Label>Nama Driver *</Label>
                <AutocompleteInput
                  placeholder="Ketik nama driver..."
                  value={formData.driver_name}
                  onChange={(v) => setFormData({ ...formData, driver_name: v })}
                  onSelect={handleDriverSelect}
                  apiEndpoint="/api/drivers"
                />
              </div>

              {/* NIK Driver */}
              <div className="space-y-2">
                <Label>NIK Driver *</Label>
                <Input
                  value={formData.driver_nik}
                  readOnly
                  placeholder="NIK akan terisi otomatis"
                />
              </div>

              {/* Tanggal */}
              <div className="space-y-2">
                <Label>Hari/Tanggal *</Label>
                <Input
                  type="date"
                  value={formData.inspection_date}
                  onChange={(e) => setFormData({ ...formData, inspection_date: e.target.value })}
                  required
                />
              </div>

              {/* Shift */}
              <div className="space-y-2">
                <Label>Shift *</Label>
                <Select
                  value={formData.shift}
                  onValueChange={(v) => setFormData({ ...formData, shift: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="siang">Siang</SelectItem>
                    <SelectItem value="malam">Malam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type Alat */}
              <div className="space-y-2">
                <Label>Type Alat *</Label>
                <Select
                  value={formData.vehicle_type_id}
                  onValueChange={(v) =>
                    setFormData({ ...formData, vehicle_type_id: v, vehicle_id: "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Type Alat" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* No Alat */}
              <div className="space-y-2">
                <Label>No Alat *</Label>
                <Select
                  value={formData.vehicle_id}
                  onValueChange={(v) => setFormData({ ...formData, vehicle_id: v })}
                  disabled={!formData.vehicle_type_id || loadingVehicles || vehicles.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingVehicles
                          ? "Memuat..."
                          : vehicles.length
                          ? "Pilih No Alat"
                          : "Tidak ada alat untuk type ini"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.length > 0 ? (
                      vehicles.map((v) => (
                        <SelectItem key={v.id} value={String(v.id)}>
                          {v.vehicle_number}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="__no_vehicle__" disabled>
                        Tidak ada alat untuk type ini
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* HM/KM Awal */}
              <div className="space-y-2">
                <Label>HM/KM Awal *</Label>
                <Input
                  type="number"
                  value={formData.hm_km_awal}
                  onChange={(e) => setFormData({ ...formData, hm_km_awal: e.target.value })}
                  placeholder="Masukkan HM/KM Awal"
                  required
                />
              </div>

              {/* Pengawas */}
              <div className="space-y-2">
                <Label>Nama Pengawas *</Label>
                <AutocompleteInput
                  placeholder="Ketik nama pengawas..."
                  value={formData.pengawas_name}
                  onChange={(v) => setFormData({ ...formData, pengawas_name: v, pengawas_id: "" })}
                  onSelect={handlePengawasSelect}
                  apiEndpoint="/api/pengawas"
                />
              </div>

              <Button type="submit" className="w-full" disabled={!formData.vehicle_id}>
                Lanjut ke Pemeriksaan
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
