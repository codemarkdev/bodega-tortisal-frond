"use client" // Indica que este componente debe ejecutarse en el cliente (por ejemplo en Next.js)

// Importación de hooks y utilidades necesarias
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { columsInventario } from "../../../confiTable" // Columnas de la tabla de inventario
import { Edit, Table, Trash } from "../../ui" // Iconos y componente de tabla
import apiRequest from "../../helpers/ApiRequest" // Función para hacer peticiones a la API
import { DeleteProducto } from "./DeleteProducto" // Componente para confirmar eliminación
import { ProductSearch } from "./ProductSearch" // Componente para búsqueda de productos

// Componente principal de la página de productos/inventario
export const ProductsPage = () => {
  const navigate = useNavigate() // Hook para navegación programática

  const [listProducts, setListProducts] = useState([]) // Lista de productos
  const [isLoading, setIsLoading] = useState(false) // Estado de carga
  const [error, setError] = useState(null) // Estado de error
  const [productToDelete, setProductToDelete] = useState(null) // Producto que se quiere eliminar
  const [isSearching, setIsSearching] = useState(false) // Si se está haciendo una búsqueda
  const [currentSearchTerm, setCurrentSearchTerm] = useState("") // Término de búsqueda actual

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Función para obtener los productos desde la API (puede incluir búsqueda)
  const getproducts = async (search = "", page = 1) => {
    setIsLoading(true)
    setError(null)

    try {
      // Si hay búsqueda, usa el endpoint de búsqueda; si no, lista general paginada
      const endpoint = search
        ? `products/search?name=${encodeURIComponent(search)}`
        : `products?page=${page}&limit=${pagination.itemsPerPage}`

      const response = await apiRequest({
        method: "GET",
        path: endpoint,
      })

      if (response.status === 200) {
        const data = response.data
     console.log('data', data)
          setListProducts(data.data);
          setPagination((prev) => ({
            ...prev,
            totalItems: data.total || 0,
            currentPage: page,
          }));
    
      } else {
        // Error de respuesta (no 200)
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

  // Al montar el componente, se hace la carga inicial de productos
  useEffect(() => {
    getproducts()
  }, [])

  // Cuando el usuario busca algo
  const handleSearch = (searchTerm) => {
    setIsSearching(true)
    setCurrentSearchTerm(searchTerm)
    getproducts(searchTerm)
  }

  const handlePageChange = (page) => {
    getproducts(currentSearchTerm, page);
  };

  // Cuando el usuario presiona "Editar"
  const handleEdit = (id) => {
    navigate(`/products/edit/${id}`)
  }

  // Cuando el usuario presiona "Eliminar"
  const handleDelete = (product) => {
    setProductToDelete(product)
  }

  // Cuando el usuario cancela la eliminación
  const handleCancelDelete = () => {
    setProductToDelete(null)
  }

  // Después de eliminar exitosamente
  const handleSuccessDelete = () => {
    getproducts(currentSearchTerm, pagination.currentPage) // Se vuelve a cargar la lista actual
    setProductToDelete(null)
  }

  // Cuando el usuario presiona "Agregar Inventario"
  const handleAddProduct = () => {
    navigate("/products/create")
  }

  // Cuando el usuario presiona "Stock"
  const handleManageStock = (id) => {
    navigate(`/products/stock/${id}`)
  }

  // Acciones que tendrá cada fila en la tabla
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

  // Render de la interfaz
  return (
    <div>
      {/* Componente de búsqueda */}
      <ProductSearch onSearch={handleSearch} isSearching={isSearching} standalone={false} />

      {/* Mostrar error si existe */}
      {error && <div className="error-message mb-4">{error}</div>}

      {/* Mostrar loader o tabla */}
      {isLoading ? (
        <div>Cargando productos...</div>
      ) : (
        <Table
          title={currentSearchTerm ? `Resultados para "${currentSearchTerm}"` : "Herramientas"}
          columns={columsInventario}
          actions={actions}
          addButtonText="Agregar Inventario"
          onAddClick={handleAddProduct}
          data={listProducts || []}
          paginationProps={{
            itemsPerPage: pagination.itemsPerPage,
            totalItems: pagination.totalItems,
            currentPage: pagination.currentPage,
            onPageChange: handlePageChange,
          }}
        />
      )}

      {/* Modal para confirmar eliminación de producto */}
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
