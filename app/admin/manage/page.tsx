"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

/* ===================== Types ===================== */
// Semua UUID -> string
interface Driver {
  id: string;
  name: string;
  nik: string;
}

interface VehicleType {
  id: string;   // UUID
  name: string;
}

interface Vehicle {
  id: string;   // UUID
  vehicle_number: string;
  vehicle_type_id: string;   // UUID
  vehicle_type: string;
}

interface InspectionItem {
  id: string;     // UUID
  category: string;
  description: string;
  item_order: number;
  danger_code: string;
}

interface Pengawas {
  id: string;     // UUID
  name: string;
  username: string;
}

/* ===================== Utils ===================== */
async function safeJson(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Expected JSON but got "${ct}". First chars: ${text.slice(0, 80)}`);
  }
  return res.json();
}

function toArray<T = any>(data: any): T[] {
  if (Array.isArray(data)) return data as T[];
  if (!data || typeof data !== "object") return [];
  const candidates = [
    "data","items","list","rows","results",
    "drivers","vehicleTypes","vehicle_types","vehicles","inspectionItems","pengawas",
  ];
  for (const key of candidates) {
    const v = (data as any)[key];
    if (Array.isArray(v)) return v as T[];
  }
  return [];
}

/* ===================== Component ===================== */
export default function AdminManagePage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([]);
  const [pengawas, setPengawas] = useState<Pengawas[]>([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // form states
  const [newDriver, setNewDriver] = useState({ name: "", nik: "", username: "", password: "" });

  const [newVehicleType, setNewVehicleType] = useState({ name: "" });

  // ==== IMPORTANT: gunakan undefined untuk Select, bukan "" ====
  const [newVehicle, setNewVehicle] = useState<{
    vehicle_number: string;
    vehicle_type_id?: string; // undefined saat belum dipilih
  }>({ vehicle_number: "", vehicle_type_id: undefined });

  const [newInspectionItem, setNewInspectionItem] = useState<{
    category?: string;        // undefined saat belum dipilih
    description: string;
    item_order: number;
    danger_code: string;
  }>({ category: undefined, description: "", item_order: 0, danger_code: "B" });

  // pengawas TIDAK pakai nik
  const [newPengawas, setNewPengawas] = useState({ name: "", username: "", password: "" });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    setErrMsg(null);
    try {
      const [driversRes, vehicleTypesRes, vehiclesRes, inspectionItemsRes, pengawasRes] = await Promise.all([
        fetch("/api/admin/drivers",           { cache: "no-store", headers: { Accept: "application/json" } }),
        fetch("/api/admin/vehicle-types",     { cache: "no-store", headers: { Accept: "application/json" } }),
        fetch("/api/admin/vehicles",          { cache: "no-store", headers: { Accept: "application/json" } }),
        fetch("/api/admin/inspection-items",  { cache: "no-store", headers: { Accept: "application/json" } }),
        fetch("/api/admin/pengawas",          { cache: "no-store", headers: { Accept: "application/json" } }),
      ]);

      if (!driversRes.ok)          throw new Error(`drivers: ${driversRes.status}`);
      if (!vehicleTypesRes.ok)     throw new Error(`vehicleTypes: ${vehicleTypesRes.status}`);
      if (!vehiclesRes.ok)         throw new Error(`vehicles: ${vehiclesRes.status}`);
      if (!inspectionItemsRes.ok)  throw new Error(`inspectionItems: ${inspectionItemsRes.status}`);
      if (!pengawasRes.ok)         throw new Error(`pengawas: ${pengawasRes.status}`);

      const [driversJson, vehicleTypesJson, vehiclesJson, inspectionItemsJson, pengawasJson] = await Promise.all([
        safeJson(driversRes), safeJson(vehicleTypesRes), safeJson(vehiclesRes),
        safeJson(inspectionItemsRes), safeJson(pengawasRes),
      ]);

      setDrivers(toArray<Driver>(driversJson));
      setVehicleTypes(toArray<VehicleType>(vehicleTypesJson));
      setVehicles(toArray<Vehicle>(vehiclesJson));
      setInspectionItems(toArray<InspectionItem>(inspectionItemsJson));
      setPengawas(toArray<Pengawas>(pengawasJson));
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setErrMsg(error?.message || "Fetch error");
      setDrivers([]); setVehicleTypes([]); setVehicles([]); setInspectionItems([]); setPengawas([]);
    } finally {
      setLoading(false);
    }
  };

  const postJson = async (url: string, body: unknown) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      let msg = `${res.status}`;
      try { const j = await safeJson(res); msg = (j?.error as string) || msg; } catch {}
      throw new Error(msg);
    }
    return res;
  };

  const del = async (url: string) => {
    const res = await fetch(url, { method: "DELETE", headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`${res.status}`);
    return res;
  };

  /* ----------------- Actions ----------------- */
  const addDriver = async () => {
    if (newDriver.name && newDriver.nik && newDriver.username && newDriver.password) {
      try {
        await postJson("/api/admin/drivers", newDriver); // API akan abaikan username/password
        setNewDriver({ name: "", nik: "", username: "", password: "" });
        await fetchData();
      } catch (e: any) {
        alert(`Gagal menambah driver: ${e.message || "Unknown error"}`);
      }
    } else {
      alert("Semua field harus diisi!");
    }
  };

  const addVehicleType = async () => {
    if (!newVehicleType.name) return;
    try {
      await postJson("/api/admin/vehicle-types", newVehicleType);
      setNewVehicleType({ name: "" });
      await fetchData();
    } catch (e: any) {
      alert(`Failed to add vehicle type: ${e.message || "Unknown error"}`);
    }
  };

  const addVehicle = async () => {
    if (newVehicle.vehicle_number && newVehicle.vehicle_type_id) {
      try {
        await postJson("/api/admin/vehicles", {
          vehicle_number: newVehicle.vehicle_number,
          vehicle_type_id: newVehicle.vehicle_type_id, // STRING UUID
        });
        setNewVehicle({ vehicle_number: "", vehicle_type_id: undefined });
        await fetchData();
      } catch (e: any) {
        alert(`Failed to add vehicle: ${e.message || "Unknown error"}`);
      }
    }
  };

  const addInspectionItem = async () => {
    if (newInspectionItem.category && newInspectionItem.description) {
      try {
        await postJson("/api/admin/inspection-items", newInspectionItem);
        setNewInspectionItem({ category: undefined, description: "", item_order: 0, danger_code: "B" });
        await fetchData();
      } catch (e: any) {
        alert(`Gagal menambah item inspeksi: ${e.message || "Unknown error"}`);
      }
    }
  };

  const addPengawas = async () => {
    if (newPengawas.name && newPengawas.username && newPengawas.password) {
      try {
        await postJson("/api/admin/pengawas", newPengawas);
        setNewPengawas({ name: "", username: "", password: "" });
        await fetchData();
      } catch (e: any) {
        alert(`Failed to add pengawas: ${e.message || "Unknown error"}`);
      }
    } else {
      alert("Semua field harus diisi!");
    }
  };

  const deleteDriver = async (id: string) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;
    try { await del(`/api/admin/drivers?id=${id}`); await fetchData(); }
    catch (e: any) { alert(`Failed to delete driver: ${e.message || "Unknown error"}`); }
  };

  const deleteVehicleType = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle type?")) return;
    try { await del(`/api/admin/vehicle-types?id=${id}`); await fetchData(); }
    catch (e: any) { alert(`Failed to delete vehicle type: ${e.message || "Unknown error"}`); }
  };

  const deleteVehicle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try { await del(`/api/admin/vehicles?id=${id}`); await fetchData(); }
    catch (e: any) { alert(`Failed to delete vehicle: ${e.message || "Unknown error"}`); }
  };

  const deleteInspectionItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inspection item?")) return;
    try { await del(`/api/admin/inspection-items?id=${id}`); await fetchData(); }
    catch (e: any) { alert(`Failed to delete inspection item: ${e.message || "Unknown error"}`); }
  };

  const deletePengawas = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pengawas?")) return;
    try { await del(`/api/admin/pengawas?id=${id}`); await fetchData(); }
    catch (e: any) { alert(`Failed to delete pengawas: ${e.message || "Unknown error"}`); }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading data master...</div>;
  }

  /* ===================== UI ===================== */
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
          <Link href="/admin/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Kelola Data Master</h1>
          <div />
        </div>

        {errMsg ? (
          <div className="mb-4 text-sm text-red-600">
            Gagal memuat sebagian data: {errMsg}. Cek Network tab / log server.
          </div>
        ) : null}

        <Tabs defaultValue="drivers" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <TabsTrigger value="drivers">Driver</TabsTrigger>
            <TabsTrigger value="pengawas">Pengawas</TabsTrigger>
            <TabsTrigger value="vehicle-types">Type Alat</TabsTrigger>
            <TabsTrigger value="vehicles">No Alat</TabsTrigger>
            <TabsTrigger value="inspection-items">Item Pemeriksaan</TabsTrigger>
          </TabsList>

          {/* DRIVERS */}
          <TabsContent value="drivers">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <CardTitle>Kelola Driver</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button><Plus className="h-4 w-4 mr-2" />Tambah Driver</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Tambah Driver Baru</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="driver-name">Nama Driver</Label>
                        <Input id="driver-name" value={newDriver.name}
                               onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}/>
                      </div>
                      <div>
                        <Label htmlFor="driver-nik">NIK</Label>
                        <Input id="driver-nik" value={newDriver.nik}
                               onChange={(e) => setNewDriver({ ...newDriver, nik: e.target.value })}/>
                      </div>
                      <div>
                        <Label htmlFor="driver-username">Username</Label>
                        <Input id="driver-username" value={newDriver.username}
                               onChange={(e) => setNewDriver({ ...newDriver, username: e.target.value })}/>
                      </div>
                      <div>
                        <Label htmlFor="driver-password">Password</Label>
                        <Input id="driver-password" type="password" value={newDriver.password}
                               onChange={(e) => setNewDriver({ ...newDriver, password: e.target.value })}/>
                      </div>
                      <Button onClick={addDriver} className="w-full">Tambah</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drivers.length ? drivers.map((driver) => (
                    <div key={driver.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-2">
                      <div>
                        <h3 className="font-semibold">{driver.name}</h3>
                        <p className="text-sm text-gray-600">NIK: {driver.nik}</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => deleteDriver(driver.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )) : <div className="text-sm text-muted-foreground">No drivers.</div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PENGAWAS */}
          <TabsContent value="pengawas">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <CardTitle>Kelola Pengawas</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button><Plus className="h-4 w-4 mr-2" />Tambah Pengawas</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Tambah Pengawas Baru</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="pengawas-name">Nama Pengawas</Label>
                        <Input id="pengawas-name" value={newPengawas.name}
                               onChange={(e) => setNewPengawas({ ...newPengawas, name: e.target.value })}/>
                      </div>
                      <div>
                        <Label htmlFor="pengawas-username">Username</Label>
                        <Input id="pengawas-username" value={newPengawas.username}
                               onChange={(e) => setNewPengawas({ ...newPengawas, username: e.target.value })}/>
                      </div>
                      <div>
                        <Label htmlFor="pengawas-password">Password</Label>
                        <Input id="pengawas-password" type="password" value={newPengawas.password}
                               onChange={(e) => setNewPengawas({ ...newPengawas, password: e.target.value })}/>
                      </div>
                      <Button onClick={addPengawas} className="w-full">Tambah</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pengawas.length ? pengawas.map((p) => (
                    <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-2">
                      <div>
                        <h3 className="font-semibold">{p.name}</h3>
                        <p className="text-sm text-gray-600">Username: {p.username}</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => deletePengawas(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )) : <div className="text-sm text-muted-foreground">No pengawas.</div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* VEHICLE TYPES */}
          <TabsContent value="vehicle-types">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <CardTitle>Kelola Type Alat</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button><Plus className="h-4 w-4 mr-2" />Tambah Type</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Tambah Type Alat Baru</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="vehicle-type-name">Nama Type</Label>
                        <Input id="vehicle-type-name" value={newVehicleType.name}
                               onChange={(e) => setNewVehicleType({ ...newVehicleType, name: e.target.value })}/>
                      </div>
                      <Button onClick={addVehicleType} className="w-full">Tambah</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicleTypes.length ? vehicleTypes.map((type) => (
                    <div key={type.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-2">
                      <h3 className="font-semibold">{type.name}</h3>
                      <Button variant="destructive" size="sm" onClick={() => deleteVehicleType(type.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )) : <div className="text-sm text-muted-foreground">No vehicle types.</div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* VEHICLES */}
          <TabsContent value="vehicles">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <CardTitle>Kelola No Alat</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button><Plus className="h-4 w-4 mr-2" />Tambah Alat</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Tambah Alat Baru</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="vehicle-number">No Alat</Label>
                        <Input id="vehicle-number" value={newVehicle.vehicle_number}
                               onChange={(e) => setNewVehicle({ ...newVehicle, vehicle_number: e.target.value })}/>
                      </div>
                      <div>
                        <Label htmlFor="vehicle-type">Type Alat</Label>
                        <Select
                          value={newVehicle.vehicle_type_id ?? undefined}
                          onValueChange={(value) => setNewVehicle({ ...newVehicle, vehicle_type_id: value })}
                        >
                          <SelectTrigger><SelectValue placeholder="Pilih Type" /></SelectTrigger>
                          <SelectContent>
                            {vehicleTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={addVehicle} className="w-full">Tambah</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicles.length ? vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-2">
                      <div>
                        <h3 className="font-semibold">{vehicle.vehicle_number}</h3>
                        <p className="text-sm text-gray-600">Type: {vehicle.vehicle_type}</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => deleteVehicle(vehicle.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )) : <div className="text-sm text-muted-foreground">No vehicles.</div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* INSPECTION ITEMS */}
          <TabsContent value="inspection-items">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <CardTitle>Kelola Item Pemeriksaan</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button><Plus className="h-4 w-4 mr-2" />Tambah Item</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Tambah Item Pemeriksaan Baru</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="item-category">Kategori</Label>
                        <Select
                          value={newInspectionItem.category ?? undefined}
                          onValueChange={(value) => setNewInspectionItem({ ...newInspectionItem, category: value })}
                        >
                          <SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pemeriksaan Keling Unit / Diluar Kabin">
                              Pemeriksaan Keling Unit / Diluar Kabin
                            </SelectItem>
                            <SelectItem value="Pemeriksaan di dalam Kabin & engine hidup">
                              Pemeriksaan di dalam Kabin & engine hidup
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="item-description">Deskripsi</Label>
                        <Textarea id="item-description" value={newInspectionItem.description}
                                  onChange={(e) => setNewInspectionItem({ ...newInspectionItem, description: e.target.value })}/>
                      </div>
                      <div>
                        <Label htmlFor="item-order">Urutan</Label>
                        <Input id="item-order" type="number" value={newInspectionItem.item_order}
                               onChange={(e) => setNewInspectionItem({
                                 ...newInspectionItem,
                                 item_order: Number.isNaN(Number(e.target.value)) ? 0 : Number(e.target.value),
                               })}/>
                      </div>
                      <div>
                        <Label htmlFor="item-danger-code">Kode Bahaya</Label>
                        <Select
                          value={newInspectionItem.danger_code}
                          onValueChange={(value) => setNewInspectionItem({ ...newInspectionItem, danger_code: value })}
                        >
                          <SelectTrigger><SelectValue placeholder="Pilih Kode Bahaya" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AA">AA - Sangat Berbahaya</SelectItem>
                            <SelectItem value="A">A - Berbahaya</SelectItem>
                            <SelectItem value="B">B - Normal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={addInspectionItem} className="w-full">Tambah</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inspectionItems.length ? inspectionItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-2">
                      <div>
                        <h3 className="font-semibold">{item.description}</h3>
                        <p className="text-sm text-gray-600">Kategori: {item.category}</p>
                        <p className="text-sm text-gray-600">Urutan: {item.item_order}</p>
                        <p className="text-sm text-gray-600">Kode Bahaya: {item.danger_code}</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => deleteInspectionItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )) : <div className="text-sm text-muted-foreground">No inspection items.</div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
