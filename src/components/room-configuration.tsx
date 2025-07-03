"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Plus, Trash2, Bed, Users, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Hotel, RoomConfig } from "../app/page"

interface RoomConfigurationProps {
  hotel: Hotel
  onHotelUpdated: (hotel: Hotel) => void
}

interface FormData {
  cantidad: number
  tipoHabitacion: "ESTANDAR" | "JUNIOR" | "SUITE"
  acomodacion: "SENCILLA" | "DOBLE" | "TRIPLE" | "CUADRUPLE"
}

const tiposHabitacion = [
  { value: "ESTANDAR", label: "Estándar" },
  { value: "JUNIOR", label: "Junior" },
  { value: "SUITE", label: "Suite" },
]

const acomodacionesPorTipo = {
  ESTANDAR: ["SENCILLA", "DOBLE"],
  JUNIOR: ["TRIPLE", "CUADRUPLE"],
  SUITE: ["SENCILLA", "DOBLE", "TRIPLE"],
}

export function RoomConfiguration({ hotel, onHotelUpdated }: RoomConfigurationProps) {
  const [error, setError] = useState<string>("")
  const [selectedTipo, setSelectedTipo] = useState<string>("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>()

  const tipoHabitacion = watch("tipoHabitacion")

  const getTotalHabitacionesConfiguradas = () => {
    return hotel.habitacionesConfiguradas.reduce((total, config) => total + config.cantidad, 0)
  }

  const onSubmit = (data: FormData) => {
    setError("")

    // Validar que la cantidad no exceda el límite
    const totalActual = getTotalHabitacionesConfiguradas()
    if (totalActual + data.cantidad > hotel.numeroHabitaciones) {
      setError(`La cantidad excede el límite del hotel. Disponibles: ${hotel.numeroHabitaciones - totalActual}`)
      return
    }

    // Validar que no exista la misma combinación tipo-acomodación
    const configExists = hotel.habitacionesConfiguradas.some(
      (config) => config.tipoHabitacion === data.tipoHabitacion && config.acomodacion === data.acomodacion,
    )

    if (configExists) {
      setError("Ya existe una configuración con este tipo de habitación y acomodación")
      return
    }

    // Crear nueva configuración
    const newConfig: RoomConfig = {
      id: Date.now().toString(),
      cantidad: data.cantidad,
      tipoHabitacion: data.tipoHabitacion,
      acomodacion: data.acomodacion,
    }

    const updatedHotel = {
      ...hotel,
      habitacionesConfiguradas: [...hotel.habitacionesConfiguradas, newConfig],
    }

    onHotelUpdated(updatedHotel)
    reset()
    setSelectedTipo("")
  }

  const removeConfiguration = (configId: string) => {
    const updatedHotel = {
      ...hotel,
      habitacionesConfiguradas: hotel.habitacionesConfiguradas.filter((config) => config.id !== configId),
    }
    onHotelUpdated(updatedHotel)
  }

  const getAcomodacionLabel = (acomodacion: string) => {
    const labels = {
      SENCILLA: "Sencilla",
      DOBLE: "Doble",
      TRIPLE: "Triple",
      CUADRUPLE: "Cuádruple",
    }
    return labels[acomodacion as keyof typeof labels] || acomodacion
  }

  const getTipoLabel = (tipo: string) => {
    const labels = {
      ESTANDAR: "Estándar",
      JUNIOR: "Junior",
      SUITE: "Suite",
    }
    return labels[tipo as keyof typeof labels] || tipo
  }

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <Bed className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{getTotalHabitacionesConfiguradas()}</p>
              <p className="text-sm text-gray-600">Configuradas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{hotel.numeroHabitaciones - getTotalHabitacionesConfiguradas()}</p>
              <p className="text-sm text-gray-600">Disponibles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{hotel.numeroHabitaciones}</p>
              <p className="text-sm text-gray-600">Capacidad Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulario de configuración */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Agregar Configuración de Habitaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cantidad */}
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad *</Label>
                <Input
                  id="cantidad"
                  type="number"
                  min="1"
                  max={hotel.numeroHabitaciones - getTotalHabitacionesConfiguradas()}
                  placeholder="25"
                  {...register("cantidad", {
                    required: "La cantidad es obligatoria",
                    min: { value: 1, message: "Debe ser al menos 1" },
                    max: {
                      value: hotel.numeroHabitaciones - getTotalHabitacionesConfiguradas(),
                      message: `Máximo ${hotel.numeroHabitaciones - getTotalHabitacionesConfiguradas()} habitaciones disponibles`,
                    },
                    valueAsNumber: true,
                  })}
                />
                {errors.cantidad && <p className="text-sm text-red-600">{errors.cantidad.message}</p>}
              </div>

              {/* Tipo de Habitación */}
              <div className="space-y-2">
                <Label htmlFor="tipoHabitacion">Tipo de Habitación *</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("tipoHabitacion", value as any)
                    setValue("acomodacion", "" as any)
                    setSelectedTipo(value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposHabitacion.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tipoHabitacion && <p className="text-sm text-red-600">{errors.tipoHabitacion.message}</p>}
              </div>

              {/* Acomodación */}
              <div className="space-y-2">
                <Label htmlFor="acomodacion">Acomodación *</Label>
                <Select onValueChange={(value) => setValue("acomodacion", value as any)} disabled={!tipoHabitacion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione acomodación" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoHabitacion &&
                      acomodacionesPorTipo[tipoHabitacion]?.map((acomodacion) => (
                        <SelectItem key={acomodacion} value={acomodacion}>
                          {getAcomodacionLabel(acomodacion)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.acomodacion && <p className="text-sm text-red-600">{errors.acomodacion.message}</p>}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Agregar Configuración
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de configuraciones */}
      {hotel.habitacionesConfiguradas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Configuraciones Actuales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hotel.habitacionesConfiguradas.map((config) => (
                <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-lg font-semibold">
                      {config.cantidad}
                    </Badge>
                    <div className="flex flex-col">
                      <span className="font-medium">{getTipoLabel(config.tipoHabitacion)}</span>
                      <span className="text-sm text-gray-600">{getAcomodacionLabel(config.acomodacion)}</span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeConfiguration(config.id)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reglas de validación */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Reglas de Acomodación</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Estándar</Badge>
            <span>→ Sencilla o Doble</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Junior</Badge>
            <span>→ Triple o Cuádruple</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Suite</Badge>
            <span>→ Sencilla, Doble o Triple</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
