import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaBox, FaShippingFast, FaTruck, FaHome } from 'react-icons/fa';
import Title from '../components/Title';
import Footer from "../components/Footer";
import { io as socketClient } from 'socket.io-client';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const stages = ['Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered'];

  // Fetch user orders
  const loadOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Initialize socket
  useEffect(() => {
    const socket = socketClient(backendUrl);

    // New order placed
    socket.on('newOrder', (newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
      toast.info('🔔 New order placed!');
    });

    // Order status updated
    socket.on('orderUpdated', (updatedOrder) => {
      setOrders(prev =>
        prev.map(order => order._id === updatedOrder._id ? updatedOrder : order)
      );
    });

    return () => socket.disconnect();
  }, [backendUrl]);

  useEffect(() => {
    loadOrders();
  }, [token]);

  // Group items by order ID for display
  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order._id]) acc[order._id] = order;
    return acc;
  }, {});

  const openTrackingModal = (orderId) => setTrackingOrderId(orderId);
  const closeTrackingModal = () => setTrackingOrderId(null);

  return (
    <section className='max-padd-container mt-24'>
      <div className='pt-6 pb-20'>
        <Title title1='Orders' title2='List' titleStyles='h3' />

        {Object.values(groupedOrders).map(order => (
          <div key={order._id} className='p-4 rounded-xl bg-white mt-4 shadow-md border'>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
              <div>
                <p className='text-gray-500 text-sm'>Order ID: <span className='font-medium'>{order._id.slice(-6).toUpperCase()}</span></p>
                <p className='text-gray-500 text-sm'>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => openTrackingModal(order._id)}
                className='bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm'
              >
                Track Order
              </button>
            </div>

            <div className='mt-2 space-y-2'>
              {order.items.map((item, idx) => (
                <div key={idx} className='flex items-center gap-3 border-b py-2'>
                  <img src={item.image} alt={item.name} className='w-16 h-16 object-cover rounded-md' />
                  <div className='flex flex-col text-sm'>
                    <span className='font-medium'>{item.name}</span>
                    <span>Size: {item.size}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>Price: {currency}{item.price[item.size]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Tracking Modal */}
        {trackingOrderId && (() => {
          const trackingOrder = orders.find(o => o._id === trackingOrderId);
          if (!trackingOrder) return null;
          return (
            <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center'>
              <div className='bg-white rounded-xl p-6 w-11/12 sm:w-96 relative'>
                <button
                  className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'
                  onClick={closeTrackingModal}
                >
                  ✕
                </button>
                <h3 className='font-semibold text-lg mb-4'>Track Order: {trackingOrder._id.slice(-6).toUpperCase()}</h3>
                <div className='space-y-4'>
                  {stages.map((stage, idx) => (
                    <div key={idx} className='flex items-center gap-3'>
                      <div className={`w-6 h-6 rounded-full flexCenter ${stages.indexOf(trackingOrder.status) >= idx ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                        {stage === 'Order Placed' && <FaCheckCircle />}
                        {stage === 'Packing' && <FaBox />}
                        {stage === 'Shipped' && <FaShippingFast />}
                        {stage === 'Out for Delivery' && <FaTruck />}
                        {stage === 'Delivered' && <FaHome />}
                      </div>
                      <span className={`${stages.indexOf(trackingOrder.status) >= idx ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                        {stage}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={closeTrackingModal}
                  className='mt-6 bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors w-full'
                >
                  Close
                </button>
              </div>
            </div>
          );
        })()}

      </div>
      <Footer />
    </section>
  );
};

export default Orders;