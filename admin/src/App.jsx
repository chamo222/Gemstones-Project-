import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { Route, Routes } from "react-router-dom"
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Edit from './pages/Edit';
import Revenue from './pages/Revenue'
import FinancePage from './pages/FinancePage'
import Notification from './pages/Notification'
import Messages from './pages/Messages'
import Contact from './pages/Contact'
import About from './pages/About'
import Support from './pages/Support'
import Users from './pages/Users'


export const backend_url = import.meta.env.VITE_BACKEND_URL
export const currency = "$"

function App() {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : "")

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <main>
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <div className='bg-primary text-[#404040]'>
          <Header />
          <div className='mx-auto max-w-[1440px] flex flex-col sm:flex-row mt-8 sm:mt-4'>
            <Sidebar token={token} setToken={setToken} />
            <Routes>
              <Route path="/add" element={<Add token={token} />} />
              <Route path="/list" element={<List token={token} />} />
              <Route path="/orders" element={<Orders token={token} />} />
              <Route path="/edit/:id" element={<Edit />} /> {/* ✅ Add this */}
              <Route path="/" element={<Revenue />} /> {/* ✅ Add this */}
              <Route path="/finance" element={<FinancePage />} /> {/* ✅ Add this */}
              <Route path="/notification" element={<Notification />} /> {/* ✅ Add this */}
              <Route path="/messages" element={<Messages />} /> {/* ✅ Add this */}
              <Route path="/about" element={<About />} /> {/* ✅ Add this */}
              <Route path="/contact" element={<Contact />} /> {/* ✅ Add this */}
              <Route path="/support" element={<Support />} /> {/* ✅ Add this */}
              <Route path="/users" element={<Users />} /> {/* ✅ Add this */}
            </Routes>
          </div>
        </div>
      )}
    </main>
  )
}

export default App