"use client"

import { useState } from "react"
import { Plus, Building2, Bed, Users, MapPin, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { HotelForm } from "@/components/hotel-form"
import { RoomConfiguration } from "@/components/room-configuration"
import { HotelList } from "@/components/hotel-list"

export interface Hotel {
  id: string
  nombre: string
  direccion: string
  ciudad: string
  nit: string
  numeroHabitaciones: number
  habitacionesConfiguradas: RoomConfig[]
}

export interface RoomConfig {
  id: string
  cantidad: number
  tipoHabitacion: "ESTANDAR" | "JUNIOR" | "SUITE"
  acomodacion: "SENCILLA" | "DOBLE" | "TRIPLE" | "CUADRUPLE"
}

export default function HotelesDecameron() {
  const [hoteles, setHoteles] = useState<Hotel[]>([])
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [activeTab, setActiveTab] = useState("registro")

  const handleHotelCreated = (hotel: Hotel) => {
    setHoteles((prev) => [...prev, hotel])
    setActiveTab("configuracion")
    setSelectedHotel(hotel)
  }

  const handleHotelUpdated = (updatedHotel: Hotel) => {
    setHoteles((prev) => prev.map((h) => (h.id === updatedHotel.id ? updatedHotel : h)))
    setSelectedHotel(updatedHotel)
  }

  const handleSelectHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel)
    setActiveTab("configuracion")
  }

  const getTotalHabitacionesConfiguradas = (hotel: Hotel) => {
    return hotel.habitacionesConfiguradas.reduce((total, config) => total + config.cantidad, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Hoteles Decamerón</h1>
          </div>
          <p className="text-gray-600">Sistema de gestión hotelera - Dirección de Desarrollo</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{hoteles.length}</p>
                <p className="text-sm text-gray-600">Hoteles Registrados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Bed className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">
                  {hoteles.reduce((total, hotel) => total + getTotalHabitacionesConfiguradas(hotel), 0)}
                </p>
                <p className="text-sm text-gray-600">Habitaciones Configuradas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">
                  {hoteles.reduce((total, hotel) => total + hotel.numeroHabitaciones, 0)}
                </p>
                <p className="text-sm text-gray-600">Capacidad Total</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="registro" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Registro de Hotel
            </TabsTrigger>
            <TabsTrigger value="configuracion" className="flex items-center gap-2">
              <Bed className="h-4 w-4" />
              Configuración de Habitaciones
            </TabsTrigger>
            <TabsTrigger value="listado" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Listado de Hoteles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registro" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Registro de Nuevo Hotel
                </CardTitle>
                <CardDescription>Ingrese los datos básicos y tributarios del hotel</CardDescription>
              </CardHeader>
              <CardContent>
                <HotelForm onHotelCreated={handleHotelCreated} existingHotels={hoteles} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracion" className="space-y-6">
            {selectedHotel ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bed className="h-5 w-5" />
                    Configuración de Habitaciones
                  </CardTitle>
                  <CardDescription>
                    Hotel: {selectedHotel.nombre} - {selectedHotel.ciudad}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedHotel.direccion}
                    </span>
                    <Badge variant="outline">NIT: {selectedHotel.nit}</Badge>
                    <Badge variant="secondary">Capacidad: {selectedHotel.numeroHabitaciones} habitaciones</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <RoomConfiguration hotel={selectedHotel} onHotelUpdated={handleHotelUpdated} />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bed className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Seleccione un hotel</h3>
                  <p className="text-gray-500 text-center mb-4">
                    Para configurar las habitaciones, primero debe registrar un hotel o seleccionar uno existente.
                  </p>
                  <Button onClick={() => setActiveTab("registro")} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Registrar Nuevo Hotel
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="listado" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Listado de Hoteles
                </CardTitle>
                <CardDescription>Gestione y visualice todos los hoteles registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <HotelList
                  hoteles={hoteles}
                  onSelectHotel={handleSelectHotel}
                  getTotalHabitacionesConfiguradas={getTotalHabitacionesConfiguradas}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
