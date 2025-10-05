import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import PlaceOrder from "./pages/PlaceOrder";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Verify from "./pages/Verify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header";
import Contact from "./pages/Contact";
import Menu from "./pages/Menu";
import About from "./pages/About";

export default function App() {
  return (
    <main className="overflow-hidden text-[#404040] bg-primary">
      <ToastContainer />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </main>
  )
}