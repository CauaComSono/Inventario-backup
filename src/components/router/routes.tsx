import { Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import Home from "@/pages/Home";


function CustomRoutes () {
    return (
        <Routes>
            <Route path="*" element={<LoginPage />}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/home" element={<Home />}/>
        </Routes>
    )
}

export default CustomRoutes;