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
import { AddEmployee } from "../employees/pages/AddEmployee"
import { EditEmployee } from "../employees/pages/EditEmployee"
import { EmployeeDetail } from "../employees/pages/EmployeeDetail"
import { ToolsIssuedPage } from "../tools-issued/pages/ToolsIssuedPage"
import { UserPage } from "../users/pages/UserPage"
import { EditUserPage } from "../users/pages/EditUserPage"
import { UserAddPage } from "../users/pages/UserAddPage"
import { ShiftsPage } from "../shifts/pages/ShiftsPage";
import { ShiftsAddPage } from "../shifts/pages/ShiftsAddPage";
import { ShiftsHistory } from "../shifts/pages/ShiftsHistory";
export const TortisalRouter = () => {
  const { logged } = useContext(AuthContext)

  if (!logged) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductsPage />}></Route>
        <Route path="products" element={<ProductsPage />}></Route>
        <Route path="products/edit/:id" element={<EditProducts />}></Route>
        <Route path="products/create" element={<AddProdutcs />}></Route>
        <Route path="products/search" element={<ProductSearch />}></Route>
        <Route path="products/stock/:id" element={<Stocks />}></Route>

        {/* Rutas de empleados */}
        <Route path="employees" element={<EmployeesPage />}></Route>
        <Route path="employees/:id" element={<EmployeeDetail />}></Route>
        <Route path="employees/edit/:id" element={<EditEmployee />}></Route>
        <Route path="employees/create" element={<AddEmployee />}></Route>

        {/* Rutas de usuarios */}
        <Route path="users" element={<UserPage />}></Route>
        <Route path="users/:id" element={<EditUserPage />}></Route>
        <Route path="users/add" element={<UserAddPage />}></Route>

        {/* Rutas de herramientas entregadas */}
        <Route path="tools-issued" element={<ToolsIssuedPage />}></Route>


        <Route path="shifts" element={<ShiftsPage />}></Route>
        <Route path="shifts/:id" element={<ShiftsHistory />}></Route>
        <Route path="shifts/add" element={<ShiftsAddPage />}></Route>
      </Routes>
    </>
  )
}

