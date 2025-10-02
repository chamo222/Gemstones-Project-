import React from 'react'
import Footer from '../components/Footer'
import { FaEnvelope, FaHeadphones, FaLocationDot, FaPhone } from 'react-icons/fa6'
import Title from "../components/Title"


const Contact = () => {
  return (
    <section className='max-padd-container mt-24'>
      {/* Contact Form and Details */}
      <div className="flex flex-col xl:flex-row gap-20 py-6">
        {/* Contact Form */}
        <div>
          {/* Title */}
          <Title title1={'Get'} title2={'in Touch'} title1Styles={'h3'} />
          <p className="mb-5 max-w-xl">
            Have questions or need help? Send us a message, and we'll get back
            to you as soon as possible.
          </p>
          <form>
            <div className='flex gap-x-5'>
              <div className="w-1/2 mb-4">
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  className="w-full mt-1 py-1.5 px-3 border-none ring-1 ring-slate-900/5 regular-14 rounded"
                />
              </div>
              <div className="w-1/2 mb-4">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full mt-1 py-1.5 px-3 border-none ring-1 ring-slate-900/5 regular-14 rounded"
                />
              </div>
            </div>
            <div className="mb-4">
              <textarea
                id="message"
                rows="4"
                placeholder="Write your message here"
                className="w-full mt-1 py-1.5 px-3 border-none ring-1 ring-slate-900/5 regular-14 rounded resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn-dark !rounded shadow-sm"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Details */}
        <div>
          {/* Title */}
          <Title title1={'Contact'} title2={'Details'} title1Styles={'h3'} />
          <p className="max-w-xl mb-4">We are always here to assist you! Feel free to reach out to us through any of the following methods
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <h5 className="h5 capitalize mr-4">
                location:
              </h5>
              <p className='flexStart gap-x-2'><FaLocationDot /> NO.394/3 Kirillawala, Kadawatha 11850</p>
            </div>
            <div className="flex flex-col">
              <h5 className="h5 capitalize mr-4">email:</h5>
              <p className='flexStart gap-x-2'><FaEnvelope /> thediasrestaurant@gmail.com</p>
            </div>
            <div className="flex flex-col">
              <h5 className="h5 capitalize mr-4">phone:</h5>
              <p className='flexStart gap-x-2'><FaPhone /> +94 (070) 338 0624</p>
            </div>
            <div className="flex flex-col">
              <h5 className="h5 capitalize mr-4">
                Support:
              </h5>
              <p className='flexStart gap-x-2'><FaHeadphones /> 24/7 Support is open</p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Map */}
      <div class="py-20">
        {/* Title */}
        <Title title1={'Find'} title2={'us Here'} title1Styles={'h3'} />
        <div class="w-full h-96 rounded-lg overflow-hidden shadow-md">
          <iframe className='w-full h-full' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.85118018397!2d79.9776108743842!3d7.026772992975024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2f9dd6246d741%3A0xbcd12a4d52a7c469!2sThe%20Dias%20Restaurant!5e0!3m2!1sen!2slk!4v1742989519584!5m2!1sen!2slk" allowfullscreen="" loading="lazy" ></iframe>
        </div>
      </div>

      <Footer />
    </section>

  )
}

export default Contact