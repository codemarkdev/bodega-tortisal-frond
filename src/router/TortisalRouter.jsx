import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/context/AuthContext";
import { Navbar } from "../ui";
import { ProductsPage } from "../products/pages/ProductPage";
import { EmployeesPage } from "../employees/pages/EmployeesPage";
import { ToolsIssuedPage } from "../tools-issued/pages/ToolsIssuedPage";
import { UserPage } from "../users/pages/UserPage";
import { EditUserPage } from "../users/pages/EditUserPage";
import { UserAddPage } from "../users/pages/UserAddPage";
import { ShiftsPage } from "../shifts/pages/ShiftsPage";
import { ShiftsAddPage } from "../shifts/pages/ShiftsAddPage";
import { ShiftsHistory} from "../shifts/pages/ShiftsHistory";

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
                <Route path="employees/:id" element={<UserPage/>}></Route>
                <Route path="users" element={<UserPage/>}></Route>
                <Route path="users/:id" element={<EditUserPage/>}></Route>
                <Route path="users/add" element={<UserAddPage/>}></Route>
                <Route path="tools-issued" element={<ToolsIssuedPage />}></Route>
                <Route path="shifts" element={<ShiftsPage />}></Route>
                <Route path="shifts/:id" element={<ShiftsHistory/>}></Route>
                <Route path="shifts/add" element={<ShiftsAddPage />}></Route>
            </Routes>
        </>
    );
};