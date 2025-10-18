import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backend_url, currency } from '../App'
import { toast } from 'react-toastify'
import { TbTrash, TbEdit } from 'react-icons/tb'
import { FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import { motion, AnimatePresence } from 'framer-motion'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteProductId, setDeleteProductId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAll, setShowAll] = useState(false)
  const navigate = useNavigate()

  const fetchList = async () => {
    setLoading(true)
    try {
      const response = await axios.get(backend_url + '/api/product/list')
      if (response.data.success) {
        setTimeout(() => {
          setList(response.data.products)
          setLoading(false)
        }, 1000)
      } else {
        toast.error(response.data.message)
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      setLoading(false)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backend_url + '/api/product/remove',
        { id },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        setDeleteProductId(null)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const editProduct = (id) => {
    navigate(`/edit/${id}`)
  }

  useEffect(() => {
    fetchList()
  }, [])

  // Loading overlay
  const LoadingOverlay = ({ text }) => (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="w-20 h-20 bg-[#4169E1]/80 rounded-lg shadow-lg flex items-center justify-center text-white text-4xl"
      >
        📦
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.5, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="mt-4 text-white font-semibold text-lg"
      >
        {text}
      </motion.p>
    </motion.div>
  )

  // Filtered products based on search term
  const filteredList = list.filter(product =>
    product._id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Limit displayed products if showAll is false
  const displayedList = showAll ? filteredList : filteredList.slice(0, 10)

  return (
    <div className="px-2 sm:px-8 mt-16 min-h-screen relative">
      {/* Loading */}
      <AnimatePresence>
        {loading && <LoadingOverlay text="Loading Products..." />}
      </AnimatePresence>

      {/* Search Bar */}
      <div className="mb-4 flex justify-end">
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search by Product ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 p-3 border-2 border-[#4169E1] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm sm:text-base"
          />
          <FiSearch className="absolute right-3 top-3 text-gray-400 text-lg" />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteProductId && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-xl font-semibold text-[#4169E1] mb-4">Confirm Delete</h3>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteProductId(null)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => removeProduct(deleteProductId)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product List */}
      <div className="flex flex-col gap-3">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-[1fr_1fr_3fr_1fr_1fr_1fr_1fr] items-center py-2 px-2 bg-white bold-14 sm:bold-15 mb-3 rounded shadow">
          <h5>ID</h5>
          <h5>Image</h5>
          <h5>Name</h5>
          <h5>Category</h5>
          <h5>Price</h5>
          <h5>Edit</h5>
          <h5>Remove</h5>
        </div>

        {displayedList.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Desktop row */}
            <div className="hidden md:grid grid-cols-[1fr_1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 p-1">
              <div className="text-sm font-semibold">{item._id.slice(-6).toUpperCase()}</div>
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
              <h5 className="text-sm font-semibold">{item.name}</h5>
              <p className="font-semibold">{item.category}</p>
              <div className="text-sm font-semibold">
                {currency}
                {Object.values(item.price)[0]}
              </div>
              <TbEdit onClick={() => editProduct(item._id)} className="text-center cursor-pointer text-lg text-blue-500" />
              <TbTrash onClick={() => setDeleteProductId(item._id)} className="text-center cursor-pointer text-lg text-red-500" />
            </div>

            {/* Mobile stacked version */}
            <div className="md:hidden flex flex-col gap-2 p-3 border-b last:border-b-0">
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 flex flex-col gap-1">
                  <h5 className="font-semibold text-sm truncate">{item.name}</h5>
                  <p className="text-gray-600 text-sm">{item.category}</p>
                  <p className="text-gray-500 text-xs">ID: {item._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="font-semibold">{currency}{Object.values(item.price)[0]}</div>
                <div className="flex gap-4">
                  <TbEdit onClick={() => editProduct(item._id)} className="text-blue-500 cursor-pointer text-lg" />
                  <TbTrash onClick={() => setDeleteProductId(item._id)} className="text-red-500 cursor-pointer text-lg" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More / Show Less */}
      {filteredList.length > 10 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-[#4169E1] text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition-colors"
          >
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="mt-10">
        <Footer />
      </div>
    </div>
  )
}

export default List