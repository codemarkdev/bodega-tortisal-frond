"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { columsInventario } from "../../../confiTable"
import { Edit, Table, Trash } from "../../ui"
import apiRequest from "../../helpers/ApiRequest"
import { DeleteProducto } from "./DeleteProducto"
import { ProductSearch } from "./ProductSearch"

export const ProductsPage = () => {
  const navigate = useNavigate()
  const [listProducts, setListProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [productToDelete, setProductToDelete] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [currentSearchTerm, setCurrentSearchTerm] = useState("")

  // Función para obtener productos (con o sin búsqueda)
  const getproducts = async (search = "") => {
    setIsLoading(true)
    setError(null)

    try {
      const endpoint = search ? `products/search?name=${encodeURIComponent(search)}` : `products?page=1&limit=10`

      const response = await apiRequest({
        method: "GET",
        path: endpoint,
      })

      if (response.status === 200) {
        const data = response.data

        // Procesamiento de datos para asegurar que tenemos un array
        if (Array.isArray(data)) {
          setListProducts(data)
        } else if (data && typeof data === "object") {
          const productsArray = data.items || data.products || data.results || data.data || []
          setListProducts(Array.isArray(productsArray) ? productsArray : [])
        } else {
          setListProducts([])
        }
      } else {
        setListProducts([])
        setError(`Error al obtener productos. Código: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al realizar la petición:", error)
      setListProducts([])
      setError("Error al conectar con el servidor")
    } finally {
      setIsLoading(false)
      setIsSearching(false)
    }
  }

  useEffect(() => {
    getproducts()
  }, [])

  const handleSearch = (searchTerm) => {
    setIsSearching(true)
    setCurrentSearchTerm(searchTerm)
    getproducts(searchTerm)
  }

  const handleEdit = (id) => {
    navigate(`/products/edit/${id}`)
  }

  const handleDelete = (product) => {
    setProductToDelete(product)
  }

  const handleCancelDelete = () => {
    setProductToDelete(null)
  }

  const handleSuccessDelete = () => {
    getproducts(currentSearchTerm)
    setProductToDelete(null)
  }

  const handleAddProduct = () => {
    navigate("/products/create")
  }

  const handleManageStock = (id) => {
    navigate(`/products/stock/${id}`)
  }

  // Configuración de acciones para la tabla
  const actions = [
    {
      icon: Edit,
      label: "Editar",
      onClick: (product) => handleEdit(product.id),
    },
    {
      icon: null,
      label: "Stock",
      onClick: (product) => handleManageStock(product.id),
    },
    {
      icon: Trash,
      label: "Eliminar",
      onClick: (product) => handleDelete(product),
    },
  ]

  return (
    <div>
      <ProductSearch onSearch={handleSearch} isSearching={isSearching} standalone={false} />

      {error && <div className="error-message mb-4">{error}</div>}

      {isLoading ? (
        <div>Cargando productos...</div>
      ) : (
        <Table
          title={currentSearchTerm ? `Resultados para "${currentSearchTerm}"` : "Inventario"}
          columns={columsInventario}
          actions={actions}
          addButtonText="Agregar Inventario"
          onAddClick={handleAddProduct}
          data={listProducts || []}
        />
      )}

      {productToDelete && (
        <DeleteProducto
          productId={productToDelete.id}
          productName={productToDelete.name}
          onCancel={handleCancelDelete}
          onSuccess={handleSuccessDelete}
        />
      )}
    </div>
  )
}

