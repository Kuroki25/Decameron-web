"use client"

import { useState } from "react"
import { Building2, MapPin, Settings, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Hotel } from "../page"

interface HotelListProps {
  hoteles: Hotel[]
  onSelectHotel: (hotel: Hotel) => void
  getTotalHabitacionesConfiguradas: (hotel: Hotel) => number
}

export function HotelList({ hoteles, onSelectHotel, getTotalHabitacionesConfiguradas }: HotelListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCity, setFilterCity] = useState("all")

  const ciudades = [...new Set(hoteles.map((hotel) => hotel.ciudad))].sort()

  const filteredHoteles = hoteles.filter((hotel) => {
    const matchesSearch =
      hotel.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.nit.includes(searchTerm)
    const matchesCity = filterCity === "all" || hotel.ciudad === filterCity
    return matchesSearch && matchesCity
  })

  const getStatusColor = (hotel: Hotel) => {
    const configuradas = getTotalHabitacionesConfiguradas(hotel)
    const total = hotel.numeroHabitaciones
    const percentage = (configuradas / total) * 100

    if (percentage === 100) return "bg-green-500"
    if (percentage >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getStatusText = (hotel: Hotel) => {
    const configuradas = getTotalHabitacionesConfiguradas(hotel)
    const total = hotel.numeroHabitaciones
    const percentage = (configuradas / total) * 100

    if (percentage === 100) return "Completo"
    if (percentage >= 50) return "En progreso"
    return "Pendiente"
  }

  if (hoteles.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay hoteles registrados</h3>
        <p className="text-gray-500">Comience registrando su primer hotel en la pestaña "Registro de Hotel"</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nombre, dirección o NIT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={filterCity} onValueChange={setFilterCity}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por ciudad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las ciudades</SelectItem>
              {ciudades.map((ciudad) => (
                <SelectItem key={ciudad} value={ciudad}>
                  {ciudad}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de hoteles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHoteles.map((hotel) => {
          const configuradas = getTotalHabitacionesConfiguradas(hotel)
          const percentage = (configuradas / hotel.numeroHabitaciones) * 100

          return (
            <Card key={hotel.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      {hotel.nombre}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4" />
                      {hotel.direccion}, {hotel.ciudad}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(hotel)}`} />
                    <span className="text-xs font-medium">{getStatusText(hotel)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Información básica */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">NIT:</span>
                    <p className="font-medium">{hotel.nit}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Capacidad:</span>
                    <p className="font-medium">{hotel.numeroHabitaciones} habitaciones</p>
                  </div>
                </div>

                {/* Progreso */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Configuración de habitaciones</span>
                    <span className="font-medium">
                      {configuradas}/{hotel.numeroHabitaciones}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getStatusColor(hotel)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Configuraciones */}
                {hotel.habitacionesConfiguradas.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Configuraciones:</span>
                    <div className="flex flex-wrap gap-2">
                      {hotel.habitacionesConfiguradas.map((config) => (
                        <Badge key={config.id} variant="outline" className="text-xs">
                          {config.cantidad} {config.tipoHabitacion.toLowerCase()} ({config.acomodacion.toLowerCase()})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectHotel(hotel)}
                    className="flex items-center gap-2 flex-1"
                  >
                    <Settings className="h-4 w-4" />
                    Configurar
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Ver detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredHoteles.length === 0 && (searchTerm || filterCity !== "all") && (
        <div className="text-center py-8">
          <p className="text-gray-500">No se encontraron hoteles que coincidan con los filtros aplicados</p>
        </div>
      )}
    </div>
  )
}
