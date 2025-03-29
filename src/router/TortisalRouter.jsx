import { Route, Routes } from "react-router-dom";
import { Navbar } from "../ui";
import { ProductsPage } from "../products/pages/ProductPage";
import { EmployeesPage } from "../employees/pages/EmployeesPage";
import { ToolsIssuedPage } from "../tools-issued/pages/ToolsIssuedPage";

export const TortisalRouter = () => {
    return (<>
        <Navbar />
        <Routes>
            <Route path="/" element={<ProductsPage />}></Route>
            <Route path="employees" element={<EmployeesPage/>}></Route>
            <Route path="user" element={<ProductsPage />}></Route>
            <Route path="tools-issued" element={<ToolsIssuedPage />}></Route>
            <Route path="shift" element={<ProductsPage />}></Route>
            
        </Routes>

    </>);
}