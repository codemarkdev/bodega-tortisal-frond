"use client"

import { Route, Routes, Navigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../auth/context/AuthContext"
import { Navbar } from "../ui"
import { ProductsPage } from "../products/pages/ProductPage"
import { EditProducts } from "../products/pages/EditProducts"
import { AddProdutcs } from "../products/pages/AddProdutcs"
import { ProductSearch } from "../products/pages/ProductSearch"
import { Stocks } from "../products/pages/Stocks"
import { EmployeesPage } from "../employees/pages/EmployeesPage"
import { ToolsIssuedPage } from "../tools-issued/pages/ToolsIssuedPage"
import { UserPage } from "../users/pages/UserPage"
import { EditUserPage } from "../users/pages/EditUserPage"
import { UserAddPage } from "../users/pages/UserAddPage"

export const TortisalRouter = () => {
  const { logged } = useContext(AuthContext)

  if (!logged) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Rutas de productos */}
        <Route path="/" element={<ProductsPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/edit/:id" element={<EditProducts />} />
        <Route path="products/create" element={<AddProdutcs />} />
        <Route path="products/search" element={<ProductSearch />} />
        <Route path="products/stock/:id" element={<Stocks />} />

        {/* Rutas de empleados */}
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="employees/:id" element={<UserPage />} />

        {/* Rutas de usuarios */}
        <Route path="users" element={<UserPage />} />
        <Route path="users/:id" element={<EditUserPage />} />
        <Route path="users/add" element={<UserAddPage />} />

        {/* Otras rutas */}
        <Route path="tools-issued" element={<ToolsIssuedPage />} />
        <Route path="shift" element={<ProductsPage />} />
      </Routes>
    </>
  )
}

