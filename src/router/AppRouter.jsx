import { Route, Routes } from "react-router-dom";
import { TortisalRouter } from "./TortisalRouter";
import { LoginPage } from "../auth/login/pages/LoginPage";


const AppRouter = () => {
    return ( 
        <>
        <div className="px-6 pt-14 container mx-auto">
        <Routes>
          
            <Route path="login" element={<LoginPage/>}></Route>
            <Route path="register" element={<LoginPage/>}></Route>
            <Route path="/*" element={<TortisalRouter/>}></Route>
            
        </Routes>
      </div>
        </>
     );
}
 
export default AppRouter;