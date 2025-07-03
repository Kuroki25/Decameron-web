"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Building2, MapPin, FileText, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Hotel } from "../page"

interface HotelFormProps {
  onHotelCreated: (hotel: Hotel) => void
  existingHotels: Hotel[]
}

interface FormData {
  nombre: string
  direccion: string
  ciudad: string
  nit: string
  numeroHabitaciones: number
}

const ciudades = [
  "CARTAGENA",
  "BOGOTÁ",
  "MEDELLÍN",
  "CALI",
  "BARRANQUILLA",
  "BUCARAMANGA",
  "PEREIRA",
  "SANTA MARTA",
  "MANIZALES",
  "PASTO",
  "IBAGUÉ",
  "CUCUTA",
  "VILLAVICENCIO",
  "MONTERÍA",
  "VALLEDUPAR",
]

export function HotelForm({ onHotelCreated, existingHotels }: HotelFormProps) {
  const [error, setError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>()

  const validateNIT = (nit: string) => {
    const nitRegex = /^\d{8,10}-\d{1}$/
    return nitRegex.test(nit)
  }

  const onSubmit = async (data: FormData) => {
    setError("")
    setIsSubmitting(true)

    try {
      // Validar que no exista un hotel con el mismo nombre
      const hotelExists = existingHotels.some((hotel) => hotel.nombre.toLowerCase() === data.nombre.toLowerCase())

      if (hotelExists) {
        setError("Ya existe un hotel registrado con este nombre")
        setIsSubmitting(false)
        return
      }

      // Validar que no exista un hotel con el mismo NIT
      const nitExists = existingHotels.some((hotel) => hotel.nit === data.nit)

      if (nitExists) {
        setError("Ya existe un hotel registrado con este NIT")
        setIsSubmitting(false)
        return
      }

      // Validar formato del NIT
      if (!validateNIT(data.nit)) {
        setError("El formato del NIT debe ser: 12345678-9")
        setIsSubmitting(false)
        return
      }

      // Crear el hotel
      const newHotel: Hotel = {
        id: Date.now().toString(),
        nombre: data.nombre.toUpperCase(),
        direccion: data.direccion.toUpperCase(),
        ciudad: data.ciudad,
        nit: data.nit,
        numeroHabitaciones: data.numeroHabitaciones,
        habitacionesConfiguradas: [],
      }

      onHotelCreated(newHotel)
      reset()
    } catch (err) {
      setError("Error al registrar el hotel")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre del Hotel */}
        <div className="space-y-2">
          <Label htmlFor="nombre" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Nombre del Hotel *
          </Label>
          <Input
            id="nombre"
            placeholder="DECAMERON CARTAGENA"
            {...register("nombre", {
              required: "El nombre del hotel es obligatorio",
              minLength: { value: 3, message: "El nombre debe tener al menos 3 caracteres" },
            })}
          />
          {errors.nombre && <p className="text-sm text-red-600">{errors.nombre.message}</p>}
        </div>

        {/* Dirección */}
        <div className="space-y-2">
          <Label htmlFor="direccion" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Dirección *
          </Label>
          <Input
            id="direccion"
            placeholder="CALLE 23 58-25"
            {...register("direccion", {
              required: "La dirección es obligatoria",
              minLength: { value: 5, message: "La dirección debe tener al menos 5 caracteres" },
            })}
          />
          {errors.direccion && <p className="text-sm text-red-600">{errors.direccion.message}</p>}
        </div>

        {/* Ciudad */}
        <div className="space-y-2">
          <Label htmlFor="ciudad" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Ciudad *
          </Label>
          <Select onValueChange={(value) => setValue("ciudad", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una ciudad" />
            </SelectTrigger>
            <SelectContent>
              {ciudades.map((ciudad) => (
                <SelectItem key={ciudad} value={ciudad}>
                  {ciudad}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.ciudad && <p className="text-sm text-red-600">{errors.ciudad.message}</p>}
        </div>

        {/* NIT */}
        <div className="space-y-2">
          <Label htmlFor="nit" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            NIT *
          </Label>
          <Input
            id="nit"
            placeholder="12345678-9"
            {...register("nit", {
              required: "El NIT es obligatorio",
              pattern: {
                value: /^\d{8,10}-\d{1}$/,
                message: "Formato de NIT inválido (ej: 12345678-9)",
              },
            })}
          />
          {errors.nit && <p className="text-sm text-red-600">{errors.nit.message}</p>}
        </div>

        {/* Número de Habitaciones */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="numeroHabitaciones" className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Número Máximo de Habitaciones *
          </Label>
          <Input
            id="numeroHabitaciones"
            type="number"
            min="1"
            max="1000"
            placeholder="42"
            {...register("numeroHabitaciones", {
              required: "El número de habitaciones es obligatorio",
              min: { value: 1, message: "Debe tener al menos 1 habitación" },
              max: { value: 1000, message: "No puede exceder 1000 habitaciones" },
              valueAsNumber: true,
            })}
          />
          {errors.numeroHabitaciones && <p className="text-sm text-red-600">{errors.numeroHabitaciones.message}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting ? "Registrando..." : "Registrar Hotel"}
        </Button>
      </div>
    </form>
  )
}
