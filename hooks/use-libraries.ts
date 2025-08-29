"use client"

import { useState, useEffect } from "react"
import type { Biblioteca, CreateBibliotecaDTO } from "@/types/entities"

interface UseLibrariesReturn {
  bibliotecas: Biblioteca[]
  loading: boolean
  error: string | null
  createBiblioteca: (data: CreateBibliotecaDTO) => Promise<void>
  refreshBibliotecas: () => Promise<void>
}

export function useLibraries(): UseLibrariesReturn {
  const [bibliotecas, setBibliotecas] = useState<Biblioteca[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBibliotecas = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/bibliotecas")
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch bibliotecas")
      }

      setBibliotecas(result.data)
    } catch (err) {
      console.error("Error fetching bibliotecas:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch bibliotecas")
    } finally {
      setLoading(false)
    }
  }

  const createBiblioteca = async (data: CreateBibliotecaDTO) => {
    try {
      setError(null)
      const response = await fetch("/api/bibliotecas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to create biblioteca")
      }

      // Refresh the list after creating
      await fetchBibliotecas()
    } catch (err) {
      console.error("Error creating biblioteca:", err)
      setError(err instanceof Error ? err.message : "Failed to create biblioteca")
      throw err
    }
  }

  useEffect(() => {
    fetchBibliotecas()
  }, [])

  return {
    bibliotecas,
    loading,
    error,
    createBiblioteca,
    refreshBibliotecas: fetchBibliotecas,
  }
}
