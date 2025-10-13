import React from 'react'

const Title = ({ title1, title2, titleStyles, title1Styles, paraStyles }) => {
  return (
    <div className={`${titleStyles} pb-1`}>
      <h2 className={`${title1Styles} h2`}>{title1}
        <span className='text-[#4169E1]  !font-light'> {title2}</span>
      </h2>
      <p className={`${paraStyles} hidden`}>Our food products are crafted with the finest ingredients to <br />
        deliver exceptional taste and quality.</p>
    </div>
  )
}

export default Title