import { Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import Home from "@/pages/Home";
import Cliente from "@/pages/Cliente";
import  Fornecedor  from "@/pages/Fornecedor";
import ItensPedido from "@/pages/ItemPedido";
import Order from "@/pages/Pedido";
import Transaction from "@/pages/Transacao";
import Product from "@/pages/Produto";




function CustomRoutes () {
    return (
        <Routes>
            <Route path="*" element={<LoginPage />}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/home" element={<Home />}/>
            <Route path="/client" element={<Cliente />}/>
            <Route path="/fornecedor" element={<Fornecedor />}/>
            <Route path="/itemPedido" element={<ItensPedido />}/>
            <Route path="/order" element={<Order/>}/>
            <Route path="/transacao" element={<Transaction/>}/>
            <Route path="/produto" element={<Product/>}/>

        </Routes>
    )
}

export default CustomRoutes;