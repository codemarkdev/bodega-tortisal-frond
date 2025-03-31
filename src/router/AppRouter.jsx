import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/context/AuthContext";
import { TortisalRouter } from "./TortisalRouter";
import { LoginPage } from "../auth/login/pages/LoginPage";


const AppRouter = () => {
    const { logged } = useContext(AuthContext);

    return ( 
        <>
        <div className="px-6 pt-14 container mx-auto">
        <Routes>
            <Route 
                path="login" 
                element={logged ? <Navigate to="/" /> : <LoginPage />} 
            />
            <Route 
                path="register" 
                element={logged ? <Navigate to="/" /> : <LoginPage />} 
            />
            <Route 
                path="/*" 
                element={logged ? <TortisalRouter /> : <Navigate to="/login" />} 
            />
        </Routes>
      </div>
        </>
     );
}
 
export default AppRouter;