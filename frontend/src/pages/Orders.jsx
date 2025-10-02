import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaBox, FaShippingFast, FaTruck, FaHome } from 'react-icons/fa'; // Importing React Icons
import Title from '../components/Title';
import Footer from "../components/Footer";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
      if (response.data.success) {
        let allOrdersItem = [];

        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <section className='max-padd-container mt-24'>
      <div className='pt-6 pb-20'>
        <Title title1={'Orders'} title2={'List'} titleStyles={'h3'} />
        {orderData.map((item, i) => (
          <div key={i} className='p-2 rounded-xl bg-white mt-2'>
            <div className='text-gray-700 flex flex-col gap-4'>
              <div className='flex gap-x-3 w-full'>
                <div className='flexCenter p-2 bg-primary'>
                  <img src={item.image} alt="" className='w-16 sm:w-18' />
                </div>
                <div className='block w-full'>
                  <h5 className='h5 capitalize line-clamp-1'>{item.name}</h5>
                  <div className='flex gap-x-2 sm:flex-row sm:justify-between'>
                    <div className='text-xs'>
                      <div className='flex items-center gap-x-2 sm:gap-x-3'>
                        <div className='flexCenter gap-x-2'>
                          <h5 className='medium-14'>Price:</h5>
                          <p>{currency}{item.price[item.size]}</p>
                        </div>
                        <div className='flexCenter gap-x-2'>
                          <h5 className='medium-14'>Quantity:</h5>
                          <p>{item.quantity}</p>
                        </div>
                        <div className='flexCenter gap-x-2'>
                          <h5 className='medium-14'>Size:</h5>
                          <p>{item.size}</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-x-2'>
                        <h5 className='medium-14'>Date:</h5>
                        <p className='text-gray-400'>{new Date(item.date).toDateString()}</p>
                      </div>
                      <div className='flex items-center gap-x-2'>
                        <h5 className='medium-14'>Payment:</h5>
                        <p className='text-gray-400'>{item.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Progress Bar Under Order Details */}
              <div className='order-progress-bar'>
                <div className='progress-icons'>
                  {['Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered'].map((stage, index) => (
                    <div
                      key={index}
                      className={`progress-icon ${item.status === stage ? 'active' : ''}`}
                    >
                      {/* Use appropriate icons */}
                      {stage === 'Order Placed' && <FaCheckCircle />}
                      {stage === 'Packing' && <FaBox />}
                      {stage === 'Shipped' && <FaShippingFast />}
                      {stage === 'Out for Delivery' && <FaTruck />}
                      {stage === 'Delivered' && <FaHome />}
                      <p>{stage}</p>
                    </div>
                  ))}
                </div>
                <div className='progress-lines'>
                  {['Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered'].map((stage, index) => (
                    <div
                      key={index}
                      className={`progress-line ${item.status === stage || item.status > stage ? 'active' : ''}`}
                    />
                  ))}
                </div>
                <button className="order-tracking-button" onClick={refreshPage}>
                  Refresh Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </section>
  );
};

export default Orders;