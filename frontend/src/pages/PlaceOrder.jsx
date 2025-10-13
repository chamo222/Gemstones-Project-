import React, { useContext, useState } from 'react'
import CartTotal from '../components/CartTotal'
import Footer from '../components/Footer'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const { navigate, backendUrl, cartItems, setCartItems, getCartAmount, delivery_charges, foods, token } = useContext(ShopContext)

  const [method, setMethod] = useState('cod') // Default set to cash on delivery

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  })

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value

    setFormData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      let orderItems = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(foods.find(food => food._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_charges
      }

      switch (method) {
        // api for COD method
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
          console.log(response.data)
          if (response.data.success) {
            setCartItems({})
            navigate('/orders')
          }
          else {
            toast.error(response.data.message)
          }
          break;
        // api for stripe method
        case 'stripe':
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } })
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data
            window.location.replace(session_url)
          }
          else {
            toast.error(responseStripe.data.message)
          }

          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <section className='max-padd-container mt-24'>
      {/* Container */}
      <form onSubmit={onSubmitHandler} className='py-6'>
        <div className='flex flex-col xl:flex-row gap-20 xl:gap-28'>

          {/* Left side  delivery information */}
          <div className='flex flex-1 flex-col gap-3 text-[95%]'>
            <Title title1={'Delivery'} title2={'Information'} title1Styles={'h3'} />
            <div className='flex gap-3'>
              <input required onChange={onChangeHandler} value={formData.firstName} type="text" name='firstName' placeholder='First Name' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none' />
              <input required onChange={onChangeHandler} value={formData.lastName} type="text" name='lastName' placeholder='Last Name' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none' />
            </div>
            <input required onChange={onChangeHandler} value={formData.email} type="email" name='email' placeholder='Email' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none' />
            <input required onChange={onChangeHandler} value={formData.phone} type="text" name='phone' placeholder='Phone Number' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none' />
            <input required onChange={onChangeHandler} value={formData.street} type="text" name='street' placeholder='Street' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none' />
            <div className='flex gap-3'>
              <input required onChange={onChangeHandler} value={formData.city} type="text" name='city' placeholder='City' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none' />
              <input required onChange={onChangeHandler} value={formData.zipcode} type="text" name='zipcode' placeholder='Zip Code' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none' />
              {/*<input required onChange={onChangeHandler} value={formData.state} type="text" name='state' placeholder='State' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none' /> */}
            </div>
            <div className='flex gap-3'>
              {/*<input required onChange={onChangeHandler} value={formData.zipcode} type="text" name='zipcode' placeholder='Zip Code' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none' /> */}
              {/* <input required onChange={onChangeHandler} value={formData.country} type="text" name='country' placeholder='Country' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none' /> */}
            </div>
          </div>

          {/* Right side  Cart total */}
          <div className='flex flex-1 flex-col'>
            <CartTotal />
            {/* payment method */}
            <div className='my-6'>
              <h3 className='bold-20 mb-5'>Payment <span className='text-[#4169E1]'>Method</span></h3>
              <div className='flex gap-3'>
                <div onClick={() => setMethod('stripe')} className={`${method === 'stripe' ? "btn-secondary" : "btn-light"} !py-1 text-xs cursor-pointer`}>Stripe</div>
                <div onClick={() => setMethod('cod')} className={`${method === 'cod' ? "btn-secondary" : "btn-light"} !p-1 !px-3 text-xs cursor-pointer`}>Cash on Delivery</div>
              </div>
            </div>
            <div>
              <button type='submit' className='btn-dark !rounded'>Place Order</button>
            </div>
          </div>
        </div>
      </form>

      <Footer />
    </section>
  )
}

export default PlaceOrder