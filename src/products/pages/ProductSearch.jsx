"use client"

import { useState } from "react"
import apiRequest from "../../helpers/ApiRequest"
import { columsInventario } from "../../../confiTable"
import { Table, Input, Button } from "../../ui"

export const ProductSearch = ({ onSearch, isSearching: externalIsSearching, standalone = true }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  // Determina si estamos en modo independiente o integrado
  const effectiveIsSearching = standalone ? isSearching : externalIsSearching

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchTerm.trim()) {
      setError("Por favor ingrese un término de búsqueda")
      return
    }

    setError(null)

    // Si estamos integrados, delegamos la búsqueda al componente padre
    if (!standalone && onSearch) {
      onSearch(searchTerm)
      return
    }

    // Si somos una página independiente, realizamos la búsqueda nosotros mismos
    setIsSearching(true)

    try {
      const response = await apiRequest({
        method: "GET",
        path: `products/search?name=${encodeURIComponent(searchTerm)}`,
      })

      if (response.status === 200) {
        const data = response.data

        // Procesamiento de datos para asegurar que tenemos un array
        if (Array.isArray(data)) {
          setSearchResults(data)
        } else if (data && typeof data === "object") {
          const productsArray = data.items || data.products || data.results || data.data || []
          setSearchResults(Array.isArray(productsArray) ? productsArray : [])
        } else {
          setSearchResults([])
        }

        setHasSearched(true)
      } else {
        setSearchResults([])
        setError(`Error al buscar productos. Código: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error)
      setSearchResults([])
      setError("Error al conectar con el servidor")
    } finally {
      setIsSearching(false)
    }
  }

  const handleClear = () => {
    setSearchTerm("")
    setHasSearched(false)

    // Si estamos integrados, notificamos al componente padre
    if (!standalone && onSearch) {
      onSearch("")
    }
  }

  const searchForm = (
    <div className="mb-6 p-4 bg-white shadow-sm rounded-lg">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
        <div className="flex-grow">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos por nombre..."
            error={error}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" variant="primary" disabled={effectiveIsSearching}>
            {effectiveIsSearching ? "Buscando..." : "Buscar"}
          </Button>
          {searchTerm && (
            <Button type="button" variant="secondary" onClick={handleClear}>
              Limpiar
            </Button>
          )}
        </div>
      </form>
    </div>
  )

  // Si no somos una página independiente, solo devolvemos el formulario de búsqueda
  if (!standalone) {
    return searchForm
  }

  // Si somos una página independiente, mostramos el formulario y los resultados
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Búsqueda de Productos</h1>

      {searchForm}

      {isSearching ? (
        <div className="text-center py-8">Buscando productos...</div>
      ) : hasSearched ? (
        searchResults.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Resultados de la búsqueda</h2>
            <Table columns={columsInventario} data={searchResults} title={`Resultados para "${searchTerm}"`} />
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-lg text-gray-600">No se encontraron productos que coincidan con "{searchTerm}"</p>
          </div>
        )
      ) : null}
    </div>
  )
}

