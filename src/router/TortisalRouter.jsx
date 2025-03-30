import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/context/AuthContext";
import { Navbar } from "../ui";
import { ProductsPage } from "../products/pages/ProductPage";
import { EmployeesPage } from "../employees/pages/EmployeesPage";
import { ToolsIssuedPage } from "../tools-issued/pages/ToolsIssuedPage";

export const TortisalRouter = () => {
    const { logged } = useContext(AuthContext);

    if (!logged) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<ProductsPage />}></Route>
                <Route path="employees" element={<EmployeesPage/>}></Route>
                <Route path="user" element={<ProductsPage />}></Route>
                <Route path="tools-issued" element={<ToolsIssuedPage />}></Route>
                <Route path="shift" element={<ProductsPage />}></Route>
            </Routes>
        </>
    );
};